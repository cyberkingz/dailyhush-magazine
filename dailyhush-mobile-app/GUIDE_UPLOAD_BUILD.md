# 📦 Guide : Uploader le Build vers App Store Connect

**Projet :** Nœma (Expo)  
**Bundle ID :** `com.anthony.noema`  
**Version :** 1.0.0  
**Build Number :** 1.0.0

---

## 🎯 MÉTHODE RECOMMANDÉE : EAS Build + EAS Submit

**Avantages :**
- ✅ Automatique et simple
- ✅ Pas besoin de Xcode
- ✅ Build dans le cloud
- ✅ Submit automatique vers App Store Connect

---

## 📋 PRÉREQUIS

### 1. Installer EAS CLI (si pas déjà fait)

```bash
npm install -g eas-cli
```

### 2. Se connecter à Expo

```bash
eas login
```

Utilise ton compte Expo (celui lié à `hello@trynoema.com`)

### 3. Vérifier la configuration

Ton `eas.json` est déjà configuré avec :
- ✅ Profile `production` pour App Store
- ✅ Submit configuré avec ton App Store Connect ID

---

## 🚀 ÉTAPE 1 : Build Production iOS

### Option A : Build dans le cloud (Recommandé)

```bash
eas build --platform ios --profile production
```

**Ce qui se passe :**
1. EAS upload ton code vers leurs serveurs
2. Build automatique dans le cloud
3. Génération du fichier `.ipa`
4. Temps estimé : **15-30 minutes**

