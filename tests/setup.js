// Test-only configuration. These values are fixtures, not production secrets.
process.env.JWT_SECRET ||= 'vybe-test-secret';
process.env.JWT_EXPIRES_IN ||= '1h';
