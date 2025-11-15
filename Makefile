# Makefile for Raízes Digitais
# Simplifies common Docker and development commands

.PHONY: help build up down restart logs shell clean install migrate seed fresh test lint format

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

##@ General

help: ## Show this help message
	@echo "$(BLUE)Raízes Digitais - Available Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make $(GREEN)<target>$(NC)\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Docker

build: ## Build Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	docker compose build app

build-no-cache: ## Build Docker images without cache
	@echo "$(BLUE)Building Docker images (no cache)...$(NC)"
	docker compose build --no-cache app

up: ## Start all containers
	@echo "$(GREEN)Starting containers...$(NC)"
	docker compose up -d

down: ## Stop all containers
	@echo "$(RED)Stopping containers...$(NC)"
	docker compose down

restart: down up ## Restart all containers

logs: ## Show container logs (tail -f)
	docker compose logs -f app

logs-all: ## Show all container logs
	docker compose logs -f

ps: ## Show running containers
	docker compose ps

##@ Application

shell: ## Open shell in app container
	docker compose exec app sh

shell-root: ## Open shell as root in app container
	docker compose exec -u root app sh

install: ## Install dependencies (npm + composer)
	@echo "$(BLUE)Installing dependencies...$(NC)"
	docker compose exec app npm install
	docker compose exec app sh -c "cd backend && composer install"

dev: ## Start development servers (Laravel + Next.js)
	@echo "$(GREEN)Starting development servers...$(NC)"
	docker compose exec app sh -c "php artisan serve --host=0.0.0.0 --port=8000 & cd frontend && npm run dev"

dev-frontend: ## Start only Next.js development server
	docker compose exec app sh -c "cd frontend && npm run dev"

dev-backend: ## Start only Laravel development server
	docker compose exec app php artisan serve --host=0.0.0.0 --port=8000

build-frontend: ## Build Next.js for production
	docker compose exec app sh -c "cd frontend && npm run build"

##@ Database

migrate: ## Run database migrations
	@echo "$(BLUE)Running migrations...$(NC)"
	docker compose exec app php artisan migrate

migrate-fresh: ## Fresh migration (drops all tables)
	@echo "$(RED)Running fresh migrations...$(NC)"
	docker compose exec app php artisan migrate:fresh

seed: ## Seed the database
	@echo "$(BLUE)Seeding database...$(NC)"
	docker compose exec app php artisan db:seed

fresh: ## Fresh migration with seeding
	@echo "$(YELLOW)Running fresh migrations with seeding...$(NC)"
	docker compose exec app php artisan migrate:fresh --seed

db-shell: ## Open PostgreSQL shell
	docker compose exec postgres psql -U raizes -d raizes

db-reset: down ## Reset database (remove volume and restart)
	docker volume rm raizes-digitais_pgdata || true
	docker compose up -d

##@ Testing & Quality

test: ## Run all tests
	@echo "$(BLUE)Running tests...$(NC)"
	docker compose exec app turbo run test

test-backend: ## Run Laravel tests
	docker compose exec app sh -c "cd backend && php artisan test"

test-frontend: ## Run Next.js tests
	docker compose exec app sh -c "cd frontend && npm test"

lint: ## Run linters
	@echo "$(BLUE)Running linters...$(NC)"
	docker compose exec app turbo run lint

format: ## Format code with Prettier
	@echo "$(BLUE)Formatting code...$(NC)"
	docker compose exec app npm run format

##@ Cleanup

clean: down ## Stop containers and remove volumes
	@echo "$(RED)Cleaning up...$(NC)"
	docker compose down -v

clean-all: ## Remove everything (containers, volumes, images)
	@echo "$(RED)Removing all Docker resources...$(NC)"
	docker compose down -v --rmi local
	docker volume rm raizes-digitais_pgdata || true
	docker volume rm raizes-digitais_node_modules || true
	docker volume rm raizes-digitais_frontend_node_modules || true
	docker volume rm raizes-digitais_backend_node_modules || true
	docker volume rm raizes-digitais_backend_vendor || true

clean-node-modules: ## Remove node_modules volumes
	@echo "$(YELLOW)Removing node_modules volumes...$(NC)"
	docker volume rm raizes-digitais_node_modules || true
	docker volume rm raizes-digitais_frontend_node_modules || true
	docker volume rm raizes-digitais_backend_node_modules || true

clean-vendor: ## Remove vendor volume
	@echo "$(YELLOW)Removing vendor volume...$(NC)"
	docker volume rm raizes-digitais_backend_vendor || true

##@ Utilities

artisan: ## Run artisan command (usage: make artisan CMD="migrate")
	docker compose exec app php artisan $(CMD)

composer: ## Run composer command (usage: make composer CMD="require package")
	docker compose exec app sh -c "cd backend && composer $(CMD)"

npm: ## Run npm command in root (usage: make npm CMD="install")
	docker compose exec app npm $(CMD)

npm-frontend: ## Run npm in frontend (usage: make npm-frontend CMD="install")
	docker compose exec app sh -c "cd frontend && npm $(CMD)"

npm-backend: ## Run npm in backend (usage: make npm-backend CMD="install")
	docker compose exec app sh -c "cd backend && npm $(CMD)"

cache-clear: ## Clear Laravel caches
	@echo "$(BLUE)Clearing caches...$(NC)"
	docker compose exec app php artisan cache:clear
	docker compose exec app php artisan config:clear
	docker compose exec app php artisan route:clear
	docker compose exec app php artisan view:clear

optimize: ## Optimize Laravel for production
	@echo "$(GREEN)Optimizing Laravel...$(NC)"
	docker compose exec app php artisan config:cache
	docker compose exec app php artisan route:cache
	docker compose exec app php artisan view:cache

permissions: ## Fix storage permissions
	@echo "$(BLUE)Fixing permissions...$(NC)"
	docker compose exec -u root app chown -R www-data:www-data backend/storage backend/bootstrap/cache
	docker compose exec -u root app chmod -R 775 backend/storage backend/bootstrap/cache

##@ Quick Start

init: build up install migrate seed ## Initialize project (first time setup)
	@echo "$(GREEN)Project initialized successfully!$(NC)"
	@echo "$(YELLOW)Frontend:$(NC) http://localhost:3000"
	@echo "$(YELLOW)Backend:$(NC)  http://localhost:8000"
	@echo "$(YELLOW)Nginx:$(NC)    http://localhost:8080"
	@echo ""
	@echo "Run '$(GREEN)make dev$(NC)' to start development servers"

rebuild: clean-all build up install migrate seed ## Complete rebuild
	@echo "$(GREEN)Project rebuilt successfully!$(NC)"
