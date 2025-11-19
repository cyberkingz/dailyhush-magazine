# 📋 Instructions pour Vérifier le Statut des Produits dans App Store Connect

## 🎯 Navigation

1. **Va sur App Store Connect** : https://appstoreconnect.apple.com
2. **Clique sur "Apps"** dans le menu de navigation
3. **Sélectionne l'app "Nœma"**
4. **Dans le menu de gauche**, cherche **"Features"** ou **"Monetization"**
5. **Clique sur "In-App Purchases"** ou **"Subscriptions"**

## 📊 Ce qu'il faut vérifier

Pour chaque produit (Monthly, Annual, Lifetime), vérifie :

### Statut du produit

- ✅ **"Ready to Submit"** = Prêt à être soumis
- ✅ **"Approved"** = Approuvé par Apple
- ⚠️ **"Missing Metadata"** = Métadonnées manquantes
- ⚠️ **"Waiting for Review"** = En attente de review
- ❌ **"Rejected"** = Rejeté (voir les raisons)

### Métadonnées requises

- ✅ **Subscription Display Name** (ex: "Premium Monthly")
- ✅ **Description** (visible dans l'App Store)
- ✅ **Review Notes** (pour Apple)
- ✅ **Pricing** (doit être configuré)
- ✅ **Screenshots** (si requis)

### Pour les subscriptions (Monthly, Annual)

- ✅ **Subscription Duration** (1 month, 1 year)
- ✅ **Introductory Offers** (7-day free trial si configuré)
- ✅ **Subscription Group** ("Noema Premium")

### Pour le Lifetime

- ✅ **Product Type** (Non-consumable)
- ✅ **Pricing** (Tier 150 = $149.99)

## 🔍 Produits à vérifier

1. **Noema Premium Monthly** (`com.anthony.noema.monthly`)
2. **Noema Premium Annual** (`com.anthony.noema.annual`)
3. **Noema Premium Lifetime** (`com.anthony.noema.lifetime`)

## 📝 Résultat attendu

Une fois que tu as vérifié, dis-moi :

- Le **statut** de chaque produit
- S'il y a des **métadonnées manquantes**
- Si les produits sont **"Ready to Submit"** ou **"Approved"**

