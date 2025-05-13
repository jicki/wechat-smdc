# 设置变量
APP_NAME=wechat-smdc
VERSION=$(shell git describe --tags --always --dirty)
DOCKER_IMAGE=$(APP_NAME):$(VERSION)

# 默认目标
.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo "可用的 make 命令："
	@echo "  build-jar   - 使用 Maven 构建 JAR 包"
	@echo "  build-image - 构建 Docker 镜像"
	@echo "  all         - 构建 JAR 包和 Docker 镜像"
	@echo "  clean       - 清理构建文件"
	@echo "  up          - 启动所有服务"
	@echo "  down        - 停止所有服务"
	@echo "  logs        - 查看服务日志"
	@echo "  restart     - 重启所有服务"

.PHONY: build-jar
build-jar:
	@echo "构建 JAR 包..."
	mvn clean package -DskipTests

.PHONY: build-image
build-image:
	@echo "构建 Docker 镜像..."
	docker build -t $(DOCKER_IMAGE) .
	docker tag $(DOCKER_IMAGE) $(APP_NAME):latest

.PHONY: all
all: build-jar build-image

.PHONY: clean
clean:
	@echo "清理构建文件..."
	mvn clean
	rm -rf target/

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