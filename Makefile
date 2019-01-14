# **************************************** docker *********************************
APP_NAME := reverse-auction
DOCKER_DEV_REG := reverse-auction.azurecr.io
DOCKER_TAG_BASE := $(DOCKER_DEV_REG)/$(APP_NAME)

# Set Docker release and migrate tag
ifndef APP_TAG
APP_TAG := $(DOCKER_TAG_BASE):local
endif

docker.build.all: docker.build.reverse-auction
.PHONY: docker.build.all

docker.push.all:
	docker push $(APP_TAG)
.PHONY: docker.push.all

docker.build.reverse-auction:
	docker build \
		--file Dockerfile.release \
		--tag $(APP_TAG) \
		.
.PHONY: docker.build.reverse-auction
