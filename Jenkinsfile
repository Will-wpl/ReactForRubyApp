
pipeline {
    agent {
        node {
            label 'rails_base'
        }
    }

    environment {
        http_proxy          = "http://proxy.singaporepower.com.sg:8080"
        https_proxy         = "http://proxy.singaporepower.com.sg:8080"
        no_proxy            = "localhost,127.0.0.1,in.spdigital.io"
        PATH                = "${env.HOME}/.rbenv/bin:${env.HOME}/.rbenv/shims:$PATH"
        TESTDBNAME          = "railsbase_test_${env.BUILD_ID}"
        DATABASE_URL        = "postgres:///${TESTDBNAME}?host=/run/postgresql&sslmode=disable"
        SLACK_CHANNEL       = "#sp-digital-bots"
        SLACK_TEAM_DOMAIN   = "sp-digital"
        SLACK_TOKEN         = credentials("spdigital-slack-token")
    }

    stages {
        stage('Start') {
            steps {
                notifySlack('CI/CD', 'STARTED')
            }
        }

        stage("Prepare Ruby ENV") {
            steps {
                sh 'RAILS_ENV=test bundle install'
                sh 'RAILS_ENV=test bundle exec rake db:create'
                sh 'RAILS_ENV=test bundle exec rake db:migrate'
            }
            post {
                failure {
                    notifySlack('Prepare Ruby ENV', 'FAILURE')
                }
            }
        }

        stage("Prepare Node ENV") {
            steps {
                sh 'npm config set registry http://nexus.in.spdigital.io/repository/npmjs-all/'
                sh 'yarn install'
            }
            post {
                failure {
                    notifySlack('Prepare Node ENV', 'FAILURE')
                }
            }
        }

        stage("Tests") {
            steps {
                sh "bundle exec rspec"
            }
            post {
                success {
                    notifySlack('Tests', 'SUCCESS')
                }
                failure {
                    notifySlack('Tests', 'FAILURE')
                }
            }
        }
    }
}
