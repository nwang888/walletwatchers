# Makefile

.PHONY: build run

build:
	docker build -t wallet-watchers .

run:
	docker volume create --name node_modules
	docker run --name wallet-container -dp 4000:3000 -v $(PWD):/usr/src/app -v node_modules:/usr/src/app/node_modules wallet-watchers

stop:
	docker stop wallet-container
	docker rm wallet-container