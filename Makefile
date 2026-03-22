.PHONY: build run dev test test-quiet docker-build fmt install-deps clean

build:	## Build for production
	npm run build

run:	## Run dev server
	npm run dev

dev: run	## Alias for run

test:	## Type check
	npx tsc --noEmit

test-quiet: test	## Alias for test

fmt:	## Format source
	npx prettier --write src/

docker-build:	## Build Docker image
	docker build -t comuboard-landing .

install-deps:	## Install dependencies
	npm ci

clean:	## Clean build output
	rm -rf dist node_modules
