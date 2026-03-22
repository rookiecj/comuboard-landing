.PHONY: build run dev test test-quiet docker-build fmt install-deps clean

VERSION    := $(shell cat VERSION 2>/dev/null)
GIT_COMMIT := $(shell git rev-parse --short HEAD 2>/dev/null || echo unknown)
BUILD_TIME := $(shell date -u '+%Y-%m-%dT%H:%M:%SZ')

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

# ─── Publish (CI — tag + push → GitHub Actions) ─────────────────

.PHONY: publish
publish:	## Publish via CI (tag + push → GitHub Actions builds)
	@if [ -z "$(VERSION)" ]; then echo "ERROR: VERSION file is empty or missing"; exit 1; fi
	@git fetch origin --tags
	@if git rev-parse "v$(VERSION)" >/dev/null 2>&1; then echo "ERROR: tag v$(VERSION) already exists"; exit 1; fi
	@echo "=== Landing: Publishing v$(VERSION) ==="
	@echo "--- build ---"
	$(MAKE) build
	@echo "--- test(quiet) ---"
	$(MAKE) test-quiet
	@echo "--- Tagging v$(VERSION) ---"
	git tag -a "v$(VERSION)" -m "Release v$(VERSION)"
	git push origin "v$(VERSION)"
	git push origin main
	@echo "=== Landing: Published v$(VERSION) ==="

# ─── 환경별 로컬 빌드 & Push ─────────────────────────────────────

.PHONY: _publish-images
_publish-images:
	@if [ -z "$(VERSION)" ]; then echo "ERROR: VERSION file is empty or missing"; exit 1; fi
	@if [ ! -f .env.$(ENV) ]; then echo "ERROR: .env.$(ENV) not found"; exit 1; fi
	$(eval include .env.$(ENV))
	$(eval IMAGE_TAG := $(if $(filter dev,$(ENV)),dev-$(VERSION),$(VERSION)))
	$(eval LATEST_TAG := $(if $(filter dev,$(ENV)),dev-latest,latest))
	@echo "=== Landing publish-$(ENV) v$(IMAGE_TAG) ($(GIT_COMMIT)) ==="
	@echo "--- Registry login ---"
	@if [ -n "$(REGISTRY_USERNAME)" ] && [ -n "$(REGISTRY_PASSWORD)" ]; then \
		echo "$(REGISTRY_PASSWORD)" | docker login $(REGISTRY) -u "$(REGISTRY_USERNAME)" --password-stdin; \
	else \
		docker login $(REGISTRY) 2>/dev/null || { echo "ERROR: registry login failed. Set REGISTRY_USERNAME/REGISTRY_PASSWORD in .env.$(ENV) or run 'docker login $(REGISTRY)' manually."; exit 1; }; \
	fi
	@echo "▶ Building $(REGISTRY)/landing:$(IMAGE_TAG)"
	@docker buildx build \
		--builder $(BUILDER) \
		--platform $(PLATFORM) \
		-t $(REGISTRY)/landing:$(IMAGE_TAG) \
		-t $(REGISTRY)/landing:$(LATEST_TAG) \
		--push \
		.
	@echo "✓ landing:$(IMAGE_TAG) pushed"
	@echo "=== Landing publish-$(ENV) complete ==="

.PHONY: publish-dev
publish-dev:	## Validate, tag, build ARM64 image for dev (dev-v{VERSION})
	@if [ -z "$(VERSION)" ]; then echo "ERROR: VERSION file is empty or missing"; exit 1; fi
	@echo "=== Landing: publish-dev v$(VERSION) ==="
	@echo "--- build ---"
	$(MAKE) build
	@echo "--- test(quiet) ---"
	$(MAKE) test-quiet
	@echo "--- Tagging dev-v$(VERSION) ---"
	@git fetch origin --tags
	@if git rev-parse "dev-v$(VERSION)" >/dev/null 2>&1; then \
		echo "⚠️  Tag dev-v$(VERSION) already exists, skipping tag creation"; \
	else \
		git tag -a "dev-v$(VERSION)" -m "Dev release dev-v$(VERSION)"; \
	fi
	$(MAKE) _publish-images ENV=dev
	@echo "=== Landing: publish-dev complete ==="

.PHONY: publish-prod
publish-prod:	## Validate, tag, build ARM64 image for prod (v{VERSION})
	@if [ -z "$(VERSION)" ]; then echo "ERROR: VERSION file is empty or missing"; exit 1; fi
	@echo "=== Landing: publish-prod v$(VERSION) ==="
	@echo "--- build ---"
	$(MAKE) build
	@echo "--- test(quiet) ---"
	$(MAKE) test-quiet
	@echo "--- Tagging v$(VERSION) ---"
	@git fetch origin --tags
	@if git rev-parse "v$(VERSION)" >/dev/null 2>&1; then \
		echo "⚠️  Tag v$(VERSION) already exists, skipping tag creation"; \
	else \
		git tag -a "v$(VERSION)" -m "Release v$(VERSION)"; \
	fi
	$(MAKE) _publish-images ENV=prod
	@echo "=== Landing: publish-prod complete ==="
