# Admin Wild Child · guide

Adresse : **https://mauraneh.github.io/wildchild/admin/**

Depuis l’admin, tu gères :

- **Épisodes** : ajouter, modifier, dépublier (titre et description en FR, EN, ES, PT, date, durée, tags, lien Spotify pour « Écouter », lien YouTube pour « Voir »).
- **Merch** : produits, prix affichés, tailles, IDs Shopify, photos, ordre d’affichage, mise en vente ou non.
- **Réglages** : liens d’écoute et réseaux, e-mail, formulaires, domaine Shopify, seuil de livraison offerte.

Chaque « Enregistrer » crée un commit sur GitHub. Les tests vérifient le contenu, puis le site se met à jour tout seul en 1 à 2 minutes.

## Se connecter

L’admin utilise ton **compte GitHub** comme serrure. Personne sans accès en écriture au dépôt ne peut rien modifier, même en trouvant l’adresse `/admin`.

1. Active la **double authentification** sur GitHub (Settings → Password and authentication → passkey ou appli d’authentification). C’est la vraie protection.
2. Crée un jeton d’accès limité : GitHub → Settings → Developer settings → **Fine-grained personal access tokens** → Generate new token.
   - Repository access : **Only select repositories** → `mauraneh/wildchild`
   - Permissions → Repository permissions → **Contents : Read and write** (rien d’autre)
   - Expiration : **90 jours** (tu en recrées un quand il expire)
3. Sur `/admin`, clique **Sign In Using Access Token** et colle le jeton.

Jeton perdu ou ordinateur partagé ? Révoque-le sur la même page GitHub : l’accès est coupé immédiatement.

> **Pourquoi pas un simple mot de passe sur la page ?** Le site est statique : un mot de passe écrit dans le code de la page serait lisible par n’importe qui (clic droit, « voir le code source »). Ce serait une fausse sécurité. La vraie serrure doit être côté serveur, et ici c’est GitHub (mot de passe + double authentification + jeton limité à ce seul dépôt).

Option plus confortable plus tard : un bouton « Sign In with GitHub » (connexion avec ton mot de passe GitHub, sans jeton à copier). Il faut déployer le petit service gratuit [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) sur Cloudflare Workers, puis mettre son adresse dans `base_url` de `public/admin/config.yml`. Je peux le faire avec toi.

## Protections en place

| Risque | Protection |
|---|---|
| Quelqu’un trouve `/admin` | Inutile sans accès GitHub en écriture au dépôt. Page invisible pour Google (`noindex`). |
| Mot de passe volé | Double authentification GitHub + jeton limité à ce dépôt, révocable, qui expire. |
| Code de l’admin modifié par un tiers | Sveltia CMS est servi depuis notre site, version figée (`package-lock.json`), pas depuis un CDN. |
| Injection de code (XSS) | Politique de sécurité (CSP) stricte sur le site et l’admin : seuls nos propres scripts s’exécutent. Textes échappés, couleurs et liens validés. |
| Contenu piégé ou erroné | Tests automatiques avant chaque mise en ligne : lien non-https, couleur invalide, ID Shopify non numérique, domaine de paiement qui n’est pas `*.myshopify.com`, image externe… Le site n’est pas publié si un test échoue. |
| Admin chargée dans un site piège (clickjacking) | Script anti-iframe sur l’admin. |
| Modification des prix par un visiteur | Impossible : le paiement se fait chez **Shopify**, avec les prix de Shopify. Le prix affiché sur le site n’est qu’indicatif. |
| Vol de carte bancaire | Aucune donnée de paiement ne passe par notre site. Tout est chez Shopify (certifié PCI DSS). |
| Panier trafiqué | Le panier est revérifié (produit en vente, taille existante, quantité 1 à 20). |
| Failles dans les dépendances | Dependabot propose les mises à jour de sécurité, et `npm audit` tourne à chaque déploiement. |

Bonnes pratiques :

- Utilise l’admin sur **tes appareils**. Sur un ordi partagé, déconnecte-toi (menu en haut à droite → Sign Out).
- Ne publie pas d’autres sites sur `mauraneh.github.io` que tu ne contrôles pas : ils partageraient la même origine. Avec un nom de domaine à toi (ex. `wildchildpodcast.com`), ce point disparaît.
- Côté Shopify : double authentification sur le compte, et n’ajoute que des personnes de confiance en staff.

## Ajouter un épisode

Admin → **Épisodes** → Tous les épisodes → **Add Épisode** (il s’ajoute en haut) → remplis :

- Numéro, date, durée, tags
- **Lien Spotify** de l’épisode (bouton « Écouter »). Vide = lien de la chaîne.
- **Lien YouTube** de l’épisode (bouton « Voir »). Vide = lien de la chaîne.
- Titre et description dans les 4 langues

Puis **Save**. Décoche « Publié » pour préparer un épisode sans l’afficher.

## Gérer le merch

Le merch passe par trois outils, chacun avec son rôle :

| Outil | Rôle |
|---|---|
| **Printful** | Tu crées les designs et les produits. Printful imprime et expédie à chaque commande, avec ton étiquette. |
| **Shopify** | Paiement, prix réels, clients, commandes, TVA, remboursements. Printful y est connecté. |
| **Admin du site** | Ce que les gens voient sur le site : nom, description, photo, prix affiché, tailles, ordre, en vente ou non. |

Pour un nouveau produit :

1. Crée-le dans **Printful**, puis envoie-le vers **Shopify** (bouton « Add to store »).
2. Dans **Shopify** → Produits → le produit → chaque taille : l’adresse finit par `/variants/1234567890`. Ce nombre est l’**ID de variante**.
3. Dans l’**admin** → Merch → **Add Produit** : nom, description, prix (le même que dans Shopify), photo (mockup Printful), et pour chaque taille l’ID Shopify.
4. **Save**. Le produit apparaît dans la boutique 1 à 2 minutes plus tard.

Pour arrêter un produit : décoche **En vente sur le site** (et archive-le dans Shopify).
Pour changer un prix : change-le **dans Shopify** (c’est lui qui fait foi), puis dans l’admin pour l’affichage.

Tant que le domaine Shopify est vide dans Réglages, la boutique reste en **mode démo**.
