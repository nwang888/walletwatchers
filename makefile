# Makefile

.PHONY: build run

build:
	docker build -t wallet-watchers .

run:
	docker volume create --name node_modules
	docker run --name wallet-container -dp 4000:4000 -v $(PWD):/usr/src/app wallet-watchers

stop:
	docker stop wallet-container
	docker rm wallet-container