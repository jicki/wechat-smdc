# 设置变量
APP_NAME=wechat-smdc
VERSION=$(shell git describe --tags --always --dirty)
DOCKER_IMAGE=$(APP_NAME):$(VERSION)
ADMIN_IMAGE=$(APP_NAME)-admin:$(VERSION)

# 定义变量
REGISTRY ?= jicki
VERSION ?= latest
ADMIN_IMAGE = $(REGISTRY)/wechat-smdc-admin:$(VERSION)
APP_IMAGE = $(REGISTRY)/wechat-smdc-app:$(VERSION)

# 默认目标
.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo "可用的命令:"
	@echo "  all         - 构建管理后台和后端应用镜像"
	@echo "  build-admin - 构建管理后台镜像"
	@echo "  build-app   - 构建后端应用镜像"
	@echo "  push        - 推送镜像到仓库"
	@echo "  up          - 启动所有服务"
	@echo "  down        - 停止所有服务"
	@echo "  restart     - 重启所有服务"
	@echo "  logs        - 查看服务日志"
	@echo "  clean       - 清理构建产物和镜像"
	@echo ""
	@echo "环境变量:"
	@echo "  REGISTRY  - Docker 仓库地址 (默认: jicki)"
	@echo "  VERSION   - 镜像版本标签 (默认: latest)"

.PHONY: build-jar
build-jar:
	@echo "构建 JAR 包..."
	mvn clean package -DskipTests

.PHONY: build-admin
build-admin:
	@echo "Building admin image..."
	cd admin-web && docker build -t $(ADMIN_IMAGE) .
	docker tag $(ADMIN_IMAGE) $(REGISTRY)/wechat-smdc-admin:latest

# 构建后端应用镜像
.PHONY: build-app
build-app:
	@echo "构建 Docker 镜像..."
	docker build -t $(DOCKER_IMAGE) .
	docker tag $(DOCKER_IMAGE) $(REGISTRY)/wechat-smdc-app:latest

.PHONY: build-all
build-all: build-jar build-admin build-image

.PHONY: clean
clean:
	@echo "清理构建文件..."
	mvn clean
	rm -rf target/
	rm -rf admin-web/dist/
	rm -rf admin-web/node_modules/
	docker rmi $(ADMIN_IMAGE) $(APP_IMAGE) || true

.PHONY: up
up:
	@echo "启动所有服务..."
	docker-compose up -d

.PHONY: down
down:
	@echo "停止所有服务..."
	docker-compose down

.PHONY: logs
logs:
	@echo "查看服务日志..."
	docker-compose logs -f

.PHONY: restart
restart:
	@echo "重启所有服务..."
	docker-compose restart

.PHONY: all
all: build-admin build-app

# 推送镜像到仓库
.PHONY: push
push:
	docker push $(ADMIN_IMAGE)
	docker push $(APP_IMAGE) 