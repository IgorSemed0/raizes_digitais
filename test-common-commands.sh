#!/bin/bash
# Test Common Commands - Raízes Digitais
# Validates that all common make and docker compose commands work properly

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

TESTS_PASSED=0
TESTS_FAILED=0

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_test() {
    echo -e "${YELLOW}Testing:${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓ PASS${NC} $1"
    TESTS_PASSED=$((TESTS_PASSED + 1))
}

print_error() {
    echo -e "${RED}✗ FAIL${NC} $1"
    TESTS_FAILED=$((TESTS_FAILED + 1))
}

print_header "Common Commands Test Suite"

# Check if containers are running
if ! docker compose ps | grep -q "Up"; then
    echo -e "${RED}Error: Containers are not running!${NC}"
    echo "Please run: docker compose up -d"
    exit 1
fi

print_header "1. Testing Make Commands"

# Test make ps
print_test "make ps"
if make ps > /dev/null 2>&1; then
    print_success "make ps works"
else
    print_error "make ps failed"
fi

# Test make artisan
print_test "make artisan CMD=\"--version\""
if OUTPUT=$(make artisan CMD="--version" 2>&1) && echo "$OUTPUT" | grep -q "Laravel"; then
    print_success "make artisan works ($(echo "$OUTPUT" | grep Laravel))"
else
    print_error "make artisan failed"
fi

# Test make composer
print_test "make composer CMD=\"--version\""
if OUTPUT=$(make composer CMD="--version" 2>&1) && echo "$OUTPUT" | grep -q "Composer"; then
    print_success "make composer works"
else
    print_error "make composer failed"
fi

# Test make npm
print_test "make npm CMD=\"--version\""
if OUTPUT=$(make npm CMD="--version" 2>&1) && echo "$OUTPUT" | grep -q "[0-9]"; then
    print_success "make npm works (npm $(echo "$OUTPUT" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1))"
else
    print_error "make npm failed"
fi

# Test make cache-clear
print_test "make cache-clear"
if make cache-clear > /dev/null 2>&1; then
    print_success "make cache-clear works"
else
    print_error "make cache-clear failed"
fi

# Test make migrate
print_test "make migrate"
if OUTPUT=$(make migrate 2>&1) && (echo "$OUTPUT" | grep -q "Nothing to migrate" || echo "$OUTPUT" | grep -q "DONE"); then
    print_success "make migrate works"
else
    print_error "make migrate failed"
fi

print_header "2. Testing Direct Docker Compose Commands"

# Test docker compose exec with artisan
print_test "docker compose exec -T app sh -c \"cd backend && php artisan --version\""
if OUTPUT=$(docker compose exec -T app sh -c "cd backend && php artisan --version" 2>&1) && echo "$OUTPUT" | grep -q "Laravel"; then
    print_success "Direct artisan command works"
else
    print_error "Direct artisan command failed"
fi

# Test docker compose exec with composer
print_test "docker compose exec -T app sh -c \"cd backend && composer --version\""
if OUTPUT=$(docker compose exec -T app sh -c "cd backend && composer --version" 2>&1) && echo "$OUTPUT" | grep -q "Composer"; then
    print_success "Direct composer command works"
else
    print_error "Direct composer command failed"
fi

# Test docker compose exec with npm (root)
print_test "docker compose exec -T app npm --version"
if OUTPUT=$(docker compose exec -T app npm --version 2>&1) && echo "$OUTPUT" | grep -qE "[0-9]+\.[0-9]+\.[0-9]+"; then
    print_success "Direct npm command works (root)"
else
    print_error "Direct npm command failed (root)"
fi

# Test docker compose exec with npm (frontend)
print_test "docker compose exec -T app sh -c \"cd frontend && npm --version\""
if OUTPUT=$(docker compose exec -T app sh -c "cd frontend && npm --version" 2>&1) && echo "$OUTPUT" | grep -qE "[0-9]+\.[0-9]+\.[0-9]+"; then
    print_success "Direct npm command works (frontend)"
else
    print_error "Direct npm command failed (frontend)"
fi

# Test docker compose exec with turbo
print_test "docker compose exec -T app turbo --version"
if OUTPUT=$(docker compose exec -T app turbo --version 2>&1) && echo "$OUTPUT" | grep -qE "[0-9]+\.[0-9]+\.[0-9]+"; then
    print_success "Turbo available"
else
    print_error "Turbo not available"
fi

print_header "3. Testing Database Connectivity"

# Test PostgreSQL connection
print_test "PostgreSQL connection"
if docker compose exec -T postgres pg_isready -U raizes > /dev/null 2>&1; then
    print_success "PostgreSQL connection works"
else
    print_error "PostgreSQL connection failed"
fi

# Test Redis connection
print_test "Redis connection"
if docker compose exec -T redis redis-cli ping 2>&1 | grep -q "PONG"; then
    print_success "Redis connection works"
else
    print_error "Redis connection failed"
fi

# Test Laravel database connection
print_test "Laravel database connection"
if docker compose exec -T app sh -c "cd backend && php artisan migrate:status" > /dev/null 2>&1; then
    print_success "Laravel can connect to database"
else
    print_error "Laravel database connection failed"
fi

print_header "4. Testing File Structure"

# Test backend .env exists
print_test "backend/.env exists"
if docker compose exec -T app sh -c "test -f backend/.env"; then
    print_success "backend/.env exists"
else
    print_error "backend/.env missing"
fi

# Test backend vendor exists
print_test "backend/vendor exists"
if docker compose exec -T app sh -c "test -d backend/vendor"; then
    print_success "backend/vendor directory exists"
else
    print_error "backend/vendor directory missing"
fi

# Test frontend node_modules exists
print_test "frontend/node_modules exists"
if docker compose exec -T app sh -c "test -d frontend/node_modules"; then
    print_success "frontend/node_modules directory exists"
else
    print_error "frontend/node_modules directory missing"
fi

# Test root node_modules exists
print_test "root node_modules exists"
if docker compose exec -T app sh -c "test -d node_modules"; then
    print_success "root node_modules directory exists"
else
    print_error "root node_modules directory missing"
fi

print_header "5. Testing Permissions"

# Test storage permissions
print_test "backend/storage is writable"
if docker compose exec -T app sh -c "test -w backend/storage"; then
    print_success "backend/storage is writable"
else
    print_error "backend/storage is not writable (run: make permissions)"
fi

print_header "6. Testing HTTP Endpoints"

# Test Laravel endpoint
print_test "Laravel HTTP endpoint (localhost:8000)"
if curl -s -f http://localhost:8000 > /dev/null 2>&1; then
    print_success "Laravel responds on port 8000"
else
    print_error "Laravel not responding on port 8000 (start with: make dev-backend)"
fi

# Test Nginx endpoint
print_test "Nginx HTTP endpoint (localhost:8080)"
if curl -s -f http://localhost:8080 > /dev/null 2>&1; then
    print_success "Nginx responds on port 8080"
else
    print_error "Nginx not responding on port 8080"
fi

print_header "Test Results Summary"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"

if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "${RED}Failed: $TESTS_FAILED${NC}"
    echo ""
    echo -e "${YELLOW}Some tests failed. Common fixes:${NC}"
    echo "  • Run: make permissions"
    echo "  • Run: make install"
    echo "  • Run: make migrate"
    echo "  • Start dev servers: make dev"
    exit 1
else
    echo -e "${GREEN}Failed: 0${NC}"
    echo ""
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    echo ""
    echo "Your environment is properly configured."
    echo "You can now:"
    echo "  • Run: make dev (start development servers)"
    echo "  • Run: make help (see all commands)"
    exit 0
fi
