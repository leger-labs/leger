# Leger Project Makefile

# Project configuration
PROJECT := leger
MODULE := github.com/leger-labs/leger

# Version info
VERSION := $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
VERSION_SHORT := $(shell echo $(VERSION) | sed 's/^v//')
COMMIT := $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BUILD_DATE := $(shell date -u +'%Y-%m-%dT%H:%M:%SZ')

# Build settings
GOOS ?= linux
GOARCH ?= amd64
CGO_ENABLED ?= 0

# ldflags for version embedding
LDFLAGS := -ldflags "\
	-X $(MODULE)/internal/version.Version=$(VERSION) \
	-X $(MODULE)/internal/version.Commit=$(COMMIT) \
	-X $(MODULE)/internal/version.BuildDate=$(BUILD_DATE) \
	-w -s"

# Build flags
BUILD_FLAGS := -trimpath $(LDFLAGS)

# Package settings
RPM_ARCH := $(GOARCH)
ifeq ($(GOARCH),amd64)
	RPM_ARCH := x86_64
endif
ifeq ($(GOARCH),arm64)
	RPM_ARCH := aarch64
endif
RPM_FILE := $(PROJECT)-$(VERSION_SHORT)-1.$(RPM_ARCH).rpm

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: build
build: build-leger build-legerd ## Build both binaries

.PHONY: build-leger
build-leger: ## Build leger CLI
	GOOS=$(GOOS) GOARCH=$(GOARCH) CGO_ENABLED=$(CGO_ENABLED) \
		go build $(BUILD_FLAGS) -o leger ./cmd/leger

.PHONY: build-legerd
build-legerd: ## Build legerd daemon
	GOOS=$(GOOS) GOARCH=$(GOARCH) CGO_ENABLED=$(CGO_ENABLED) \
		go build $(BUILD_FLAGS) -o legerd ./cmd/legerd

.PHONY: test
test: ## Run tests
	go test -v -race ./...

.PHONY: lint
lint: ## Run linters
	golangci-lint run

.PHONY: clean
clean: ## Clean build artifacts
	rm -f leger legerd leger-* legerd-*
	rm -f *.rpm *.deb
	rm -rf dist/
	rm -f nfpm-build.yaml

.PHONY: rpm
rpm: build-leger build-legerd ## Build RPM package for current GOARCH
	@echo "Building RPM for $(GOARCH) ($(RPM_ARCH))..."
	@command -v nfpm >/dev/null 2>&1 || { \
		echo "ERROR: nfpm not found. Install it:"; \
		echo "  go install github.com/goreleaser/nfpm/v2/cmd/nfpm@latest"; \
		exit 1; \
	}
	@# Set environment variables and build
	VERSION=$(VERSION_SHORT) \
	RPM_ARCH=$(RPM_ARCH) \
	CLI_BINARY=leger \
	DAEMON_BINARY=legerd \
	nfpm pkg --packager rpm -f nfpm.yaml
	@echo "Created: $(RPM_FILE)"

.PHONY: rpm-all
rpm-all: ## Build RPMs for all architectures
	@$(MAKE) rpm GOARCH=amd64
	@$(MAKE) rpm GOARCH=arm64
	@echo "Created RPMs for amd64 and arm64"

.PHONY: install-rpm
install-rpm: rpm ## Build and install RPM locally
	@echo "Installing RPM..."
	sudo dnf install -y ./$(RPM_FILE)
	@echo "Installed. Configure and start:"
	@echo "  systemctl enable --now legerd.service          # System-wide"
	@echo "  systemctl --user enable --now legerd.service   # Per-user"

.PHONY: uninstall-rpm
uninstall-rpm: ## Uninstall RPM package
	sudo dnf remove -y $(PROJECT)

.PHONY: sign
sign: ## Sign RPM packages with GPG (Usage: make sign GPG_KEY=your@email.com)
	@command -v rpmsign >/dev/null 2>&1 || { \
		echo "ERROR: rpmsign not found. Install: sudo dnf install rpm-sign"; \
		exit 1; \
	}
	@if [ -z "$(GPG_KEY)" ]; then \
		echo "ERROR: GPG_KEY not set. Usage: make sign GPG_KEY=your@email.com"; \
		exit 1; \
	fi
	@for rpm in $(PROJECT)-*.rpm; do \
		if [ -f "$$rpm" ]; then \
			echo "Signing $$rpm..."; \
			rpmsign --addsign --key-id=$(GPG_KEY) $$rpm; \
		fi; \
	done

.PHONY: verify
verify: ## Verify RPM signatures
	@for rpm in $(PROJECT)-*.rpm; do \
		if [ -f "$$rpm" ]; then \
			echo "Verifying $$rpm..."; \
			rpm --checksig $$rpm; \
		fi; \
	done

.PHONY: version
version: ## Show version information
	@echo "Version:    $(VERSION)"
	@echo "Short:      $(VERSION_SHORT)"
	@echo "Commit:     $(COMMIT)"
	@echo "Build Date: $(BUILD_DATE)"
	@echo "GOOS:       $(GOOS)"
	@echo "GOARCH:     $(GOARCH)"
	@echo "RPM Arch:   $(RPM_ARCH)"

.PHONY: dev
dev: build ## Quick build and test
	./leger --version || echo "leger CLI placeholder"
	./legerd --version

.PHONY: setup-dev
setup-dev: ## Install development dependencies
	@echo "Installing development tools..."
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	go install github.com/goreleaser/nfpm/v2/cmd/nfpm@latest
	@echo "Development tools installed."

.DEFAULT_GOAL := help
