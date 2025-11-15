#!/bin/bash
# Docker Configuration Verification Script
# Tests all services and dependencies

set -e

echo "Raízes Digitais - Docker Verification"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
print_success() {
    echo "${GREEN}✓${NC} $1"
    TESTS_PASSED=$((TESTS_PASSED + 1))
}

print_error() {
    echo "${RED}✗${NC} $1"
    TESTS_FAILED=$((TESTS_FAILED + 1))
}

print_info() {
    echo "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo "${YELLOW}⚠${NC} $1"
}

# Test functions
test_container_running() {
    CONTAINER=$1
    if docker compose ps --format json | grep -q "\"Service\":\"$CONTAINER\""; then
        STATUS=$(docker compose ps $CONTAINER --format "{{.Status}}" | grep -i "up" || echo "")
        if [ -n "$STATUS" ]; then
            print_success "Container '$CONTAINER' is running"
            return 0
        else
            print_error "Container '$CONTAINER' is not running"
            return 1
        fi
    else
        print_error "Container '$CONTAINER' not found"
        return 1
    fi
}

test_command_in_container() {
    CONTAINER=$1
    COMMAND=$2
    EXPECTED=$3

    if OUTPUT=$(docker compose exec -T $CONTAINER $COMMAND 2>&1); then
        if echo "$OUTPUT" | grep -q "$EXPECTED"; then
            print_success "$COMMAND works in $CONTAINER (found: $EXPECTED)"
            return 0
        else
            print_error "$COMMAND in $CONTAINER - unexpected output: $OUTPUT"
            return 1
        fi
    else
        print_error "$COMMAND failed in $CONTAINER"
        return 1
    fi
}

test_port_accessible() {
    PORT=$1
    SERVICE=$2

    if nc -z localhost $PORT 2>/dev/null; then
        print_success "Port $PORT ($SERVICE) is accessible"
        return 0
    else
        print_warning "Port $PORT ($SERVICE) is not accessible (might be ok if service uses internal networking)"
        return 0
    fi
}

test_volume_exists() {
    VOLUME=$1

    if docker volume ls | grep -q "$VOLUME"; then
        print_success "Volume '$VOLUME' exists"
        return 0
    else
        print_error "Volume '$VOLUME' not found"
        return 1
    fi
}

# Start tests
echo "${BLUE}1. Container Status${NC}"
echo "-------------------"
test_container_running "app"
test_container_running "nginx"
test_container_running "postgres"
test_container_running "redis"
echo ""

echo "${BLUE}2. Node.js & NPM in App Container${NC}"
echo "----------------------------------"
test_command_in_container "app" "node --version" "v"
test_command_in_container "app" "npm --version" "11"
test_command_in_container "app" "turbo --version" "2"
echo ""

echo "${BLUE}3. PHP & Composer in App Container${NC}"
echo "-----------------------------------"
test_command_in_container "app" "php --version" "PHP 8.3"
test_command_in_container "app" "composer --version" "Composer version"
echo ""

echo "${BLUE}4. PHP Extensions${NC}"
echo "-----------------"
test_command_in_container "app" "php -m" "pdo_pgsql"
test_command_in_container "app" "php -m" "gd"
test_command_in_container "app" "php -m" "bcmath"
echo ""

echo "${BLUE}5. Port Accessibility${NC}"
echo "---------------------"
test_port_accessible "3000" "Next.js"
test_port_accessible "8000" "Laravel"
test_port_accessible "8080" "Nginx"
test_port_accessible "5433" "PostgreSQL"
test_port_accessible "6379" "Redis"
echo ""

echo "${BLUE}6. Named Volumes${NC}"
echo "----------------"
test_volume_exists "raizes-digitais_node_modules"
test_volume_exists "raizes-digitais_frontend_node_modules"
test_volume_exists "raizes-digitais_backend_node_modules"
test_volume_exists "raizes-digitais_backend_vendor"
test_volume_exists "raizes-digitais_pgdata"
echo ""

echo "${BLUE}7. Dependencies in Container${NC}"
echo "----------------------------"
if docker compose exec -T app sh -c "ls /var/www/node_modules/.bin/turbo" >/dev/null 2>&1; then
    print_success "Turbo is installed in node_modules"
else
    print_error "Turbo not found in node_modules"
fi

if docker compose exec -T app sh -c "ls /var/www/backend/vendor/autoload.php" >/dev/null 2>&1; then
    print_success "Composer dependencies installed"
else
    print_error "Composer dependencies not found"
fi
echo ""

echo "${BLUE}8. Database Connectivity${NC}"
echo "------------------------"
if docker compose exec -T postgres pg_isready -U raizes >/dev/null 2>&1; then
    print_success "PostgreSQL is ready"
else
    print_error "PostgreSQL is not ready"
fi

if docker compose exec -T redis redis-cli ping 2>&1 | grep -q "PONG"; then
    print_success "Redis is responding"
else
    print_error "Redis is not responding"
fi
echo ""

echo "${BLUE}9. Laravel Configuration${NC}"
echo "------------------------"
if docker compose exec -T app sh -c "test -f backend/.env" 2>/dev/null; then
    print_success "Laravel .env file exists"
else
    print_warning "Laravel .env file not found (will be created on first run)"
fi

if docker compose exec -T app sh -c "cd backend && php artisan --version" 2>&1 | grep -q "Laravel"; then
    print_success "Laravel artisan is working"
else
    print_error "Laravel artisan not working"
fi
echo ""

echo "${BLUE}10. File Permissions${NC}"
echo "--------------------"
if docker compose exec -T app sh -c "test -w backend/storage" 2>/dev/null; then
    print_success "backend/storage is writable"
else
    print_warning "backend/storage might need permissions fix (run: make permissions)"
fi
echo ""

# Summary
echo "=========================================="
echo "${BLUE}Verification Summary${NC}"
echo "=========================================="
TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
echo "Total tests: $TOTAL_TESTS"
echo "${GREEN}Passed: $TESTS_PASSED${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
    echo "${RED}Failed: $TESTS_FAILED${NC}"
else
    echo "${GREEN}Failed: $TESTS_FAILED${NC}"
fi
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo "${GREEN}🎉 All tests passed! Docker is configured correctly.${NC}"
    echo ""
    echo "Next steps:"
    echo "  • Run: ${BLUE}make dev${NC} to start development servers"
    echo "  • Run: ${BLUE}make migrate${NC} to set up the database"
    echo "  • Access frontend at: ${BLUE}http://localhost:3000${NC}"
    echo "  • Access backend at: ${BLUE}http://localhost:8000${NC}"
    exit 0
else
    echo "${RED}⚠️  Some tests failed. Please review the errors above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "  • Run: ${BLUE}make clean && make build-no-cache && make up${NC}"
    echo "  • Run: ${BLUE}make permissions${NC} to fix file permissions"
    echo "  • Check logs: ${BLUE}make logs${NC}"
    exit 1
fi
