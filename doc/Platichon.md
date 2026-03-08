---
clavier: true
maths: true
title: Platichon
footer: Platichon by ChatMD
variablesDynamiques: true
rechercheContenu: true
avatarCercle: true
gestionGrosMots: true
avatarCircle: true
theme: sms
darkmode: false
useLLM:
   url: https://api.mistral.ai/v1/chat/completions
   model: ***********
   encryptedAPIkey: *************
   RAGinformations: **************
style: |
    :root{
    --main-bg: #1e2761;
    --body-bg:black;
    --h1-bg:linear-gradient(135deg, #8a307f, #79a7d3);
    --controls-bg:#6883bc;
    --color-text:black;
    --avatar-size: 50px;
    }
    p{color:white}
    h1{color:white}
    .bot-message{background:#408ec6}
    .bot-message::before{opacity:0}
    .bot-message::after{opacity:0}
    .user-message{background:#7a2048}
    .user-message::before{opacity:0}
    .user-message::after{opacity:0} 
---

# Platichon
Bonjour, je suis Blatichon, le cousin de Frigondule, un chatbot augmenté par l'IA. J'ai été configuré pour avoir recours à l'IA choisie par mon développeur mais uniquement pour certaines questions. Je pourrais parfaitement utiliser l'IA de façon permanente mais mon algorithme permet un contrôle total. 
Voici quelques exemples
1. [Exemples](Poursuite)

## Poursuite
Deux types de recours à l'IA sont possibles (je mets l'utilisation du RAG à part) :
1. [Recours ponctuels à l'IA](Poursuite ponctuelle)
3. [Recours prolongé à l'IA](Poursuite prolongée)
4. [RAG](RAG)
5. [Quitter](Sortir)

## Poursuite ponctuelle
Recours ponctuel à l'IA.
1. [Dictée générée par IA](Dictée niveau quatrième)
2. [Réponse évaluée par IA](Question sur les trois types de roche)
3. [Question libre à l'IA](Question libre)
4. [Analyse de satisfaction](Question réponse IA)
5. [Extraction ponctuelle d'info par l'IA](Question ville)
6. [Extraction d'une série d'informations](Question informations personnelles)
7. [Quitter](Sortir)

## Poursuite prolongée
Recours prolongée à l'IA
:::warning Attention
Sur un recours prolongé, il faut penser à proposer une solution de sortie à l'utilisateur pour arrêter la discussion avec l'IA
:::
1. [Boucle jusqu'à la bonne réponse](Exercice)
2. [sortie de conversation avec le nbre de massage](Exploration de l'espace)
3. [Sortie avec un mot clé](Question nature)
4. [Sortie sur demande](Question Einstein)
5. [Quitter](Sortir)




[//]: # (Recours ponctuels à l'IA)

## RAG
Pose ta question :

!Next: traitement question RAG

## traitement question RAG

`!useLLM`

Tu es un enseignant de collège en physique. tu utilises le rag dont l'url est dans l'entete

Un élève a posé la question suivante : `@INPUT`

!RAG: {`@INPUT`} {url:"https://codimd.apps.education.fr/s/8mVtbBh6a#" separator:"---"}

`END !useLLM`

1. [Suite ?](Poursuite)
2. [Quitter ?](Sortir)



## Dictée niveau quatrième
Voici une dictée générée automatiquement par l'IA  :

`!useLLM`

Rédige une dictée d'environ 80 à 100 mots, destinée à des élèves de quatrième.  
Le texte doit être rédigé au passé simple et à l'imparfait, contenir au moins trois adjectifs accordés en genre et en nombre, ainsi qu'une proposition subordonnée relative.  
Le vocabulaire doit rester accessible pour ce niveau, et le ton peut être narratif ou descriptif.


`END !useLLM`

📝 Conseil à l'élève : lis d'abord la dictée une première fois en entier, puis fais-la à l'écrit sans te précipiter. Pense à bien accorder les adjectifs et les verbes, surtout à l'imparfait !

1. [Suite ?](Poursuite)
2. [Quitter ?](Sortir)


## Question sur les trois types de roche
Quels sont les trois grands types de roche ?

!Next: Réponse - question sur les trois types de roche

## Réponse - question sur les trois types de roche

:::warning Attention
La réponse ci-dessous est générée par l'IA : gardez toujours l'esprit critique !
:::

`!useLLM`

J'ai posé à un élève la question suivante : quels sont les trois grands types de roche ?

Voici la réponse de l'élève : `@INPUT`

Dans la réponse de l'élève, il doit y avoir ces trois catégories : roches sédimentaires, roches magmatiques et roches métamorphiques.

Évalue la réponse de l'élève en lui donnant des conseils pour s'améliorer. Tu t'adresses à lui directement.

`END !useLLM`

1. [Suite ?](Poursuite)
2. [Quitter ?](Sortir)

## Question libre

Posez votre question :

!Next: Votre question

## Votre question
`!useLLM`

`@INPUT`

`END !useLLM`

1. [Suite ?](Poursuite)
2. [Quitter ?](Sortir)


<!------------------------------------------------------->
<!------------ Analyse de la réponse de l'IA------------->
<!------------------------------------------------------->
## Question réponse IA
Posez moi une question. L'important est la réponse que je vais vous fournir. Donnez moi votre niveau de satisfaction concernant ma réponse. Je vais l'analyser adapter le message affiché ou l'action effectuée.
!Next: Réponse IA

## Réponse IA
`!useLLM`

`@INPUT`

`END !useLLM`

Êtes-vous satisfait ?

!Next: Analyse satisfaction

## Question satisfaction

Êtes-vous satisfait ?

!Next: Analyse satisfaction

## Analyse satisfaction

<div class="analyse-satisfaction hidden">

`!useLLM`
!noStream

Analyse cette réponse : `@INPUT`
Si l'utilisateur semble satisfait de l'aide apportée, réponds simplement "<code>satisfait</code>".
Si l'utilisateur semble insatisfait, réponds simplement "<code>insatisfait</code>".

`END !useLLM`

</div>

1. [Suite ?](Poursuite)
2. [Quitter ?](Sortir)

`if @SELECTOR[".analyse-satisfaction"].includes("insatisfait")`
L'utilisateur est insatisfait.
`endif`
`if !@SELECTOR[".analyse-satisfaction"].includes("insatisfait")`
L'utilisateur est satisfait.
`endif`



<!------------------------------------------------------->
<!---------- Extraction d'information ponctuelle--------->
<!------------------------------------------------------->

## Question ville
:::info
L'IA est capable d'naalyser votre réponse et d'extraire une information spécifique pour la réutiliser ultérieurement.
:::
Ecrivez quelques phrases dans lesquelles apparait le nom de votre ville.

!Next: Extraction ville

## Extraction ville

<div class="extraction-ville hidden"> 

`!useLLM`
!noStream
Analyse cette réponse : `@INPUT`
Extrait le nom de la ville mentionnée par l'utilisateur
Réponds simplement par le nom de la ville, sans autre texte, dans ce format :
<code>Nom de la ville</code>
N'ajoute rien avant ou après.
`END !useLLM`
</div>

`@ville = calc(@SELECTOR[".extraction-ville"])`

La ville extraite est : `@ville`



<!------------------------------------------------------->
<!--------- Extraction de plusieurs informations--------->
<!------------------------------------------------------->

## Question informations personnelles
:::info
L'IA peut extraire une série d'informations mais pour les réutiliser facilement, on demande à l'IA de les stocker en format JSON.
:::
Ecrivez quelques phrases qui contiennent votre prénom, votre âge et votre ville de résidence ?
!Next: Extraction informations personnelles

## Extraction informations personnelles
<div class="extraction-infos hidden"> 

`!useLLM`
!noStream
Analyse cette réponse : `@INPUT`
Extrait les informations suivantes : prénom, âge, ville de résidence.

Renvoie uniquement un texte au format JSON, sur une seule ligne, sans texte supplémentaire et avec le format suivant : <code>JSON_RESULT</code>

Format JSON à respecter :
{
  "prenom": "Jean",
  "age": 25,
  "ville": "Lyon"
}
`END !useLLM`
</div>


`@json = calc(@SELECTOR[".extraction-infos"])`
`@infos = calc(JSON.parse(@json))`

`@prenom = calc(@infos.prenom)`
`@age = calc(@infos.age)`
`@ville = calc(@infos.ville)`

`if !@prenom || !@age || !@ville`
Il manque des informations. Peux-tu me redonner ton prénom, ton âge et ta ville de résidence ?
!Next: Extraction informations personnelles
`endif`

`if @prenom.length>0 && @age>0 && @ville.length>0`
Bonjour `@prenom`, tu as `@age` ans et tu habites à `@ville` !
`endif`







[//]: # (recours prolongé à l'IA)





<!------------------------------------------------------->
<!---------- Boucle jusqu'à la bonne réponse  ----------->
<!------------------------------------------------------->

## Exercice
Pouvez-vous expliquer la différence entre une comparaison et une métaphore ?

!Next: Exercice explication

## Exercice explication

`!useLLM`
J'ai demandé à un élève d'expliquer la différence entre une comparaison et une métaphore.

Voici sa réponse : `@INPUT`

CONSIGNES_EVALUATION

Ne donne pas la bonne réponse.
Donne des conseils pour améliorer sa définition.
Tu t'adresseras directement à lui
`END !useLLM`


!Next: Amélioration Exercice explication

## Amélioration Exercice explication

`!useLLM`
!useHistory
`@INPUT`

Attention, la discussion doit rester centrée sur la différence entre une comparaison et une métaphore.

`END !useLLM`

!Next: Amélioration Exercice explication

1. [retour menu](Poursuite)


<!------------------------------------------------------->
<!-- proposition de sortie avec le nombre de messages  -->
<!------------------------------------------------------->

## Exploration de l'espace 

Est-il encore pertienent d'explorer l'espace ? Pourquoi ?
!Next: traitement réponse espace


## traitement réponse espace

`@NUMBER_OF_MESSAGES=calc(@NUMBER_OF_MESSAGES>0?@NUMBER_OF_MESSAGES+1:1)`
`!useLLM`
!useHistory
`@INPUT`

Attention, la discussion doit rester centrée sur l'exploration de l'espace et sa pertinence.

`END !useLLM`

!Next: traitement réponse espace

<!-- Affichage à partir de 2 messages -->
`if @NUMBER_OF_MESSAGES >= 2`
1. [Bouton de sortie qui apparait à partir de 2 messages](Poursuite)
`endif`

<!-- Affichage tous les 3 messages  -->
`if @NUMBER_OF_MESSAGES % 3 == 0`
1. [Bouton de sortie qui apparait tous les 3 messages](Poursuite)
`endif`


<!------------------------------------------------------->
<!-- proposition de sortie avec le nombre de messages  -->
<!------------------------------------------------------->
## Question nature
Philosophie : faut-il prendre la nature comme modèle ?
:::info
La discussion avec l'IA s'arrêtera si le mot "stop" est contenu dans la réponse.
:::

!Next: Traitement réponse nature

## Traitement réponse nature

`!useLLM`
!useHistory
`@INPUT`
Attention, la discussion doit rester centrée sur la nature comme modèle en philosophie.
`END !useLLM`

!Next: Traitement réponse nature

`if @INPUT.includes("stop")`
D'accord, passons à un autre sujet !
1. [ok, on repart sur autre chose](Poursuite)
`endif`


<!------------------------------------------------------->
<!--------- proposition de sortie à la demande  --------->
<!------------------------------------------------------->
## Question Einstein
Bonjour Je suis Albert EINSTEIN, le père de la relativité. Je suis ravi de discuter avec toi. 
:::info
La discussion avec l'IA s'arrêtera si vous en émetez le souhait. Qu'importe les mots utilisés
:::
!Next: Suite discussion avec Einstein 

## Suite discussion avec Einstein 

`!useLLM`
!useHistory
`@INPUT`
Tu es Albert EINSTEIN et tu entretiens une conversation avec l'utilsateur.
La discussion doit rester centrée sur Einstein.
Si l'utilisateur veut sortir de la discussion, réponds-lui gentiment que ce n'est pas un problème.
`END !useLLM`


<div class="analyse-discussion-enstein hidden">

`!useLLM`
!useHistory
!noStream

Analyse cette conversation jusqu'à maintenant.
L'utilisateur a-t-il exprimé dans son dernier message qu'il veut sortir de cette discussion avec Epicure et passer à autre chose dans le chatbot ?
Si oui, écris simplement "<code>SORTIE DISCUSSION</code>" en majuscule et rien d'autre. Sinon écris OK.
`END !useLLM`

</div>

`if @SELECTOR[".analyse-discussion-enstein"].includes("SORTIE DISCUSSION")`
1. [ok, on repart sur autre chose](Poursuite)
`endif`

`if !@SELECTOR[".analyse-discussion-enstein"].includes("SORTIE DISCUSSION")`
!Next: Suite discussion avec Einstein 
`endif`






## Sortir
A vous de jouer en créant un Bot avec ChatMD. 