**Pendant le build :**
- Tu peux suivre la progression sur [expo.dev](https://expo.dev)
- Tu recevras une notification quand c'est terminé

### Option B : Build local (si tu as un Mac)

```bash
eas build --platform ios --profile production --local
```

**Avantages :**
- Plus rapide (pas d'attente de queue)
- Plus de contrôle

**Inconvénients :**
- Nécessite Xcode installé
- Nécessite un Mac

---

## 📤 ÉTAPE 2 : Submit vers App Store Connect

Une fois le build terminé, soumets-le automatiquement :

```bash
eas submit --platform ios --latest
```

**Ce qui se passe :**
1. EAS récupère le dernier build
2. Upload vers App Store Connect
3. Le build apparaît dans App Store Connect en 5-15 minutes

**Alternative :** Si tu veux soumettre un build spécifique :

```bash
eas submit --platform ios --id <BUILD_ID>
```

---

## 🔄 MÉTHODE ALTERNATIVE : Xcode/Transporter

Si tu préfères utiliser Xcode directement :

### Étape 1 : Générer les fichiers natifs

```bash
npx expo prebuild --platform ios
```

Cela crée un dossier `ios/` avec le projet Xcode.

### Étape 2 : Ouvrir dans Xcode

```bash
open ios/*.xcworkspace
```

**OU** si pas de workspace :

```bash
open ios/*.xcodeproj
```

### Étape 3 : Configurer le Signing

1. Dans Xcode, sélectionne le projet dans le navigateur
2. Sélectionne la target "noema"
3. Va dans l'onglet **"Signing & Capabilities"**
4. Coche **"Automatically manage signing"**
5. Sélectionne ton **Team** (Apple Developer Account)
6. Vérifie que le **Bundle Identifier** est `com.anthony.noema`

### Étape 4 : Archiver le build

1. Dans Xcode, sélectionne **"Any iOS Device"** ou **"Generic iOS Device"** dans le sélecteur de destination
2. Menu : **Product > Archive**
3. Attends la fin de l'archivage (5-10 minutes)

### Étape 5 : Uploader via Organizer

1. Une fois l'archive terminée, la fenêtre **Organizer** s'ouvre automatiquement
2. Sélectionne ton archive
3. Clique sur **"Distribute App"**
4. Choisis **"App Store Connect"**
5. Clique sur **"Next"**
6. Choisis **"Upload"**
7. Clique sur **"Next"**
8. Vérifie les options (généralement par défaut c'est bon)
9. Clique sur **"Upload"**
10. Attends la fin de l'upload (5-15 minutes)

### Alternative : Transporter

1. Télécharge **Transporter** depuis le Mac App Store
2. Ouvre Transporter
3. Glisse-dépose le fichier `.ipa` (généré par EAS ou Xcode)
4. Clique sur **"Deliver"**

---

## ✅ VÉRIFICATION DANS APP STORE CONNECT

Après l'upload (quelque soit la méthode) :

1. Va sur [App Store Connect](https://appstoreconnect.apple.com)
2. Sélectionne ton app **Nœma**
3. Va dans **"1.0 Prepare for Submission"**
4. Dans la section **"Build"**, tu devrais voir ton build apparaître après 5-15 minutes
5. Sélectionne le build dans le dropdown
6. Clique sur **"Save"**

---

## 🐛 DÉPANNAGE

### Erreur : "No builds found"

**Solution :** Vérifie que le build est terminé :
```bash
eas build:list --platform ios
```

### Erreur : "Invalid Bundle Identifier"

**Solution :** Vérifie que le Bundle ID dans `app.json` correspond à celui dans App Store Connect :
- `app.json` : `com.anthony.noema`
- App Store Connect : `com.anthony.noema`

### Erreur : "Missing Compliance"

**Solution :** Si Apple demande des informations de conformité :
- Va dans App Store Connect > App Privacy
- Vérifie que tout est configuré (déjà fait ✅)

### Erreur : "Invalid Provisioning Profile"

**Solution :** 
```bash
eas credentials
```
Puis sélectionne "iOS" et vérifie/regénère les credentials.

---

## 📊 CHECKLIST AVANT BUILD

- [x] ✅ App Privacy configuré
- [x] ✅ Version 1.0.0 dans `app.json`
- [x] ✅ Build Number 1.0.0 dans `app.json`
- [x] ✅ Bundle ID `com.anthony.noema` correct
- [ ] ⚠️ Vérifier que toutes les fonctionnalités marchent
- [ ] ⚠️ Tester sur un device réel si possible

---

## ⏱️ TEMPS ESTIMÉ

| Méthode | Temps Build | Temps Upload | Total |
|---------|-------------|--------------|-------|
| **EAS Build (cloud)** | 15-30 min | 5-15 min | **20-45 min** |
| **EAS Build (local)** | 10-20 min | 5-15 min | **15-35 min** |
| **Xcode Archive** | 5-10 min | 5-15 min | **10-25 min** |

---

## 🎯 COMMANDES RAPIDES (RÉSUMÉ)

### Méthode EAS (Recommandée)

```bash
# 1. Build
eas build --platform ios --profile production

# 2. Submit (une fois le build terminé)
eas submit --platform ios --latest
```

### Méthode Xcode

```bash
# 1. Générer les fichiers natifs
npx expo prebuild --platform ios

# 2. Ouvrir dans Xcode
open ios/*.xcworkspace

# 3. Dans Xcode : Product > Archive > Distribute App
```

---

## 📝 NOTES IMPORTANTES

1. **Premier build :** Le premier build peut prendre plus de temps (30-45 min)
2. **Build suivant :** Les builds suivants sont généralement plus rapides (15-20 min)
3. **Processing :** Après l'upload, Apple prend 5-15 minutes pour "processer" le build
4. **TestFlight :** Une fois le build uploadé, il sera aussi disponible dans TestFlight automatiquement

---

## 🆘 BESOIN D'AIDE ?

Si tu rencontres un problème :

1. Vérifie les logs : `eas build:list --platform ios`
2. Consulte la doc EAS : https://docs.expo.dev/build/introduction/
3. Vérifie ton compte Expo : https://expo.dev/accounts/[ton-compte]/projects/noema-mobile-app

---

**Bonne chance pour le build ! 🚀**

