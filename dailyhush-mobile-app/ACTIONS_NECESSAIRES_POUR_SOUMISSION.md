# 🎯 Actions Nécessaires pour Soumettre les Produits

## ⚠️ Problème Identifié

Quand on clique sur "Add for Review", Apple affiche ces erreurs :

1. **"You must choose a build."** - Aucun build n'est uploadé
2. **"You must enter a Privacy Policy URL in App Privacy."** - Privacy Policy URL manquante
3. **"Before you can submit this app for review, an Admin must provide information about the app's privacy practices in the App Privacy section."** - App Privacy incomplet

## 🔍 Pourquoi les Produits ont "Missing Metadata" dans RevenueCat

Les produits ont le statut "Missing Metadata" dans RevenueCat parce qu'ils ne sont **pas encore soumis pour review** dans App Store Connect. Une fois qu'ils seront soumis avec la version de l'app, ils passeront à "Ready to Submit" ou "Waiting for Review", et RevenueCat pourra les synchroniser correctement.

---

## 📋 Actions à Effectuer (dans l'ordre)

### 1. ✅ Uploader un Build

- **Action** : Uploader un build via EAS Build ou Xcode/Transporter
- **Commande** : `eas build --platform ios --profile production` puis `eas submit`
- **Statut** : Build number déjà incrémenté à `1.0.2` dans `app.json` ✅

### 2. ✅ Compléter App Privacy

- **Action** : Aller dans App Privacy et ajouter une Privacy Policy URL
- **URL** : Probablement `https://trynoema.com/privacy` ou similaire
- **Statut** : App Privacy partiellement configuré ⚠️

### 3. ⏳ Sélectionner les Produits dans la Version

- **Action** : Une fois le build uploadé, la section **"In-App Purchases and Subscriptions"** apparaîtra sur la page de version
- **Produits à sélectionner** :
  - Noema Premium Monthly (`com.anthony.noema.monthly`)
  - Noema Premium Annual (`com.anthony.noema.annual`)
  - Noema Premium Lifetime (`com.anthony.noema.lifetime`)
- **Statut** : En attente du build ⏳

### 4. ⏳ Soumettre la Version pour Review

- **Action** : Cliquer sur "Add for Review" une fois que :
  - Le build est uploadé ✅
  - App Privacy est complété ✅
  - Les produits sont sélectionnés ✅
- **Statut** : En attente ⏳

---

## 🎯 Résultat Attendu

Une fois que la version sera soumise pour review avec les produits sélectionnés :

1. ✅ Les produits passeront de "Missing Metadata" à "Waiting for Review" dans App Store Connect
2. ✅ RevenueCat synchronisera les produits et le statut passera à "Active" ou "Ready to Submit"
3. ✅ L'app pourra récupérer les offerings depuis RevenueCat sans erreur "Setup Required"
4. ✅ Les utilisateurs pourront acheter les abonnements dans l'app

---

## 📝 Note Importante

**La section "In-App Purchases and Subscriptions" n'apparaît sur la page de version qu'après qu'un build soit uploadé.** C'est pour ça qu'on ne peut pas sélectionner les produits maintenant.

Une fois le build uploadé, cette section apparaîtra automatiquement et on pourra sélectionner les 3 produits avant de soumettre pour review.
