# 🔧 Fix : RevenueCat Production API Key

**Problème :** L'app utilise une clé API de test (`test_...`) alors qu'il faut une clé de production (`appl_...`) pour TestFlight/Production.

---

## 🎯 Solution : Récupérer la clé de production

### Étape 1 : Aller sur RevenueCat Dashboard

1. Va sur [https://app.revenuecat.com](https://app.revenuecat.com)
2. Connecte-toi avec ton compte
3. Sélectionne ton projet **Nœma** (ou DailyHush)

### Étape 2 : Récupérer la clé de production iOS

1. Va dans **Project Settings** → **API Keys**
2. Cherche la section **"Public SDK Keys"**
3. Copie la clé **iOS** qui commence par `appl_` (pas `test_`)
   - Exemple : `appl_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Étape 3 : Mettre à jour `eas.json`

Remplace la clé de test par la clé de production dans `eas.json` :

```json
"EXPO_PUBLIC_REVENUECAT_IOS_KEY": "appl_XXXXXXXXXXXXX"  // Remplace par ta vraie clé
```

---

## ⚠️ Important

- **Clé de test** (`test_...`) : Pour le développement local uniquement
- **Clé de production** (`appl_...`) : Pour TestFlight et App Store

---

## 🚀 Après avoir mis à jour

1. **Rebuild** : `eas build --platform ios --profile production`
2. **Submit** : `eas submit --platform ios --latest`
3. **Tester** : L'app ne devrait plus afficher l'erreur "Wrong API Key"

---

**Une fois que tu as la clé de production, dis-moi et je la mettrai dans `eas.json` !**
