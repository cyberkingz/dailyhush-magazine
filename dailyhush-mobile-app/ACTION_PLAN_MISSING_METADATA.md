# 🎯 Plan d'Action : Résoudre "Missing Metadata"

## ✅ État Actuel

### Pricing Vérifié
- ✅ **Monthly**: $9.99 USD (Tier 10) - Configuré pour 175 pays/régions
- ⚠️ **Annual**: À vérifier ($59.99 USD attendu)
- ⚠️ **Lifetime**: À vérifier ($149.99 USD attendu)

### Problème Identifié
Tous les 3 produits ont le statut **"Missing Metadata"** dans App Store Connect, ce qui empêche RevenueCat de les récupérer correctement.

---

## 🔍 Cause du Problème

D'après la documentation Apple et les vérifications effectuées :

**Les subscriptions doivent être soumises avec une version de l'app, pas individuellement.**

Le message dans App Store Connect indique :
> "Your first subscription must be submitted with a new app version. Create your subscription, then select it from the app's In-App Purchases and Subscriptions section on the version page before submitting the version to App Review."

---

## 📋 Actions à Effectuer

### 1. Vérifier le Pricing des Produits Annual et Lifetime
- [ ] Aller sur la page du produit Annual
- [ ] Vérifier que le pricing est $59.99 USD (Tier 60)
- [ ] Aller sur la page du produit Lifetime
- [ ] Vérifier que le pricing est $149.99 USD (Tier 150)

### 2. Trouver la Section "In-App Purchases and Subscriptions"
**Note importante :** Cette section peut ne pas être visible tant qu'un build n'est pas uploadé. Cependant, elle devrait être accessible.

**Actions :**
- [ ] Sur la page de version (1.0 Prepare for Submission)
- [ ] Chercher une section "In-App Purchases and Subscriptions" ou "In-App Purchases"
- [ ] Si elle n'est pas visible, elle peut apparaître après l'upload d'un build

### 3. Sélectionner les Produits dans la Version
Une fois la section trouvée :
- [ ] Cliquer sur "In-App Purchases and Subscriptions" ou le bouton "Add"
- [ ] Sélectionner les 3 produits :
  - Noema Premium Monthly (`com.anthony.noema.monthly`)
  - Noema Premium Annual (`com.anthony.noema.annual`)
  - Noema Premium Lifetime (`com.anthony.noema.lifetime`)
- [ ] Sauvegarder

### 4. Soumettre la Version pour Review
- [ ] Vérifier que tous les éléments requis sont complétés :
  - ✅ Screenshots (5 uploadés)
  - ✅ App Review Information (rempli)
  - ✅ Build (à uploader si pas encore fait)
  - ⚠️ In-App Purchases and Subscriptions (à sélectionner)
- [ ] Cliquer sur "Add for Review"

---

## 🔗 Liens Utiles

### Page de Version
- Version 1.0: https://appstoreconnect.apple.com/apps/6755148761/distribution/ios/version/inflight

### Produits
- Monthly: https://appstoreconnect.apple.com/apps/6755148761/distribution/subscriptions/6755150752
- Annual: https://appstoreconnect.apple.com/apps/6755148761/distribution/subscriptions/6755150717
- Lifetime: https://appstoreconnect.apple.com/apps/6755148761/distribution/subscriptions/6755150952

### Subscription Group
- Group: https://appstoreconnect.apple.com/apps/6755148761/distribution/subscription-groups/21829692

---

## ⚠️ Notes Importantes

1. **Build requis :** Un build doit être uploadé avant de pouvoir soumettre la version. Cependant, la section "In-App Purchases and Subscriptions" peut être accessible avant.

2. **"Missing Metadata" :** Ce statut peut persister même si toutes les métadonnées sont remplies. Il devrait disparaître une fois que :
   - Les produits sont sélectionnés dans la version
   - La version est soumise pour review
   - Apple approuve les produits

3. **Synchronisation RevenueCat :** Une fois que les produits sont approuvés par Apple, RevenueCat se synchronisera automatiquement et le statut "Missing Metadata" disparaîtra.

---

## 🎯 Résultat Attendu

Une fois toutes les actions complétées :
- ✅ Les produits seront sélectionnés dans la version 1.0
- ✅ La version pourra être soumise pour review
- ✅ Après approbation Apple, le statut passera à "Ready to Submit" ou "Approved"
- ✅ RevenueCat se synchronisera et les produits seront disponibles dans l'offering
- ✅ L'app sur TestFlight pourra utiliser les subscriptions correctement

