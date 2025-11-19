# Commandes pour Merger, Build et Submit

## 1. Merger la branche `gravity` vers `main`

```bash
# S'assurer d'être sur la branche gravity et que tout est commité
git checkout gravity
git status

# Si des changements non commités, les commiter d'abord
# git add .
# git commit -m "Your commit message"

# Passer sur main et merger
git checkout main
git pull origin main  # S'assurer que main est à jour
git merge gravity

# Si tout est OK, pousser vers main
git push origin main
```

## 2. Build EAS pour iOS (Production)

```bash
# Build pour iOS avec le profile production
eas build --platform ios --profile production
```

**Note:** 
- Le build utilisera automatiquement le `buildNumber` actuel (1.0.4) depuis `app.json`
- Toutes les variables d'environnement sont configurées dans `eas.json` (profile production)
- Le build sera uploadé sur EAS et disponible dans App Store Connect

## 3. Submit vers App Store Connect

```bash
# Soumettre le build vers App Store Connect
eas submit --platform ios --profile production
```

**Note:**
- La configuration de soumission est dans `eas.json` (appleId, ascAppId, appleTeamId)
- Si le build number a déjà été soumis, il faudra l'incrémenter dans `app.json` (ios.buildNumber)

## 4. Workflow complet (optionnel)

Si tu veux tout faire en une fois après le merge :

```bash
# 1. Merger vers main
git checkout main
git pull origin main
git merge gravity
git push origin main

# 2. Build
eas build --platform ios --profile production

# 3. Attendre que le build soit terminé, puis submit
eas submit --platform ios --profile production
```

## 5. Vérifier le buildNumber avant de build

Si tu as déjà soumis le build 1.0.4, il faudra incrémenter le `buildNumber` dans `app.json` :

```bash
# Éditer app.json et changer "buildNumber": "1.0.4" vers "1.0.5"
# Puis rebuild
eas build --platform ios --profile production
```

## Configuration actuelle

- **Branche actuelle:** `gravity`
- **Version:** 1.0.0
- **Build Number:** 1.0.4
- **Profile EAS:** production
- **Apple ID:** hello@trynoema.com
- **App Store Connect App ID:** 6755148761

