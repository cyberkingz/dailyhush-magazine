# Vérification App Store Connect & RevenueCat

**Date:** 2025-01-27
**Objectif:** Vérifier que tous les produits sont correctement configurés

---

## 📋 PRODUITS À VÉRIFIER

### Configuration attendue dans le code

D'après `SUBSCRIPTION_PRODUCTS_SUMMARY.md`, les produits doivent être :

| Produit      | Product ID                   | Type                        | Prix    | Trial   |
| ------------ | ---------------------------- | --------------------------- | ------- | ------- |
| **Monthly**  | `com.anthony.noema.monthly`  | Auto-renewable subscription | $9.99   | 7 jours |
| **Annual**   | `com.anthony.noema.annual`   | Auto-renewable subscription | $59.99  | 7 jours |
| **Lifetime** | `com.anthony.noema.lifetime` | Non-consumable              | $149.99 | N/A     |

**Bundle ID:** `com.anthony.noema`

---

## 🍎 APP STORE CONNECT - VÉRIFICATIONS

### 1. Accéder à App Store Connect

- URL: https://appstoreconnect.apple.com
- Se connecter avec votre compte Apple Developer

### 2. Naviguer vers votre app

- **My Apps** → Sélectionner **Nœma** (ou votre app)
- **Monetization** → **In-App Purchases**

### 3. Vérifier les produits créés

#### ✅ Product 1: Monthly

- [ ] **Product ID:** `com.anthony.noema.monthly`
- [ ] **Type:** Auto-Renewable Subscription
- [ ] **Subscription Group:** "Noema Premium" (ou similaire)
- [ ] **Duration:** 1 Month
- [ ] **Price:** $9.99 USD (Tier 10)
- [ ] **Introductory Offer:** 7 days free trial activé
- [ ] **Status:** Ready to Submit ou Approved

#### ✅ Product 2: Annual

- [ ] **Product ID:** `com.anthony.noema.annual`
- [ ] **Type:** Auto-Renewable Subscription
- [ ] **Subscription Group:** Même groupe que Monthly
- [ ] **Duration:** 1 Year
- [ ] **Price:** $59.99 USD (Tier 60)
- [ ] **Introductory Offer:** 7 days free trial activé
- [ ] **Subscription Rank:** 1 (highest - sera suggéré en premier)
- [ ] **Status:** Ready to Submit ou Approved

#### ✅ Product 3: Lifetime

- [ ] **Product ID:** `com.anthony.noema.lifetime`
- [ ] **Type:** Non-Consumable
- [ ] **Price:** $149.99 USD (Tier 150)
- [ ] **Status:** Ready to Submit ou Approved

### 4. Vérifier le Subscription Group

- [ ] **Group Name:** "Noema Premium" (ou similaire)
- [ ] **Ranking:**
  - Annual = Rank 1 (highest)
  - Monthly = Rank 2
- [ ] Les deux produits sont dans le même groupe

### 5. Vérifier les localisations

- [ ] **English (U.S.)** configuré pour tous les produits
- [ ] **Subscription Display Name** rempli
- [ ] **Description** remplie

### 6. Vérifier les Review Information

- [ ] Screenshot uploadé pour chaque produit
- [ ] Review Notes remplis

---

## 💰 REVENUECAT - VÉRIFICATIONS

### 1. Accéder à RevenueCat Dashboard

- URL: https://app.revenuecat.com
- Se connecter avec votre compte RevenueCat

### 2. Sélectionner le projet

- Sélectionner le projet **Nœma** (ou DailyHush si pas encore renommé)

### 3. Vérifier les Products

Allez dans **Products** et vérifiez que ces 3 produits existent :

#### ✅ Product 1: Monthly

- [ ] **Identifier:** `com.anthony.noema.monthly`
- [ ] **Type:** Auto-renewable subscription
- [ ] **Store:** Apple App Store
- [ ] **Display Name:** Monthly Premium (ou similaire)
- [ ] **Status:** ✅ Active (icône verte)

#### ✅ Product 2: Annual

- [ ] **Identifier:** `com.anthony.noema.annual`
- [ ] **Type:** Auto-renewable subscription
- [ ] **Store:** Apple App Store
- [ ] **Display Name:** Annual Premium (ou similaire)
- [ ] **Status:** ✅ Active (icône verte)

#### ✅ Product 3: Lifetime

- [ ] **Identifier:** `com.anthony.noema.lifetime`
- [ ] **Type:** Non-consumable
- [ ] **Store:** Apple App Store
- [ ] **Display Name:** Lifetime Premium (ou similaire)
- [ ] **Status:** ✅ Active (icône verte)

### 4. Vérifier l'Entitlement

Allez dans **Entitlements** :

- [ ] **Entitlement ID:** `premium`
- [ ] **Description:** "Premium access to all features" (ou similaire)
- [ ] **3 produits attachés** à cet entitlement :
  - ✅ `com.anthony.noema.monthly`
  - ✅ `com.anthony.noema.annual`
  - ✅ `com.anthony.noema.lifetime`

