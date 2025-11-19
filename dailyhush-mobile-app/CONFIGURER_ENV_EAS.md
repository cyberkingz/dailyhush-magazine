# ⚡ Configuration Rapide : Variables d'Environnement EAS

## 🎯 Solution Rapide : Mettre à jour `eas.json`

J'ai mis à jour ton `eas.json` pour inclure les variables d'environnement. **Tu dois juste remplacer les valeurs** par celles de ton fichier `.env` local.

### Étape 1 : Ouvrir ton fichier `.env`

Ouvre ton fichier `.env` et copie les valeurs de :

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_REVENUECAT_IOS_KEY` (si tu l'as)
- `EXPO_PUBLIC_POSTHOG_API_KEY` (si tu l'as)

### Étape 2 : Mettre à jour `eas.json`

Remplace `"TON_VALEUR_ICI"` par les vraies valeurs dans `eas.json`.

### Étape 3 : Rebuild

```bash
eas build --platform ios --profile production
```

### Étape 4 : Resubmit

```bash
eas submit --platform ios --latest
```

---

## 🔒 Alternative : Secrets EAS (Plus sécurisé)

Si tu préfères ne pas mettre les secrets dans `eas.json`, utilise :

```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "ta_valeur" --type string
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "ta_valeur" --type string
# etc...
```

Voir `GUIDE_ENV_VARIABLES_EAS.md` pour plus de détails.
