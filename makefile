# Makefile

.PHONY: build run

build:
	docker build -t wallet-watchers .

run:
	docker run --name wallet-container -dp 3000:3000 wallet-watchers

stop:
	docker stop wallet-container
	docker rm wallet-container