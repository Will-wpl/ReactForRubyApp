pipeline {
  agent { node { label 'rails_base' } }

  options {
    skipStagesAfterUnstable()
    buildDiscarder(logRotator(numToKeepStr: '5'))
    timestamps()
  }

  environment {
    PATH                               = "${env.HOME}/.rbenv/bin:${env.HOME}/.rbenv/shims:$PATH"

    // Slack
    SLACK_CHANNEL                      = "rev-auction-git"
    SLACK_TEAM_DOMAIN                  = "sp-digital"
    SLACK_TOKEN                        = credentials("reverse-auction-slack")

    // Github
    DANGER_GITHUB_API_TOKEN            = credentials('jenkins-bot-git-token')
    DANGER_GITHUB_HOST                 = "code.in.spdigital.sg"
    DANGER_GITHUB_API_BASE_URL         = "https://code.in.spdigital.sg/api/v3/"
    DANGER_OCTOKIT_VERIFY_SSL          = false

    // Cache
    CACHE_BUILDER                      = credentials("CACHE_BUILDER")
    BUILD_CACHES_PATH                  = "https://nexus.in.spdigital.sg/repository/raw-internal/caches/reverse-auction"
    BUILD_CACHE_FOLDERS                = "./vendor/bundle ./node_modules"
  }

  stages {
    stage("Initialize") {
      steps {
        echo "Initialize - default variables"
        script {
          // APP Name
          APP_NAME                    = "reverse-auction"

          // Vault
          VAULT_APP_BASE_PATH         = "secret/reverse-auction/${APP_NAME}"

          // QA branch
          QA_BRANCH                   = "master"

          // Production branch
          PRODUCTION_BRANCH           = ~/^release\-([\S]+)/

          // Deployment Job Path
          DEPLOY_JOB                  = "ReverseAuction/${APP_NAME}-deploy-k8s"

          // BRANCH_NAME_HYPHEN replaces all not alphanumeric to hyphen and to lower case
          // i.e fIx/bRanCh_a-1 ==> fix-branch-a-1
          echo "Initialize - variables from branch name"
          BRANCH_NAME_HYPHEN          = BRANCH_NAME.replaceAll(/\W|_/, "-").toLowerCase()

          // Default values
          // Set Docker container suffix for uniqueness
          CONTAINER_SUFFIX            = "${BRANCH_NAME_HYPHEN}-${BUILD_NUMBER}"

          // Set docker registry
          DOCKER_REG                  = "reverse-auction.azurecr.io"
          DOCKER_CREDS_ID             = "reverse-auction-docker-registry"

          // Set Docker tag
          APP_TAG                     = "${DOCKER_REG}/${APP_NAME}:${BRANCH_NAME_HYPHEN}"
          MIGRATE_TAG                 = "${DOCKER_REG}/${APP_NAME}-migrate:${BRANCH_NAME_HYPHEN}"

          // Vault
          VAULT_APP_ADDR              = "https://vault-qa.in.spdigital.sg"
          VAULT_APP_TOKEN_PATH        = "jenkinsdontsupportv2/apptokens/qa/reverse-auction"
          VAULT_KUBECONFIG_ADDR       = "https://vault-qa.in.spdigital.sg"
          VAULT_KUBECONFIG_TOKEN_PATH = "${VAULT_APP_TOKEN_PATH}"

          switch (BRANCH_NAME_HYPHEN) {
            // QA branch
            case QA_BRANCH:
              VAULT_APP_ADDR              = "https://vault-qa.in.spdigital.sg"
              VAULT_APP_TOKEN_PATH        = "jenkinsdontsupportv2/apptokens/qa/reverse-auction"
              VAULT_KUBECONFIG_ADDR       = "https://vault-qa.in.spdigital.sg"
              VAULT_KUBECONFIG_TOKEN_PATH = "jenkinsdontsupportv2/apptokens/qa/kubeconfig"
              DOCKER_REG                  = "spdadocker.azurecr.io"
              DOCKER_CREDS_ID             = "spdadocker-azurecr-io"
              APP_TAG                     = "${DOCKER_REG}/${APP_NAME}:${CONTAINER_SUFFIX}"
              MIGRATE_TAG                 = "${DOCKER_REG}/${APP_NAME}-migrate:${CONTAINER_SUFFIX}"
              break

            // Production branch
            case PRODUCTION_BRANCH:
              DEPLOY_JOB                  = "ReverseAuction/${APP_NAME}-prod-deploy-k8s"
              VAULT_APP_ADDR              = "https://vault.in.spdigital.sg"
              VAULT_APP_TOKEN_PATH        = "jenkinsdontsupportv2/apptokens/prod/reverse-auction"
              VAULT_KUBECONFIG_ADDR       = "https://vault.in.spdigital.sg"
              VAULT_KUBECONFIG_TOKEN_PATH = "jenkinsdontsupportv2/apptokens/prod/kubeconfig"
              DOCKER_REG                  = "spdadocker.azurecr.io"
              DOCKER_CREDS_ID             = "spdadocker-azurecr-io"
              APP_TAG                     = "${DOCKER_REG}/${APP_NAME}:${CONTAINER_SUFFIX}"
              MIGRATE_TAG                 = "${DOCKER_REG}/${APP_NAME}-migrate:${CONTAINER_SUFFIX}"
              break

            // Feature branches
            default:
              // Use defaults
              break
          }
        }

        echo "Initialize - EXPORT env"
        script {
          // Used by ./Makefile build target
          env.APP_TAG              = APP_TAG
          env.MIGRATE_TAG          = MIGRATE_TAG

          // Used by ./docker-compose.yml
          env.CONTAINER_SUFFIX     = CONTAINER_SUFFIX

          // Docker compose env
          env.COMPOSE_HTTP_TIMEOUT = 180
        }

        // echo "Initialize - Approval stage"
        // script {
        //   APPROVAL_USER_ID     = "darrenmlc@spgroup.com.sg,yongchongye@spgroup.com.sg,hanscca@spgroup.com.sg"
        //   APPROVAL_MENTIONS    = "@darren.mok,@chongye,@hanschristianang"
        //   APPROVAL_MESSAGE     = "Approve to deploy ${BRANCH_NAME}"
        //   APPROVAL_TIMEOUT     = 300
        // }
      }
      post {
        always {
          echo "Variables:"
          echo "BRANCH_NAME                 = ${BRANCH_NAME}"
          echo "BRANCH_NAME_HYPHEN          = ${BRANCH_NAME_HYPHEN}"
          echo "CONTAINER_SUFFIX            = ${CONTAINER_SUFFIX}"
          echo "VAULT_APP_ADDR              = ${VAULT_APP_ADDR}"
          echo "VAULT_APP_BASE_PATH         = ${VAULT_APP_BASE_PATH}"
          echo "VAULT_APP_TOKEN_PATH        = ${VAULT_APP_TOKEN_PATH}"
          echo "VAULT_KUBECONFIG_ADDR       = ${VAULT_KUBECONFIG_ADDR}"
          echo "VAULT_KUBECONFIG_TOKEN_PATH = ${VAULT_KUBECONFIG_TOKEN_PATH}"
          echo "DOCKER_REG                  = ${DOCKER_REG}"
          echo "DOCKER_CREDS_ID             = ${DOCKER_CREDS_ID}"
          echo "APP_TAG                     = ${APP_TAG}"
          echo "MIGRATE_TAG                 = ${MIGRATE_TAG}"
        }
      }
    }

    stage("Prepare Ruby ENV") {
      steps {
        sh "bundle install --path vendor/bundle"
      }
      post {
        failure {
          notifySlack("Prepare Ruby ENV", "FAILURE")
        }
      }
    }

    stage("Prepare Node ENV") {
      steps {
        sh "yarn install"
      }
      post {
        failure {
          notifySlack("Prepare Node ENV", "FAILURE")
        }
      }
    }

    stage("Pre-compile assets for test") {
      steps {
        sh 'RAILS_ENV=test bundle exec rails webpacker:compile'
      }
      post {
        failure {
          notifySlack("Pre-compile assets", "FAILURE")
        }
      }
    }

    stage("Run all test files") {
      steps {
        sh 'RAILS_ENV=test bundle exec rails db:create db:test:prepare'
        sh 'bundle exec rspec spec'
        sh "OCTOKIT_PROXY= bundle exec danger"
      }
      post {
        failure {
          notifySlack("Run all test files", "FAILURE")
        }
      }
    }

    stage("Upload cached folders tar.gz") {
      steps {
        sh '''
          if [ -d "./vendor/bundle" ]; then
            tar -zcf cached_folders.tar.gz ${BUILD_CACHE_FOLDERS} && \
              curl -k --silent --user "${CACHE_BUILDER_USR}:${CACHE_BUILDER_PSW}" --upload-file cached_folders.tar.gz ${BUILD_CACHES_PATH}/cached_folders.tar.gz
          fi
        '''
      }
    }

  stage("Docker Build") {
      parallel {
        stage("app") {
          steps {
            sh "make docker.build.all -j 4"
          }
        }
      }
    }

    stage("Docker login") {
      steps {
        dockerEnv(DOCKER_REG, DOCKER_CREDS_ID) {}
      }
    }

    stage("Docker push") {
      parallel {
        stage("app") {
          steps {
            sh "make docker.push.all"
          }
        }
      }
    }

    // stage("Approval"){
    //   when {
    //     expression {BRANCH_NAME_HYPHEN == PRODUCTION_BRANCH }
    //   }
    //   steps {
    //     requireApproval(APPROVAL_MESSAGE, APPROVAL_USER_ID, APPROVAL_MENTIONS, APPROVAL_TIMEOUT)
    //   }
    // }

    stage("Deploy") {
      when {
        expression {
          !(BRANCH_NAME_HYPHEN ==~ /pr-.*/)
        }
      }
      steps {
        script {
          switch (BRANCH_NAME_HYPHEN) {
            case QA_BRANCH:
              // K8S deployment variables
              KUBE_YAML_PATH              = "qa"
              VAULT_KUBESECRETS_PATH      = "${VAULT_APP_BASE_PATH}/kubesecrets/qa/"
              KUBE_NAMESPACE              = "${APP_NAME}"

              // Cluster 1
              // deployToK8s("secret/kubeconfig/${APP_NAME}.spdaqaaks2", "config", "k8s-deploy-qa-or-prod-cluster1")

              break;

            case PRODUCTION_BRANCH:
              // K8S deployment variables
              KUBE_YAML_PATH              = "prod"
              VAULT_KUBESECRETS_PATH      = "${VAULT_APP_BASE_PATH}/kubesecrets/prod/"
              KUBE_NAMESPACE              = "${APP_NAME}"

              // Cluster 1
              // deployToK8s("secret/kubeconfig/${APP_NAME}.spdaprodaks2", "config", "k8s-deploy-qa-or-prod-cluster1")

              break;

            default:
              // K8S deployment variables
              KUBE_YAML_PATH              = "dev"
              VAULT_KUBESECRETS_PATH      = "${VAULT_APP_BASE_PATH}/kubesecrets/dev/"
              KUBE_NAMESPACE              = "${APP_NAME}-${BRANCH_NAME_HYPHEN}"

              deployToK8s("secret/reverse-auction/kubeconfig", "dev", "k8s-deploy-feature")

              break;
          }
        }
      }
      post {
        always {
          echo "KUBE_YAML_PATH              = ${KUBE_YAML_PATH}"
          echo "VAULT_KUBESECRETS_PATH      = ${VAULT_KUBESECRETS_PATH}"
          echo "KUBE_NAMESPACE              = ${KUBE_NAMESPACE}"
        }
        success {
          script {
            // Set build status for `changed` post task
            currentBuild.result = 'SUCCESS'
          }
        }
        failure {
          script {
            currentBuild.result = 'FAILURE'
          }
        }
      }
    }
  }
}

