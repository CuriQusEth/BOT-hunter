# 🔒 Bot Hunter - Security Configuration Guide

## Overview

This guide explains how Bot Hunter protects sensitive information (Builder Code, Payout Address, API keys) while maintaining full functionality.

---

## 🛡️ Security Architecture

### Three-Tier Configuration System

1. **Server-Only Config** (`src/config/erc8021.server.ts`)
   - Contains full, unmasked sensitive data
   - Only accessible in server-side code
   - Never exposed to browser

2. **Client-Safe Config** (`src/config/erc8021.client.ts`)
   - Masked sensitive data for display
   - Safe for client-side use
   - Used in all React components

3. **Environment Variables** (`.env.local`)
   - Store actual secrets
   - Never committed to git
   - Loaded at runtime

---

## 📦 Files Structure

```
Bot Hunter/
├── .env.local                          # YOUR SECRETS (never commit!)
├── .env.local.example                  # Template for setup
│
├── src/config/
│   ├── erc8021.ts                      # DEPRECATED - Legacy config
│   ├── erc8021.server.ts               # 🔐 SERVER-ONLY (sensitive data)
│   └── erc8021.client.ts               # ✅ CLIENT-SAFE (masked data)
│
├── src/hooks/
│   ├── useAttributedTransaction.ts     # ✅ Uses client-safe config
│   └── useMultiEntityAttribution.ts    # ✅ Uses client-safe config
│
└── src/components/
    ├── SendAttributedTransaction.tsx   # ✅ Uses client-safe config
    └── ...
```

---

## 🔑 Environment Variables Setup

### Step 1: Copy Template

```bash
cp .env.local.example .env.local
```

### Step 2: Fill in Your Values

Edit `.env.local`:

```bash
# Bot Hunter - Sensitive Configuration
# ⚠️ NEVER COMMIT THIS FILE TO GIT

# Base Builder Code (from base.dev)
NEXT_PUBLIC_BUILDER_CODE=bc_9b19fklw

# Payout Address (your wallet)
NEXT_PUBLIC_PAYOUT_ADDRESS=0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B

# Base App ID (from base.dev)
NEXT_PUBLIC_BASE_APP_ID=68f40c278c4fe3f562003d93

# Feature Flags
NEXT_PUBLIC_ENABLE_TEST_PAGE=false  # true in development only
NEXT_PUBLIC_DEBUG_ATTRIBUTION=false # true for debug logs
```

### Step 3: Verify .gitignore

Ensure `.env.local` is in `.gitignore`:

```
# Environment variables
.env.local
.env*.local
```

---

## 🎭 How Masking Works

### Client-Side Display

```typescript
// src/config/erc8021.client.ts

// In production:
payoutAddressDisplay: '0x****...****'  // Masked
code: 'bc_*****'                        // Masked

// In development:
payoutAddressDisplay: '0x2953...9b7B'  // Partially visible
code: 'bc_9b19fklw'                     // Fully visible
```

### Server-Side Access

```typescript
// src/config/erc8021.server.ts

// Always has full access:
payoutAddress: '0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B'
code: 'bc_9b19fklw'
```

---

## 🔐 Usage Guidelines

### ✅ DO: Use Client Config in Components

```typescript
// ✅ CORRECT - Client component
import { BOT_HUNTER_CLIENT_CONFIG } from '@/config/erc8021.client';

export function MyComponent() {
  return <div>Code: {BOT_HUNTER_CLIENT_CONFIG.code}</div>;
  // Shows: "bc_*****" in production
}
```

### ❌ DON'T: Use Server Config in Components

```typescript
// ❌ WRONG - Exposes sensitive data!
import { BOT_HUNTER_SERVER_CONFIG } from '@/config/erc8021.server';

export function MyComponent() {
  return <div>Code: {BOT_HUNTER_SERVER_CONFIG.code}</div>;
  // Would expose: "bc_9b19fklw" in production
}
```

