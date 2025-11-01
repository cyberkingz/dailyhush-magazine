/**
 * End-to-End Encryption Library for Mood Entries
 * Implements AES-256-GCM encryption for therapeutic journal data
 */

import * as SecureStore from 'expo-secure-store';
import { supabase } from '@/utils/supabase';

// ================================================
// CONSTANTS
// ================================================

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256; // bits
const NONCE_LENGTH = 12; // bytes (96 bits)
const TAG_LENGTH = 16; // bytes (128 bits)
const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 32; // bytes

const SECURE_STORE_KEYS = {
  MASTER_KEY: 'mood_encryption_master_key',
  KEY_SALT: 'mood_encryption_key_salt',
  KEY_VERSION: 'mood_encryption_key_version',
} as const;

// ================================================
// KEY MANAGEMENT
// ================================================

/**
 * Generates a new encryption key for the user
 * Called during onboarding or first mood entry
 */
export async function generateEncryptionKey(
  userId: string,
  userPassword: string
): Promise<void> {
  // Generate random master key
  const masterKey = crypto.getRandomValues(new Uint8Array(KEY_LENGTH / 8));

  // Generate random salt for key derivation
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const saltBase64 = arrayBufferToBase64(salt);

  // Derive key from user password
  const passwordKey = await deriveKeyFromPassword(userPassword, saltBase64);

  // Encrypt the master key with the password-derived key
  const encryptedMasterKey = await encryptWithKey(masterKey, passwordKey);

  // Store encrypted master key in Supabase
  const { error: dbError } = await supabase.from('user_encryption_keys').insert({
    user_id: userId,
    encrypted_master_key: encryptedMasterKey.ciphertext,
    key_derivation_salt: saltBase64,
    algorithm: ALGORITHM,
    key_version: 1,
  });

  if (dbError) {
    throw new Error(`Failed to store encryption key: ${dbError.message}`);
  }

  // Store master key in secure storage (for quick access)
  await SecureStore.setItemAsync(
    SECURE_STORE_KEYS.MASTER_KEY,
    arrayBufferToBase64(masterKey)
  );
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.KEY_SALT, saltBase64);
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.KEY_VERSION, '1');
}

/**
 * Retrieves the user's encryption key from secure storage
 * If not found, attempts to decrypt from Supabase using password
 */
export async function getUserEncryptionKey(): Promise<CryptoKey> {
  // Try to get from secure storage first (fastest)
  const storedKeyBase64 = await SecureStore.getItemAsync(
    SECURE_STORE_KEYS.MASTER_KEY
  );

  if (storedKeyBase64) {
    const keyBuffer = base64ToArrayBuffer(storedKeyBase64);
    return await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: ALGORITHM, length: KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // If not in secure storage, need to re-derive from password
  throw new Error(
    'Encryption key not found. Please re-authenticate to restore access.'
  );
}

/**
 * Unlocks the encryption key using user's password
 * Called during login or when secure storage is cleared
 */
export async function unlockEncryptionKey(
  userId: string,
  userPassword: string
): Promise<void> {
  // Fetch encrypted key from database
  const { data, error } = await supabase
    .from('user_encryption_keys')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch encryption key: ${error.message}`);
  }

  if (!data) {
    throw new Error('No encryption key found for user');
  }

  // Derive key from password
  const passwordKey = await deriveKeyFromPassword(
    userPassword,
    data.key_derivation_salt
  );

  // Decrypt master key
  try {
    const decryptedMasterKey = await decryptWithKey(
      {
        ciphertext: new Uint8Array(data.encrypted_master_key as any),
        nonce: '', // Stored inline with ciphertext
      },
      passwordKey
    );

    // Store in secure storage for future use
    await SecureStore.setItemAsync(
      SECURE_STORE_KEYS.MASTER_KEY,
      arrayBufferToBase64(decryptedMasterKey)
    );
    await SecureStore.setItemAsync(
      SECURE_STORE_KEYS.KEY_SALT,
      data.key_derivation_salt
    );
    await SecureStore.setItemAsync(
      SECURE_STORE_KEYS.KEY_VERSION,
      data.key_version.toString()
    );
  } catch (error) {
    throw new Error('Invalid password. Could not decrypt encryption key.');
  }
}

/**
 * Rotates the encryption key (for security best practices)
 * Should be done every 90 days or on password change
 */
export async function rotateEncryptionKey(
  userId: string,
  newPassword: string
): Promise<void> {
  // Get current master key
  const currentKey = await getUserEncryptionKey();

  // Generate new master key
  const newMasterKey = crypto.getRandomValues(new Uint8Array(KEY_LENGTH / 8));

  // Generate new salt
  const newSalt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const newSaltBase64 = arrayBufferToBase64(newSalt);

  // Derive new password key
  const newPasswordKey = await deriveKeyFromPassword(newPassword, newSaltBase64);

  // Encrypt new master key
  const encryptedNewKey = await encryptWithKey(newMasterKey, newPasswordKey);

  // Export current key as previous key
  const currentKeyBuffer = await crypto.subtle.exportKey('raw', currentKey);

  // Update in database
  const { error } = await supabase
    .from('user_encryption_keys')
    .update({
      encrypted_master_key: encryptedNewKey.ciphertext,
      key_derivation_salt: newSaltBase64,
      key_version: supabase.raw('key_version + 1'),
      previous_key: new Uint8Array(currentKeyBuffer),
      rotated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to rotate encryption key: ${error.message}`);
  }

  // Update secure storage
  await SecureStore.setItemAsync(
    SECURE_STORE_KEYS.MASTER_KEY,
    arrayBufferToBase64(newMasterKey)
  );
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.KEY_SALT, newSaltBase64);
}

