# 🚀 Rebuild pour TestFlight - Guide Rapide

**Statut :** ✅ Toutes les variables d'environnement sont configurées dans `eas.json`

---

## 📋 ÉTAPES POUR REBUILD

### Étape 1 : Lancer le Build Production

Dans ton terminal, exécute :

```bash
eas build --platform ios --profile production
```

**Ce qui va se passer :**
1. EAS va te demander si tu veux te connecter à ton compte Apple → **Réponds `yes`**
2. Il va te demander ton Apple ID → **Entre : `thony.officiel@icloud.com`**
3. Il va te demander ton mot de passe Apple
4. Si tu as l'authentification à deux facteurs, il va te demander le code à 6 chiffres
5. Le build va commencer (15-30 minutes)

**✅ Confirmation :** Tu verras que les variables d'environnement sont bien chargées :
```
Environment variables loaded from the "production" build profile "env" configuration: 
EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, ...
```

---

### Étape 2 : Attendre la fin du Build

Le build prend environ **15-30 minutes**. Tu peux :
- Suivre la progression dans le terminal
- OU aller sur [expo.dev](https://expo.dev) → Ton projet → Builds

**Quand c'est terminé, tu verras :**
```
✔ Build finished
```

---

### Étape 3 : Soumettre vers TestFlight

Une fois le build terminé, exécute :

```bash
eas submit --platform ios --latest
```

**Ce qui va se passer :**
1. EAS va récupérer automatiquement le dernier build
2. Il va l'uploader vers App Store Connect
3. Il va l'attacher à ta version 1.0.0
4. Le build sera disponible dans TestFlight après 5-15 minutes de processing

---

### Étape 4 : Vérifier dans App Store Connect

1. Va sur [App Store Connect](https://appstoreconnect.apple.com)
2. Sélectionne ton app **Nœma**
3. Va dans **TestFlight**
4. Tu devrais voir le nouveau build avec la version **1.0.0**

---

## ✅ Vérifications

### Vérifier que les variables sont bien incluses

Pendant le build, tu devrais voir dans les logs :
```
Environment variables loaded from the "production" build profile "env" configuration: 
EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, 
EXPO_PUBLIC_REVENUECAT_IOS_KEY, EXPO_PUBLIC_REVENUECAT_ANDROID_KEY, 
EXPO_PUBLIC_POSTHOG_API_KEY, EXPO_PUBLIC_POSTHOG_HOST, 
SENTRY_AUTH_TOKEN, SENTRY_DISABLE_AUTO_UPLOAD
```

### Tester sur TestFlight

Une fois le build disponible dans TestFlight :
1. Installe-le sur ton iPhone
2. Lance l'app
3. **L'app ne devrait PLUS crasher** au lancement ! 🎉

---

## 🆘 Dépannage

### Le build échoue

- Vérifie que tu es bien connecté à Expo : `eas whoami`
- Vérifie que ton Apple ID est correct
- Vérifie que tu as les permissions nécessaires dans App Store Connect

### L'app crash toujours

- Vérifie les logs TestFlight dans App Store Connect
- Vérifie les logs Sentry (les source maps devraient être uploadés automatiquement)
- Vérifie que toutes les variables sont bien dans `eas.json`

---

## 📝 Résumé des Commandes

```bash
# 1. Build
eas build --platform ios --profile production

# 2. Submit (après le build)
eas submit --platform ios --latest

# 3. Vérifier le statut
eas build:list --platform ios --limit 1
```

---

**C'est parti ! Lance le build maintenant ! 🚀**