### ✅ DO: Use Server Config in API Routes

```typescript
// ✅ CORRECT - API route (server-side)
import { BOT_HUNTER_SERVER_CONFIG } from '@/config/erc8021.server';

export async function POST(request: Request) {
  const { code, payoutAddress } = BOT_HUNTER_SERVER_CONFIG;
  // Full access to sensitive data on server
}
```

---

## 🚫 Test Page Security

### Production Protection

The test attribution page (`/test-attribution`) is automatically disabled in production:

```typescript
// src/app/test-attribution/page.tsx

export default function TestAttributionPage() {
  if (!isTestPageEnabled()) {
    return <div>🔒 Test Page Disabled</div>;
  }
  // ...
}
```

### Enable in Development

```bash
# .env.local
NEXT_PUBLIC_ENABLE_TEST_PAGE=true
```

### Enable in Production (not recommended)

Only enable if you need to test in production:

```bash
# .env.local (production)
NEXT_PUBLIC_ENABLE_TEST_PAGE=true
```

⚠️ **Warning:** Even when enabled, sensitive data is still masked!

---

## 🐛 Debug Logging

### Enable Debug Mode

```bash
# .env.local
NEXT_PUBLIC_DEBUG_ATTRIBUTION=true
```

### Debug Output

When enabled, you'll see attribution logs:

```
[Attribution] Preparing attributed transaction
[Attribution] Multi-entity attribution: 2 codes
[Attribution] 📤 Sending transaction with Bot Hunter attribution
[Attribution] ✅ Transaction sent with attribution
```

### Disable in Production

Debug logging is automatically disabled in production unless explicitly enabled.

---

## 🔍 Security Checklist

Before deploying to production:

- [ ] `.env.local` contains real values
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.local` is NOT committed to git
- [ ] `NEXT_PUBLIC_ENABLE_TEST_PAGE=false` in production
- [ ] `NEXT_PUBLIC_DEBUG_ATTRIBUTION=false` in production
- [ ] All components use `erc8021.client.ts` (not `.server.ts`)
- [ ] API routes use `erc8021.server.ts` when needed
- [ ] Verify masked values in browser DevTools

---

## 🛠️ Troubleshooting

### Problem: Builder Code showing as "bc_*****"

**Cause:** Production masking is active  
**Solution:** This is correct! Builder code is masked on client-side for security

### Problem: Test page showing "🔒 Test Page Disabled"

**Cause:** `NEXT_PUBLIC_ENABLE_TEST_PAGE` is false  
**Solution:** Set to `true` in `.env.local` for development

### Problem: Environment variables not loading

**Cause:** `.env.local` missing or incorrectly named  
**Solution:** 
1. Ensure file is named `.env.local` (not `.env.local.txt`)
2. Restart dev server: `npm run dev`
3. Verify file location (project root)

### Problem: Sensitive data visible in browser

**Cause:** Using server config in client component  
**Solution:** Replace imports:
```typescript
// ❌ WRONG
import { BOT_HUNTER_SERVER_CONFIG } from '@/config/erc8021.server';

// ✅ CORRECT
import { BOT_HUNTER_CLIENT_CONFIG } from '@/config/erc8021.client';
```

---

## 📚 Related Documentation

- [Base Builder Codes Integration](./docs/BASE-BUILDER-CODES-INTEGRATION.md)
- [ERC-8021 Security](./docs/ERC8021-SECURITY.md)
- [Environment Variables (Next.js)](https://nextjs.org/docs/basic-features/environment-variables)

---

## 🔐 Summary

**Security Principle:** 
> "Never trust the client. Always mask sensitive data in the browser."

Bot Hunter implements a three-tier security system:
1. **Server-only** full access to secrets
2. **Client-safe** masked display values
3. **Environment** secure storage in `.env.local`

All sensitive Builder Code and payout address information is protected while maintaining full attribution functionality! 🎉