/**
 * Clears encryption keys from secure storage (logout)
 */
export async function clearEncryptionKeys(): Promise<void> {
  await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.MASTER_KEY);
  await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.KEY_SALT);
  await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.KEY_VERSION);
}

// ================================================
// ENCRYPTION / DECRYPTION
// ================================================

/**
 * Encrypts text using user's encryption key
 */
export async function encryptText(plaintext: string): Promise<{
  ciphertext: Uint8Array;
  nonce: string;
}> {
  if (!plaintext) {
    throw new Error('Cannot encrypt empty text');
  }

  const key = await getUserEncryptionKey();
  const nonce = crypto.getRandomValues(new Uint8Array(NONCE_LENGTH));
  const plaintextBuffer = new TextEncoder().encode(plaintext);

  const ciphertextBuffer = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: nonce,
      tagLength: TAG_LENGTH * 8, // bits
    },
    key,
    plaintextBuffer
  );

  return {
    ciphertext: new Uint8Array(ciphertextBuffer),
    nonce: arrayBufferToBase64(nonce),
  };
}

/**
 * Decrypts text using user's encryption key
 */
export async function decryptText(
  ciphertext: Uint8Array,
  nonceBase64: string
): Promise<string> {
  if (!ciphertext || !nonceBase64) {
    throw new Error('Cannot decrypt without ciphertext and nonce');
  }

  const key = await getUserEncryptionKey();
  const nonce = base64ToArrayBuffer(nonceBase64);

  try {
    const plaintextBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: nonce,
        tagLength: TAG_LENGTH * 8,
      },
      key,
      ciphertext
    );

    return new TextDecoder().decode(plaintextBuffer);
  } catch (error) {
    throw new Error(`Decryption failed: ${error}`);
  }
}

// ================================================
// KEY DERIVATION
// ================================================

/**
 * Derives an encryption key from a password using PBKDF2
 */
async function deriveKeyFromPassword(
  password: string,
  saltBase64: string
): Promise<CryptoKey> {
  const passwordBuffer = new TextEncoder().encode(password);
  const salt = base64ToArrayBuffer(saltBase64);

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive actual encryption key
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts data with a specific key (for key wrapping)
 */
async function encryptWithKey(
  data: Uint8Array,
  key: CryptoKey
): Promise<{
  ciphertext: Uint8Array;
  nonce: string;
}> {
  const nonce = crypto.getRandomValues(new Uint8Array(NONCE_LENGTH));

  const ciphertextBuffer = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: nonce,
      tagLength: TAG_LENGTH * 8,
    },
    key,
    data
  );

  return {
    ciphertext: new Uint8Array(ciphertextBuffer),
    nonce: arrayBufferToBase64(nonce),
  };
}

/**
 * Decrypts data with a specific key (for key unwrapping)
 */
async function decryptWithKey(
  encrypted: {
    ciphertext: Uint8Array;
    nonce: string;
  },
  key: CryptoKey
): Promise<Uint8Array> {
  const nonce = base64ToArrayBuffer(encrypted.nonce);

  const plaintextBuffer = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: nonce,
      tagLength: TAG_LENGTH * 8,
    },
    key,
    encrypted.ciphertext
  );

  return new Uint8Array(plaintextBuffer);
}

// ================================================
// UTILITY FUNCTIONS
// ================================================

/**
 * Converts ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converts Base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Validates encryption key exists and is accessible
 */
export async function validateEncryptionKey(): Promise<boolean> {
  try {
    const key = await getUserEncryptionKey();
    return key !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Tests encryption/decryption with a sample text
 */
export async function testEncryption(): Promise<boolean> {
  const testText = 'Test encryption 🔐';

  try {
    const encrypted = await encryptText(testText);
    const decrypted = await decryptText(encrypted.ciphertext, encrypted.nonce);

    return decrypted === testText;
  } catch (error) {
    console.error('Encryption test failed:', error);
    return false;
  }
}

// ================================================
// EXPORTS
// ================================================

export const EncryptionConstants = {
  ALGORITHM,
  KEY_LENGTH,
  NONCE_LENGTH,
  TAG_LENGTH,
  PBKDF2_ITERATIONS,
  SALT_LENGTH,
} as const;
