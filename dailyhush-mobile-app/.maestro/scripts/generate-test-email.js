/**
 * Generate unique test email for Maestro tests
 * Usage in YAML: runScript with env.TEST_EMAIL
 */

const timestamp = Date.now();
const random = Math.floor(Math.random() * 10000);

output.TEST_EMAIL = `test-${timestamp}-${random}@dailyhush.test`;