### 5. Vérifier l'Offering

Allez dans **Offerings** :

- [ ] **Offering ID:** `default`
- [ ] **Status:** ✅ Set as Current (marqué comme offering actuel)
- [ ] **3 Packages** configurés :

#### Package 1: Monthly

- [ ] **Package ID:** `$rc_monthly`
- [ ] **Product:** `com.anthony.noema.monthly`
- [ ] **Type:** Monthly

#### Package 2: Annual

- [ ] **Package ID:** `$rc_annual`
- [ ] **Product:** `com.anthony.noema.annual`
- [ ] **Type:** Annual
- [ ] ⭐ **Set as Default** (optionnel mais recommandé)

#### Package 3: Lifetime

- [ ] **Package ID:** `$rc_lifetime`
- [ ] **Product:** `com.anthony.noema.lifetime`
- [ ] **Type:** Lifetime

### 6. Vérifier la configuration Apple App Store

Allez dans **Project Settings** → **Apple App Store** :

- [ ] **Bundle ID:** `com.anthony.noema`
- [ ] **In-App Purchase Key (.p8):** ✅ Uploadé
- [ ] **Key ID:** Rempli
- [ ] **Issuer ID:** Rempli
- [ ] **Status:** ✅ Green checkmark (credentials validées)

### 7. Vérifier les API Keys

Allez dans **Project Settings** → **API Keys** :

- [ ] **Public SDK Key (iOS):** Commence par `appl_`
- [ ] **Public SDK Key (Android):** Commence par `goog_`
- [ ] Ces clés doivent être dans votre `.env` :
  ```env
  EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxxx
  EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxxx
  ```

---

## ⚠️ INCOHÉRENCES À VÉRIFIER

### Problème potentiel détecté

Il y a une incohérence dans la documentation :

1. **`REVENUECAT_VERIFICATION.md`** mentionne :
   - `dailyhush_premium_monthly`
   - `dailyhush_premium_annual`
   - `dailyhush_premium_lifetime`

2. **`SUBSCRIPTION_PRODUCTS_SUMMARY.md`** mentionne :
   - `com.anthony.noema.monthly`
   - `com.anthony.noema.annual`
   - `com.anthony.noema.lifetime`

**Action requise:** Vérifier quelle version est réellement configurée dans App Store Connect et RevenueCat. Le code utilise les Product IDs dynamiquement depuis RevenueCat, donc il faut s'assurer que les IDs dans RevenueCat correspondent à ceux dans App Store Connect.

---

## ✅ CHECKLIST RÉSUMÉ

### App Store Connect

- [ ] 3 produits créés avec les bons Product IDs
- [ ] Subscription Group configuré correctement
- [ ] 7-day free trial activé pour Monthly et Annual
- [ ] Prix corrects ($9.99, $59.99, $149.99)
- [ ] Status: Ready to Submit ou Approved
- [ ] Review Information complété

### RevenueCat

- [ ] 3 produits créés avec les mêmes Product IDs qu'App Store Connect
- [ ] Entitlement `premium` créé avec les 3 produits attachés
- [ ] Offering `default` créé et marqué comme "current"
- [ ] 3 packages configurés (`$rc_monthly`, `$rc_annual`, `$rc_lifetime`)
- [ ] Apple App Store credentials configurées (.p8 key uploadée)
- [ ] Bundle ID correspond (`com.anthony.noema`)
- [ ] API Keys disponibles et dans `.env`

### Code

- [ ] `.env` contient les bonnes clés RevenueCat
- [ ] `utils/revenueCat.ts` utilise les bons Package IDs
- [ ] Entitlement ID = `premium` dans le code

---

## 🔍 COMMENT VÉRIFIER RAPIDEMENT

### Dans App Store Connect:

1. **My Apps** → Votre app → **Monetization** → **In-App Purchases**
2. Vérifiez que vous voyez 3 produits
3. Cliquez sur chaque produit pour vérifier les détails

### Dans RevenueCat:

1. **Products** → Vérifiez 3 produits avec status ✅
2. **Entitlements** → Vérifiez `premium` avec 3 produits
3. **Offerings** → Vérifiez `default` avec 3 packages
4. **Project Settings** → **Apple App Store** → Vérifiez credentials ✅

---

## 📝 NOTES IMPORTANTES

1. **Les Product IDs doivent correspondre EXACTEMENT** entre App Store Connect et RevenueCat
2. **Le Bundle ID** doit être `com.anthony.noema` partout
3. **Les Package IDs** dans RevenueCat doivent être `$rc_monthly`, `$rc_annual`, `$rc_lifetime`
4. **L'Entitlement ID** doit être `premium` (utilisé dans le code)
5. **L'Offering** doit être `default` et marqué comme "current"

---

**Prochaine étape:** Une fois toutes les vérifications faites, tester l'achat dans l'app avec un compte Sandbox Tester.

