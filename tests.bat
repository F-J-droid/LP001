@echo off
echo "Running lint..."
call npm run lint
echo "Running typecheck..."
call npm run typecheck
echo "Running test:run..."
call npm run test:run
echo "Running build..."
call npm run build
