# 🔍 Vérification : Clés RevenueCat

## 📋 Comparaison des clés

### Dans `eas.json` (Production Build)

- **EXPO_PUBLIC_REVENUECAT_IOS_KEY**: `appl_URekFOERLWIiXnSYeGkOJWUYKpM` ✅

### Dans RevenueCat Dashboard

- **Noema (App Store)** SDK API Key: `appl_URekFOERLWIiXnSYeGkOJWUYKpM` ✅
- **Test Store** SDK API Key: `test_KwZxiLPuioAGRBeGrmnYhpsOzug` (pour dev local)

### ✅ Résultat

**Les clés correspondent parfaitement !** La clé de production iOS dans `eas.json` est bien la même que celle dans RevenueCat.

---

## 🔍 Configuration de l'Offering

### Offering "default"

- **Identifier**: `default` ✅
- **Packages configurés**: 3 packages ✅
  - `$rc_monthly` → `com.anthony.noema.monthly` (App Store)
  - `$rc_annual` → `com.anthony.noema.annual` (App Store)
  - `$rc_lifetime` → `com.anthony.noema.lifetime` (App Store)

### ⚠️ Problème potentiel

L'offering "default" doit être marqué comme **"Current Offering"** dans RevenueCat pour que l'app puisse le récupérer.

---

## 🎯 Prochaines étapes

1. Vérifier que l'offering "default" est marqué comme "Current" dans RevenueCat
2. Vérifier que les produits App Store sont bien actifs et approuvés
3. Vérifier que les produits sont bien liés à l'entitlement "premium"
