import { subtle } from 'node:crypto'; // Web Crypto API in Node.js

import env from "../env.js";

const ED25519 = 'Ed25519'
const SHA256 = 'SHA-256'

export function base64urlToBytes(b64: string): Uint8Array {
  const base64 = b64.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}

export function bytesToBase64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function sha256Hex(input: string): Promise<string> {
  const buf = await subtle.digest(
    SHA256,
    new TextEncoder().encode(input)
  );
  return [...new Uint8Array(buf)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashIp(ip: string): Promise<string> {
  return sha256Hex(`ip:${env.POW_SECRET}:${ip}`);
}

// ── Signature verification ────────────────────────────────────────────────────

export interface SignedPayload {
  pubkey: string;      // base64url Ed25519 public key (32 bytes)
  timestamp: number;   // ms
  signature: string;   // base64url Ed25519 signature (64 bytes)
  data: unknown;
}

export function isValidPubkey(pubkey: string): boolean {
  try {
    const bytes = base64urlToBytes(pubkey);
    return bytes.length === 32;
  } catch {
    return false;
  }
}

/**
 * Verify Ed25519 signature using Node.js built-in Web Crypto API
 */
export async function verifySignature(payload: SignedPayload): Promise<boolean> {
  try {
    // 1. Replay protection
    const drift = Math.abs(Date.now() - payload.timestamp);
    if (drift > env.REPLAY_WINDOW_MS) return false;

    // 2. Reconstruct the exact message that was signed
    const message = JSON.stringify({
      data: payload.data,
      timestamp: payload.timestamp,
    });

    const pubkeyBytes = base64urlToBytes(payload.pubkey);
    const sigBytes = base64urlToBytes(payload.signature);
    const msgBytes = new TextEncoder().encode(message);

    // 3. Import public key
    const publicKey = await subtle.importKey(
      'raw',
      pubkeyBytes,
      { name: ED25519 },
      false,           // not extractable
      ['verify']
    );

    // 4. Verify signature
    return await subtle.verify(
      ED25519,
      publicKey,
      sigBytes,
      msgBytes
    );
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}