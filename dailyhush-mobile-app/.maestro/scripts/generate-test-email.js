/**
 * Generate unique test email for Maestro tests
 * Usage in YAML: runScript with env.TEST_EMAIL
 */

// This script is intended to be run by Maestro, which provides a global `output` object.
// When running outside of Maestro, the `output` object is not defined, so we declare it here to avoid an error.
if (typeof output === 'undefined') {
  // @ts-ignore
  var output = {};
}

try {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);

  output.TEST_EMAIL = `test-${timestamp}-${random}@dailyhush.test`;
} catch (error) {
  // Ignore the error when running outside of Maestro.
}
