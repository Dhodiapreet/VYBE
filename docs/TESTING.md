# Testing Structure

## Framework
- **Test Runner**: Jest 30.5.1
- **API Testing**: Supertest
- **Runtime observed**: Node.js v24.14.0

## Configuration
- Jest configured via jest.config.js.
- Test command mapped to jest in package.json.
- Jest test environment is explicitly node.
- tests/api.test.js uses mongodb://127.0.0.1:27017/vybe_test.

## Test Coverage
Integration tests exist in tests/api.test.js for health, auth registration, movies, and search.

## Step 4 Investigation â€” Current Findings

The MongoDB service itself is currently healthy:
- Windows service: MongoDB â€” Running, Automatic.
- MongoDB Server version observed: 8.3.
- Listener: 127.0.0.1:27017.
- mongod configuration binds to 127.0.0.1 on port 27017.
- Direct Node.js + Mongoose connection to mongodb://127.0.0.1:27017/vybe_test succeeds.
- Loading src/app.js and then connecting directly with Mongoose also succeeds.

Therefore, the current evidence does not support MongoDB being unavailable.

## Current Test Failure

Running npm test -- --runInBand still fails.
- beforeAll() in tests/api.test.js times out while awaiting mongoose.connect().
- The five API tests fail because shared setup does not complete.
- afterAll() then reports a Mongoose buffering timeout while attempting dropDatabase().
- MongoDB logs show Jest reaches 127.0.0.1:27017; connections are accepted and then end.
- A temporary isolated Jest diagnostic test containing only mongoose.connect() also failed to complete, while equivalent direct Node.js connection succeeds.

This narrows the problem to the Jest execution environment / Mongoose interaction rather than basic MongoDB service availability or the local URI.

## Constraints

Do not replace the existing database strategy with mongodb-memory-server merely to make tests pass.
Do not remove or weaken integration tests.
Do not change production MongoDB connection logic without an explicit architectural decision.
Do not claim the test suite passes.

## Verification Status

Current test suite status: FAILING.
The failure is reproducible as of Step 4.
The database server is reachable outside Jest. Further investigation should focus on the test runner/runtime boundary.
## Step 4.5 — Jest/Mongoose Fix

The root cause was isolated to the default Jest execution environment interacting poorly with the MongoDB Node driver connection path. Direct Node.js and MongoDB connectivity were healthy, while the default Jest runner stalled during the native MongoDB driver handshake. A focused runner change was tested using jest-light-runner, which runs tests in a bare Node.js environment rather than virtualizing the environment.

Changes:
- Added dev dependency: jest-light-runner 0.8.1.
- Configured jest.config.js to use jest-light-runner.
- Added tests/setup.js with explicit test-only JWT fixtures so authentication tests do not depend on an uncommitted local .env file.
- Moved the suite timeout configuration into jest.config.js and removed the per-file jest.setTimeout call because the light runner does not expose that method on its jest object.

Verification:
- npm test -- --runInBand --no-cache: PASS — 1 suite, 5 tests.
- npm test -- --no-cache: PASS — 1 suite, 5 tests.
- No mongodb-memory-server was used.
- Production MongoDB connection code was not changed.
