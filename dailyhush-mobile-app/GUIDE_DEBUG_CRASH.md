# 🐛 Guide : Déboguer les Crashes TestFlight

**Problème :** L'app crash immédiatement au lancement sur TestFlight

---

## 📋 SOURCES DE LOGS (par ordre de priorité)

### 1. 🎯 **TestFlight Crash Logs** (Le plus simple)

**Dans App Store Connect :**

1. Va sur [App Store Connect](https://appstoreconnect.apple.com)
2. Sélectionne ton app **Nœma**
3. Va dans **TestFlight** (menu latéral)
4. Clique sur **"Feedback"** → **"Crashes"**
5. Tu verras tous les crashes avec :
   - Stack traces complets
   - Symbolication automatique
   - Informations sur l'appareil
   - Version iOS

**Avantages :**
- ✅ Symbolication automatique (noms de fonctions lisibles)
- ✅ Facile à accéder
- ✅ Historique complet

---

### 2. 🔍 **Sentry** (Si configuré correctement)

**URL Sentry :** https://sentry.io/organizations/noema-sa/projects/react-native/

**Vérification :**
1. Va sur [sentry.io](https://sentry.io)
2. Connecte-toi avec ton compte
3. Va dans **Projects** → **react-native**
4. Regarde la section **"Issues"** pour les crashes récents

**Si tu n'as pas accès :**
- Vérifie que le DSN est correct dans `app/_layout.tsx`
- Vérifie que Sentry est bien initialisé avant le crash

**DSN actuel :**
```
https://d2daf2f2691269cb8ed4d3f8b049d59e@o4510369045741568.ingest.us.sentry.io/4510369062977536
```

---

### 3. 💻 **Console.app (Mac)** - Si iPhone connecté

**Sur ton Mac :**

1. Connecte ton iPhone via USB
2. Ouvre **Console.app** (Applications > Utilitaires)
3. Dans la barre latérale, sélectionne ton iPhone
4. Filtre par "Nœma" ou "noema"
5. Regarde les logs en temps réel

**Avantages :**
- ✅ Logs en temps réel
- ✅ Tous les logs système
- ✅ Pas besoin de rebuild

---

### 4. 📱 **Xcode Organizer** - Crash Reports

**Dans Xcode :**

1. Ouvre **Xcode**
2. Menu : **Window** → **Organizer**
3. Onglet **"Crashes"**
4. Sélectionne ton app **Nœma**
5. Tu verras tous les crash reports

**Avantages :**
- ✅ Symbolication automatique
- ✅ Stack traces détaillés
- ✅ Informations sur l'appareil

---

## 🔧 VÉRIFICATIONS RAPIDES

### ⚠️ **PROBLÈME IDENTIFIÉ : Variables d'environnement manquantes**

**Cause probable du crash :** Les variables d'environnement Supabase ne sont **PAS** configurées dans EAS Build.

Le fichier `.env` local n'est **PAS** automatiquement inclus dans les builds EAS. Il faut les configurer manuellement.

**Solution :** Configurer les secrets EAS

```bash
# Ajouter les variables d'environnement Supabase
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://kisewkjogomsstgvqggc.supabase.co" --type string

eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "TON_ANON_KEY_ICI" --type string

# Ajouter RevenueCat (si nécessaire)
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "TON_REVENUECAT_KEY" --type string

# Ajouter PostHog (si nécessaire)
eas secret:create --scope project --name EXPO_PUBLIC_POSTHOG_API_KEY --value "TON_POSTHOG_KEY" --type string
```

**OU** ajouter dans `eas.json` :

```json
{
  "build": {
    "production": {
      "distribution": "store",
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://kisewkjogomsstgvqggc.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "ton_anon_key",
        "EXPO_PUBLIC_REVENUECAT_IOS_KEY": "ton_revenuecat_key",
        "EXPO_PUBLIC_POSTHOG_API_KEY": "ton_posthog_key",
        "SENTRY_DISABLE_AUTO_UPLOAD": "true"
      }
    }
  }
}
```

⚠️ **ATTENTION :** Si tu utilises `eas.json`, les secrets sont visibles dans le repo. Utilise `eas secret:create` pour plus de sécurité.

### Vérifier que Sentry fonctionne

Vérifie dans `app/_layout.tsx` que Sentry est initialisé **AVANT** tout autre code :

```typescript
// Doit être en haut du fichier, avant les imports React
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://d2daf2f2691269cb8ed4d3f8b049d59e@o4510369045741568.ingest.us.sentry.io/4510369062977536',
  // ...
});
```

### Causes communes de crash au lancement

1. **🔴 Variables d'environnement manquantes** (.env) - **PROBABLE CAUSE**
2. **Erreur dans `_layout.tsx`** (initialisation)
3. **Fonts non chargées** (expo-font)
4. **Erreur dans un hook initial** (useAuthSync, etc.)
5. **Problème avec RevenueCat** (initialisation)
6. **Erreur avec Supabase** (connexion)

---

## 🚀 ACTIONS IMMÉDIATES

### 🔴 **PRIORITÉ #1 : Configurer les variables d'environnement**

**C'est probablement la cause du crash !**

1. **Récupère tes variables d'environnement** depuis ton fichier `.env` local
2. **Configure-les dans EAS** avec `eas secret:create` (voir ci-dessus)
3. **Rebuild l'app** : `eas build --platform ios --profile production`
4. **Resubmit** : `eas submit --platform ios --latest`

### Option 1 : Vérifier TestFlight (Pour confirmer)

1. Va sur App Store Connect → TestFlight → Crashes
2. Regarde le dernier crash
3. Cherche l'erreur : `"Missing Supabase environment variables"`
4. Si c'est ça, confirme que c'est bien le problème

### Option 2 : Vérifier Sentry

1. Va sur https://sentry.io/organizations/noema-sa/projects/react-native/
2. Regarde les "Issues" récentes
3. Clique sur le crash pour voir les détails
4. Cherche l'erreur liée aux variables d'environnement

### Option 3 : Ajouter des logs de debug

Si les logs ne sont pas suffisants, on peut ajouter des logs dans `app/_layout.tsx` pour identifier où ça crash.

---

## 📝 PROCHAINES ÉTAPES

1. **Récupère les logs** (TestFlight ou Sentry)
2. **Partage-moi le stack trace** et je t'aiderai à identifier le problème
3. **On fixera le bug**
4. **On rebuildera et retestera**

---

**Dis-moi ce que tu trouves dans TestFlight ou Sentry ! 🐛**

