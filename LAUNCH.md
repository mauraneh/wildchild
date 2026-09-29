# Checklist de lancement · Wild Child

Tout est prêt et **gratuit tant que le podcast n'est pas lancé**. Le site est en
**mode avant-lancement** : teaser à la place des épisodes, bouton « Préviens-moi »
partout, shop visible en aperçu (on peut remplir son panier, pas payer).

## Maintenant (gratuit)

- [ ] **Liste d'attente** : crée un compte gratuit [Brevo](https://www.brevo.com) (ou [Formspree](https://formspree.io)),
  crée un formulaire d'inscription, et colle son adresse dans **Admin → Réglages → Formulaire newsletter**.
  Tous les « Préviens-moi » du site remplissent cette liste. C'est ton public du jour 1.
- [ ] **Questions des auditeurs** : formulaire gratuit Formspree → **Admin → Réglages → Formulaire « Pose ta question »**.
  Tu auras des questions à débriefer dès le premier épisode.
- [ ] **Réseaux** : réserve `@wildchild…` sur Instagram et TikTok, mets les liens dans **Réglages → Réseaux sociaux**.
- [ ] **Hébergeur de podcast gratuit** : [Spotify for Creators](https://creators.spotify.com) (gratuit, diffuse aussi sur Apple, Deezer…).
  Tu peux préparer la page du show sans publier d'épisode.
- [ ] **Merch** : crée un compte gratuit [Printful](https://www.printful.com) et prépare tes designs (rien n'est payé tant que rien n'est vendu).
  Commande 1 ou 2 échantillons quand tu es sûre du design (le seul coût, optionnel).

## Le jour du lancement

1. **Épisodes automatiques** : sur Spotify for Creators → Paramètres → **Flux RSS**, copie l'adresse.
   Colle-la dans **Admin → Réglages → Podcast → Flux RSS**.
   Dans l'heure, les épisodes publiés apparaissent sur le site (titre, description, date, durée, lien « Écouter »).
   Les épisodes de démo disparaissent tout seuls. Ajoute ensuite, si tu veux, le lien YouTube (« Voir ») et les traductions dans l'admin.
2. **Boutique** (le seul poste payant) : ouvre une boutique **Shopify** (essai gratuit, puis formule Starter ≈ 5 €/mois
   ou Basic ≈ 30 €/mois ; vérifie les prix du moment), installe l'appli **Printful**, envoie tes produits vers Shopify.
3. **Merch automatique** : dans Shopify → Paramètres → Applications → Développer des applications → crée une appli,
   active **Storefront API** (lecture des produits), copie le **jeton d'accès Storefront** (32 caractères, public, lecture seule).
   Dans **Admin → Réglages → Boutique** : colle le domaine (`xxx.myshopify.com`) et ce jeton.
   Dans l'heure, tes vrais produits, prix, photos et tailles remplacent les produits de démo, et le bouton « Commander » envoie vers le paiement Shopify.
4. **Coche « Podcast lancé ? »** dans **Admin → Réglages**. Le teaser disparaît, les épisodes et les boutons Spotify / Apple s'affichent.
5. **Envoie un e-mail à ta liste d'attente** depuis Brevo : « C'est en ligne. »

## Coûts

| Quoi | Avant lancement | Après lancement |
|---|---|---|
| Site + hébergement (GitHub Pages) | 0 € | 0 € |
| Admin, synchronisation automatique | 0 € | 0 € |
| Hébergement podcast (Spotify for Creators) | 0 € | 0 € |
| Liste d'attente / formulaires (Brevo, Formspree, formules gratuites) | 0 € | 0 € tant que tu restes dans les limites gratuites |
| Printful | 0 € | payé seulement quand un produit est vendu |
| Shopify | 0 € | ≈ 5 à 30 €/mois selon la formule, + commission sur les ventes |
| Nom de domaine (optionnel, conseillé) | ≈ 10 à 15 €/an | idem |

## Comment marche l'automatique

Toutes les heures, GitHub vérifie ton flux RSS et ta boutique Shopify (gratuit).
S'il y a du nouveau : les tests vérifient le contenu (liens https, images Shopify, prix, IDs…), puis le site est republié.
S'il n'y a rien de nouveau, rien ne se passe. Si ton hébergeur ou Shopify ne répond pas, le site garde son contenu actuel.
Tes modifications dans l'admin (traductions, badges, lien YouTube, ordre, « en vente ») ne sont jamais écrasées.

Remarque : GitHub met en pause les tâches horaires d'un dépôt public sans activité pendant 60 jours.
La moindre modification dans l'admin les relance. Tu peux aussi les relancer dans l'onglet **Actions** du dépôt.