// def requireApproval(String message, String approvers, String mentions, int timeOutInSec){
//   try {
//       sendSlackApproval(mentions)
//       timeout(time: timeOutInSec, unit: 'SECONDS') {
//         input(submitter: approvers, message: message)
//       }
//   } catch (err) {
//       currentBuild.result = 'ABORTED'
//       throw err
//   }
// }

// def sendSlackApproval(String slackMentions){
//   DECODED_JOB_NAME = java.net.URLDecoder.decode("${env.JOB_NAME}", "UTF-8");
//   channel = (slackMentions == null ? "${env.SLACK_CHANNEL}" : "${env.SLACK_CHANNEL}," + slackMentions)
//   slackSend([
//     channel: channel,
//     color: '#FFA500',
//     message: "${DECODED_JOB_NAME} [${env.BUILD_DISPLAY_NAME}] - ${env.BRANCH_NAME} \nAPPROVAL - (<${env.BUILD_URL}/input|Click here to approve/reject>)",
//     teamDomain: env.SLACK_TEAM_DOMAIN,
//     token: env.SLACK_TOKEN
//   ])
// }

def deployToK8s(String vaultKubeconfigPath, String vaultKubeconfigField, String makeDeployTarget) {
  build job: "${DEPLOY_JOB}",
  parameters: [
    string(name: 'BRANCH_NAME_HYPHEN', value: "${BRANCH_NAME_HYPHEN}"),
    string(name: 'GIT_BRANCH', value: "${BRANCH_NAME}"),
    string(name: 'VAULT_APP_ADDR', value: "${VAULT_APP_ADDR}"),
    string(name: 'VAULT_APP_BASE_PATH', value: "${VAULT_APP_BASE_PATH}"),
    string(name: 'VAULT_APP_TOKEN_PATH', value: "${VAULT_APP_TOKEN_PATH}"),
    string(name: 'VAULT_KUBECONFIG_ADDR', value: "${VAULT_KUBECONFIG_ADDR}"),
    string(name: 'VAULT_KUBECONFIG_TOKEN_PATH', value: "${VAULT_KUBECONFIG_TOKEN_PATH}"),
    string(name: 'VAULT_KUBECONFIG_PATH', value: "${vaultKubeconfigPath}"),
    string(name: 'VAULT_KUBECONFIG_FIELD', value: "${vaultKubeconfigField}"),
    string(name: 'DOCKER_REG', value: "${DOCKER_REG}"),
    string(name: 'DOCKER_CREDS_ID', value: "${DOCKER_CREDS_ID}"),
    string(name: 'APP_TAG', value: "${APP_TAG}"),
    string(name: 'MIGRATE_TAG', value: "${MIGRATE_TAG}"),
    string(name: 'KUBE_YAML_PATH', value: "${KUBE_YAML_PATH}"),
    string(name: 'VAULT_KUBESECRETS_PATH', value: "${VAULT_KUBESECRETS_PATH}"),
    string(name: 'KUBE_NAMESPACE', value: "${KUBE_NAMESPACE}"),
    string(name: 'MAKE_DEPLOY_TARGET', value: "${makeDeployTarget}")
  ],
  propagate: true,
  wait: true
}
