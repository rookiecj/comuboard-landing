.PHONY: build dev test docker-build fmt

build:
	npm run build

dev:
	npm run dev

test:
	npx tsc --noEmit

fmt:
	npx prettier --write src/

docker-build:
	docker build -t comuboard-landing .
