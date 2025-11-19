# 🔐 Guide : Configurer les Variables d'Environnement dans EAS Build

**Problème :** Les variables d'environnement du fichier `.env` local ne sont **PAS** automatiquement incluses dans les builds EAS.

---

## 📋 Variables d'environnement nécessaires

D'après le code, voici les variables utilisées :

1. **EXPO_PUBLIC_SUPABASE_URL** ⚠️ **OBLIGATOIRE** (crash si manquant)
2. **EXPO_PUBLIC_SUPABASE_ANON_KEY** ⚠️ **OBLIGATOIRE** (crash si manquant)
3. **EXPO_PUBLIC_REVENUECAT_IOS_KEY** (pour les abonnements)
4. **EXPO_PUBLIC_POSTHOG_API_KEY** (pour l'analytics)
5. **EXPO_PUBLIC_POSTHOG_HOST** (optionnel, valeur par défaut : `https://us.i.posthog.com`)

---

## 🎯 MÉTHODE 1 : Secrets EAS (Recommandé - Plus sécurisé)

**Avantages :**

- ✅ Secrets stockés de manière sécurisée
- ✅ Pas de secrets dans le repo git
- ✅ Gestion centralisée

### Étape 1 : Lister les secrets existants

```bash
eas secret:list
```

### Étape 2 : Ajouter chaque variable

```bash
# Supabase (OBLIGATOIRE)
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://kisewkjogomsstgvqggc.supabase.co" --type string

eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "TON_ANON_KEY_ICI" --type string

# RevenueCat
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "TON_REVENUECAT_KEY" --type string

# PostHog
eas secret:create --scope project --name EXPO_PUBLIC_POSTHOG_API_KEY --value "TON_POSTHOG_KEY" --type string

# PostHog Host (optionnel)
eas secret:create --scope project --name EXPO_PUBLIC_POSTHOG_HOST --value "https://us.i.posthog.com" --type string
```

**Note :** Remplace `TON_ANON_KEY_ICI`, etc. par les vraies valeurs de ton fichier `.env`.

### Étape 3 : Vérifier les secrets

```bash
eas secret:list
```

Tu devrais voir toutes les variables listées.

---

## 🎯 MÉTHODE 2 : eas.json (Plus simple mais moins sécurisé)

**Avantages :**

- ✅ Simple et rapide
- ✅ Toutes les variables au même endroit

**Inconvénients :**

- ⚠️ Les secrets sont visibles dans le repo git
- ⚠️ Si tu commits `eas.json`, les secrets sont exposés

### Étape 1 : Mettre à jour `eas.json`

Ajoute les variables dans la section `env` du profile `production` :

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "distribution": "store",
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://kisewkjogomsstgvqggc.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "TON_ANON_KEY_ICI",
        "EXPO_PUBLIC_REVENUECAT_IOS_KEY": "TON_REVENUECAT_KEY",
        "EXPO_PUBLIC_POSTHOG_API_KEY": "TON_POSTHOG_KEY",
        "EXPO_PUBLIC_POSTHOG_HOST": "https://us.i.posthog.com",
        "SENTRY_DISABLE_AUTO_UPLOAD": "true"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "hello@trynoema.com",
        "ascAppId": "6755148761",
        "appleTeamId": "8F563NMZV5"
      }
    }
  }
}
```

**⚠️ IMPORTANT :** Si tu utilises cette méthode, assure-toi que `eas.json` est dans `.gitignore` ou utilise des variables d'environnement locales.

---

## 🚀 Après configuration

### 1. Rebuild l'app

```bash
eas build --platform ios --profile production
```

### 2. Vérifier que les variables sont bien incluses

Pendant le build, EAS affichera les variables d'environnement utilisées (sans les valeurs pour la sécurité).

### 3. Resubmit vers TestFlight

```bash
eas submit --platform ios --latest
```

---

## 🔍 Comment récupérer les valeurs depuis ton `.env` local

Si tu ne te souviens plus des valeurs, tu peux :

1. **Ouvrir le fichier `.env`** dans ton éditeur
2. **Copier chaque valeur** et la coller dans la commande `eas secret:create` ou dans `eas.json`

**Exemple :**

```bash
# Dans ton .env, tu as :
EXPO_PUBLIC_SUPABASE_URL=https://kisewkjogomsstgvqggc.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Tu copies ces valeurs et tu les utilises dans :
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://kisewkjogomsstgvqggc.supabase.co" --type string
```

---

## ✅ Vérification

Après avoir configuré les variables et rebuild l'app, teste sur TestFlight :

1. L'app ne devrait **plus** crasher au lancement
2. Les fonctionnalités Supabase devraient fonctionner
3. RevenueCat devrait fonctionner
4. PostHog devrait tracker les événements

---

## 🆘 Dépannage

### Les variables ne sont pas prises en compte

1. Vérifie que tu as bien rebuild : `eas build --platform ios --profile production`
2. Vérifie les secrets : `eas secret:list`
3. Vérifie `eas.json` si tu utilises cette méthode

### L'app crash toujours

1. Vérifie les logs TestFlight pour voir l'erreur exacte
2. Vérifie que toutes les variables obligatoires sont configurées
3. Vérifie que les valeurs sont correctes (pas d'espaces, guillemets corrects)

---

**Recommandation :** Utilise la **Méthode 1 (Secrets EAS)** pour plus de sécurité ! 🔒
