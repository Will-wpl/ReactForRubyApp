APP_NAME := reverse-auction
APP_HOST_NAME := revv
DEV_DOMAIN := dev.energy.spdigital.sg

DOCKER_DEV_REG := reverse-auction.azurecr.io
DOCKER_TAG_BASE := $(DOCKER_DEV_REG)/$(APP_NAME)

# Set Docker release and migrate tag
ifndef APP_TAG
APP_TAG := $(DOCKER_TAG_BASE):local
endif

ifndef MIGRATE_TAG
MIGRATE_TAG := $(DOCKER_TAG_BASE)-migrate:local
endif

# Vault
ifndef VAULT_APP_BASE_PATH
VAULT_APP_BASE_PATH := secret/reverse-auction/$(APP_NAME)
endif

# k8s portion
ifndef VAULT_KUBECONFIG_PATH
VAULT_KUBECONFIG_PATH := secret/${APP_NAME}/kubeconfig
endif

ifndef VAULT_KUBECONFIG_FIELD
VAULT_KUBECONFIG_FIELD := dev
endif

ifndef KUBE_YAML_PATH
KUBE_YAML_PATH := dev
endif

ifndef VAULT_KUBESECRETS_PATH
VAULT_KUBESECRETS_PATH := $(VAULT_APP_BASE_PATH)/kubesecrets/dev/
endif

ifndef BRANCH_NAME_HYPHEN
BRANCH_NAME_HYPHEN := local
endif

DEV_URL := $(APP_HOST_NAME)-$(BRANCH_NAME_HYPHEN).$(DEV_DOMAIN)

kubectl_cmd = $(kubectl_bin) --namespace=$(KUBE_NAMESPACE) --request-timeout='3m'

k8s_path := ./k8s
kubectl_bin = kubectl
kubectl_jenkins_bin = kubectl-1.11.2

k8s-kubeconfig:
	mkdir -p ${HOME}/.kube
	vault kv get -field '$(VAULT_KUBECONFIG_FIELD)' $(VAULT_KUBECONFIG_PATH) > $(HOME)/.kube/config

# Use only when runing locally
k8s-deploy-local: KUBE_NAMESPACE=test
k8s-deploy-local: k8s-dev-namespace k8s-secrets k8s-configmap k8s-postgres k8s-migrate k8s-ingress k8s-app

# running in jenkins only
k8s-deploy-feature: kubectl_bin=$(kubectl_jenkins_bin)
k8s-deploy-feature: k8s-update-yaml k8s-dev-update-ingress-host k8s-dev-namespace k8s-dev-docker-reg-secret k8s-secrets k8s-configmap k8s-postgres k8s-migrate k8s-ingress k8s-app

k8s-deploy-qa-or-prod-cluster1: kubectl_bin=$(kubectl_jenkins_bin)
k8s-deploy-qa-or-prod-cluster1: k8s-update-yaml k8s-secrets k8s-configmap k8s-migrate k8s-publisher k8s-migrate k8s-ingress k8s-app

# should not deploy migration anymore
k8s-deploy-qa-or-prod-cluster2: kubectl_bin=$(kubectl_jenkins_bin)
k8s-deploy-qa-or-prod-cluster2: k8s-update-yaml k8s-secrets k8s-configmap k8s-ingress k8s-app

k8s-copy-yaml:
	cp $(k8s_path)/$(KUBE_YAML_PATH)/* $(k8s_path)/

k8s-update-yaml: k8s-copy-yaml
	sed -i.org "/image:/s|$(DOCKER_TAG_BASE)|$(APP_TAG)|" k8s/app.yaml
	sed -i.org "/value:/s|{jenkins-build}|$(KUBE_NAMESPACE)-$(BUILD_ID)|" k8s/app.yaml
	sed -i.org "/value:/s|{git-commit}|$(GIT_COMMIT)|" k8s/app.yaml
	sed -i.org "/image:/s|$(DOCKER_TAG_BASE)|$(APP_TAG)|" k8s/migrate.yaml

k8s-dev-update-ingress-host:
	sed -i.org "s|REPLACE_WITH_DEV_HOST|$(DEV_URL)|g" k8s/ingress.yaml

k8s-dev-namespace:
	-$(kubectl_bin) create namespace $(KUBE_NAMESPACE)

k8s-dev-docker-reg-secret:
	-$(kubectl_cmd) create secret docker-registry docker-registry-key \
	--docker-server=$(DOCKER_REG) \
	--docker-username=$(DOCKER_USER) \
	--docker-password=$(DOCKER_PASS) \
	--docker-email=$(GIT_COMMITTER_EMAIL)
	-$(kubectl_cmd) patch serviceaccount default -p '{"imagePullSecrets": [{"name": "docker-registry-key"}]}'

k8s-configmap:
	$(kubectl_cmd) apply -f $(k8s_path)/configmap.yaml

k8s-secrets:
	APP_NAME=$(APP_NAME) VAULT_KUBESECRETS_PATH=$(VAULT_KUBESECRETS_PATH) ./generate_k8s_secrets.sh > $(k8s_path)/secrets.yaml
	if [ $$? -eq 0 ]; \
	then echo "secret from vault success"; \
	else exit 1; fi
	$(kubectl_cmd) apply -f $(k8s_path)/secrets.yaml

k8s-postgres:
	$(kubectl_cmd) apply -f $(k8s_path)/postgres.yaml
	$(kubectl_cmd) rollout status deploy $(APP_NAME)-postgres

k8s-migrate:
	-$(kubectl_cmd) delete -f $(k8s_path)/migrate.yaml
	$(kubectl_cmd) create -f $(k8s_path)/migrate.yaml
	$(kubectl_cmd) wait --timeout=60s -f $(k8s_path)/migrate.yaml --for condition=complete

k8s-ingress:
	# Edit $(k8s_path)/ingress.yaml before uncommenting this
	# Make sure the ingress is resolvable by DNS first
	$(kubectl_cmd) apply -f $(k8s_path)/ingress.yaml

k8s-app:
	$(kubectl_cmd) apply -f $(k8s_path)/app.yaml
	$(kubectl_cmd) rollout status deploy $(APP_NAME)

k8s-fail-logs:
	# get status of the pods
	$(kubectl_cmd) -l app=$(APP_NAME) get pods || true
	# get details for each pods
	$(kubectl_cmd) -l app=$(APP_NAME) describe pods || true

	# Printing out each pods logs
	for pod in $$($(kubectl_cmd) -l app=$(APP_NAME) get pods | cut -f 1 -d ' ' | tail -n +2); do \
		echo --------------------------- \
		echo $$pod \
		echo --------------------------- \
		$(kubectl_cmd) logs $$pod --since $${TIMEOUT:-100}s || true; \
		done

	# get status of the pods
	#$(kubectl_cmd) -l app=$(APP_NAME)-migrate get pods || true
	# get details for each pods
	#$(kubectl_cmd) -l app=$(APP_NAME)-migrate describe pods || true

	# Printing out each pods logs
	for pod in $$($(kubectl_cmd) -l app=$(APP_NAME)-migrate get pods | cut -f 1 -d ' ' | tail -n +2); do \
		echo --------------------------- \
		echo $$pod \
		echo --------------------------- \
		$(kubectl_cmd) logs $$pod --since $${TIMEOUT:-100}s || true; \
		done
