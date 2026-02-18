---
clavier: true
maths: true
title: Frigondule
variablesDynamiques: true
addOns: kroki, lightbox
rechercheContenu: false
avatarCercle: true
gestionGrosMots: true
avatarCircle: true
theme: sms
darkmode: false
style: |
    :root{
    --main-bg: #2c4867;
    --body-bg:black;
    --h1-bg:linear-gradient(135deg, #2d9185, #1d5f58);
    --controls-bg:#0B3E42;
    --color-text:black;
    --avatar-size: 50px;
    }
    p{color:white}
    h1{color:white}
    .bot-message{background:#2d9185}
    .bot-message::before{opacity:0}
    .bot-message::after{opacity:0}
    .user-message{background:#1B55B5}
    .user-message::before{opacity:0}
    .user-message::after{opacity:0} 
---

# Frigondule
Bonjour je suis Frigondule un chatbot "Sans IA" c'est à dire que je **n'ai pas** recourt à une IA pour donner ou vérifier les réponses. Seul votre fichier Markdown est lu. Il doit tout contenir. 
Je peux cependant être paramétré pour utiliser l'IA. 

Quel est votre nom jeune Padawan? 

!Next: accueil
[Suite](#Question 2)
## accueil
`@nom = calc(@INPUT)`
Bienvenue `@nom` !
J'ai été conçu pour vous présenter rapidement les possibilités de ChatMD. La présentation est rapide et vous pourrez quitter à tout moment.

1. [Présentation générale](Présentation générale)

## Présentation générale
**Remarque liminaire**
Pour fonctionner, ChatMd a besoin d'un fichier au format Markdown en deux parties :
1. Une en-tête au format YAML qui permet de paraméter certaines fonctionalité du document.
2. Le corps du document qui contient le contenu à diffuser.
Voici le lien de comprendre la mise en page d'un tel document sur CodiMD : [Mise en page d'un fichier Markdown sur CodiMD](https://codimd.apps.education.fr/s/Iv4PzwF8S#2%EF%B8%8F%E2%83%A3-)
4. [Suite](Question 1)

## Question 1
Sur ChatMD, il est possible de proposer des questions QCM sans utilisation du clavier : 
***Voici la première question : Quelle est la couleur du cheval blanc d'Henry IV ?*** 
 
1. [Bai, c'est une couleur, il parait](option1)
3. [Blanc, parce que c'est comme ça ! ](option2)
5. [D, la réponse D](option3)
 
## option1
❌ C'est la couleur la plus courante pour les chevaux : corps brun (du clair au foncé), crins et extrémités noirs (crinière, queue, bas des membres).
![Robe baie](https://minio.apps.education.fr/codimd-prod/uploads/prsywwm9so8c286te7luea5lx.jpg =300x200)
Oui, on peut aussi insérer des images et les redimensionner.
[Une autre chance...](#Question 1)
[Quitter](#fin)

----

## option2
✅ Oui bon ben...hein... Bonne réponse
1. [Suite](#Question 2)
2. [Quitter](#fin)

----

## option3
❌ C'est mon dernier mot Jean-Pierre.
[Une autre chance...](#Question 1)
[Quitter](#fin)


----


## Question 2
Il est possible de faire des blocs repliables pour améliorer la lecture, la mise en page ou camoufler une réponse : 

<details>
<summary>Question 2</summary>

<p><strong>Qu'est-ce qui tue le plus chaque année ?</strong></p>

<ol>
  <li><a href="#option4">Les chutes de lit</a></li>
  <li><a href="#option5">Les chutes de météorites</a></li>
  <li><a href="#option6">Les chutes de noix de coco</a></li>
  <li><a href="#option7">Les attaques de requins</a></li>
</ol>

</details>

## option4
❌ J'aurais adoré mais non... Mauvaise réponse !
[Une autre chance...](#Question 2)
[Quitter](#fin)

----


## option5
❌ Non, mauvaise réponse mais mettez des casques, on ne sait jamais.
[Une autre chance...](#Question 2)
[Quitter](#fin)

----

## option6
✅ L'origine de la légende de la mort par noix de coco est un article de recherche de 1984 du Dr. Peter Barss, intitulé "Blessures dues aux noix de coco tombantes", publié dans le Journal of Trauma (maintenant connu sous le nom de Journal of Trauma and Acute Care Surgery). Dans son article, Barss a observé qu'en Papouasie-Nouvelle-Guinée (où il était basé), sur une période de quatre ans, 2,5 % des admissions pour traumatisme concernaient des personnes blessées par des noix de coco tombantes, avec au moins deux décès. Le chiffre a ensuite été mal cité comme étant de 150 dans le monde, en se basant sur l'hypothèse qu'ailleurs dans le monde, il y avait aussi un nombre similaire de décès dus aux noix de coco.
1. [Suite](#Question 3)
2. [Quitter](#fin)

----

## option7
❌ non mais dans le doute, mefiez-vous de ce qui a des dents !
[Une autre chance...](#Question 2)
[Quitter](#fin)

----


## Question 3

Le fichier markdown supporte aussi les formules mathématiques en $\LaTeX$

Il faut pensez à rajouter : *maths: true* dans l'entête YAML du fichier Markdown.

**Question 3** : Si le volume d'une sphère est donné par la formule $$V = \frac{4\pi r^3}{3}$$

Quelle est la grandeur à laquelle correspond la formule suivante: $$2\pi r$$ 

Entrez votre réponse au clavier. *(ça marche aussi dans ce cas si vous avez activé les réponses clavier dans le YAML avec clavier:true)* <br>
*Pour valider ou invalider les réponses de l'utilisateur, il ne faut pas oublier de rentrer des mots clés dans le fichier pour que l'algorithme puisse faire son travail.*


## Réponse Q3
- circonférence
- périmètre
- contour
- tour
- pourtour


Exact ! La formule $$p= 2 \pi r$$ correspond à la **circonférence (ou périmètre) d'un cercle** de rayon $r$.


1. [Continuer la présentation ?](#Vidéo)
2. [Quitter](#fin)

----

## Mauvaise réponse Q3 - aire
- aire
- surface
- disque

Non, ce n'est pas l'aire d'un disque. L'aire d'un disque est donnée par $$A = \pi r^2$$ 
1. [Retour à la question](Question 3)
2. [Quitter](#fin)

----

## Mauvaise réponse Q3 - diamètre
- diamètre
- 2r

Non, le diamètre est simplement $$2r$$. La formule $$2\pi r$$ correspond à la circonférence d'un cercle.
2. [Retour à la question](Question 3)
3. [Quitter](#fin)


----

## Vidéo
J'arrête avec mes questions. J'attire votre attention sur le fait qu'il est possible d'intégrer une vidéo grâce au code iFrame de la vidéo choisie :+1: 
<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/Qw5vKINE7WE?si=XShwJD4b7UwQTOXB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</center>

Dans ce cas, pas de suggestions Youtube qui peuvent distraire... Juste la vidéo que vous aurez choisie avec les réglages que vous souhaitez.

1. [Continuer la présentation ?](#Poursuite)
2. [Quitter](#fin)

## Poursuite
On continue ? Choisissez la proprièté de chatMD que vous souhaitez explorer : 
1. [Afficher un pdf](#pdf)
2. [Afficher des graphiques et schémas](#Kroki)
3. [Utiliser de la musique](#musique)
4. [Quitter](#fin)


## pdf
ChatMD permet d'intégrer un pdf grâce au plugin *lightbox* (Pensez à l'activer dans l'entête du fichier Markdown)

Ce fichier PDF s'affichera avec une lightbox (sorte de fenêtre):
[Avec lightbox](https://alain-michel.canoprof.fr/eleve/tutoriels/mode-lecture-firefox/mode-lecture-firefox.pdf){.lightbox}

Ce fichier PDF s'affichera sans lightbox (dans un nouvel onglet) :
[sans lightbox](https://alain-michel.canoprof.fr/eleve/tutoriels/mode-lecture-firefox/mode-lecture-firefox.pdf?nolightbox){.lightbox}


Ce fichier PDF s'affichera dans un lecteur intégré grâce à une iFrame :
<center>
<iframe src="https://alain-michel.canoprof.fr/eleve/tutoriels/mode-lecture-firefox/mode-lecture-firefox.pdf" width="90%" height="600px"></iframe>
</center>

1. [Continuer la présentation ?](#Poursuite)
2. [Quitter](#fin)




## musique
!Audio: https://ladigitale.dev/digitools/tableau-sons/applaudissements.mp3
[Continuer la présentation ?](#Poursuite)
[Quitter](#fin)

## Kroki

On teste ici la génération automatique de schémas avec différents outils, via le plugin Kroki (pensez à l'activer dans l'entête).

L'affichage des schémas peut être un peu long (et sur mobile, cela ne marche pas toujours). Cliquez pour zoomer.

1. [Tikz](Tikz)
2. [Mermaid](Mermaid)
3. [PlantUML](PlantUML)
4. [Graphviz](Graphviz)
5. [Excalidraw](Excalidraw)
6. [Vega](Vega)
7. [Vegalite](Vegalite)
8. [Continuer la présentation ?](#Poursuite)

## Tikz

C'est un macro package LATEX qui permet la création d'éléments graphiques dans le corps du texte. Donc, il nous permet de dessiner des schémas comme si on était en train d'écrire du texte LATEX.

Par exemple, des représentations simples comme des axes et des angles. (cliquez pour zoomer)

```tikz
\documentclass{article}
\usepackage{tikz}
\usepackage{tikz-3dplot}
\usetikzlibrary{math}
\usepackage[active,tightpage]{preview}
\PreviewEnvironment{tikzpicture}
\setlength\PreviewBorder{0.125pt}
%
% File name: directional-angles.tex
% Description: 
% The directional angles of a vector are geometrically represented.
% 
% Date of creation: July, 25th, 2021.
% Date of last modification: October, 9th, 2022.
% Author: Efra�n Soto Apolinar.
% https://www.aprendematematicas.org.mx/author/efrain-soto-apolinar/instructing-courses/
% Source: page 11 of the 
% Glosario Ilustrado de Matematicas Escolares.
% https://tinyurl.com/5udm2ufy
%
% Terms of use:
% According to TikZ.net
% https://creativecommons.org/licenses/by-nc-sa/4.0/
% Your commitment to the terms of use is greatly appreciated.
%
\begin{document}
  \tdplotsetmaincoords{80}{120}
  %
  \begin{tikzpicture}[tdplot_main_coords,scale=0.75] 
    % Indicate the components of the vector in rectangular coordinates
    \pgfmathsetmacro{\ux}{4}
    \pgfmathsetmacro{\uy}{4}
    \pgfmathsetmacro{\uz}{3}
    % Length of each axis
    \pgfmathsetmacro{\ejex}{\ux+0.5}
    \pgfmathsetmacro{\ejey}{\uy+0.5}
    \pgfmathsetmacro{\ejez}{\uz+0.5}
    \pgfmathsetmacro{\umag}{sqrt(\ux*\ux+\uy*\uy+\uz*\uz)} % Magnitude of vector $\vec{u}$
    % Compute the angle $\theta$
    \pgfmathsetmacro{\angthetax}{pi*atan(\uy/\ux)/180}
    \pgfmathsetmacro{\angthetay}{pi*atan(\ux/\uz)/180}
    \pgfmathsetmacro{\angthetaz}{pi*atan(\uz/\uy)/180}
    % Compute the angle $\phi$
    \pgfmathsetmacro{\angphix}{pi*acos(\ux/\umag)/180}
    \pgfmathsetmacro{\angphiy}{pi*acos(\uy/\umag)/180}
    \pgfmathsetmacro{\angphiz}{pi*acos(\uz/\umag)/180}
    % Compute rho sin(phi) to simplify computations
    \pgfmathsetmacro{\costz}{cos(\angthetax r)}
    \pgfmathsetmacro{\sintz}{sin(\angthetax r)}
    \pgfmathsetmacro{\costy}{cos(\angthetay r)}
    \pgfmathsetmacro{\sinty}{sin(\angthetay r)}
    \pgfmathsetmacro{\costx}{cos(\angthetaz r)}
    \pgfmathsetmacro{\sintx}{sin(\angthetaz r)}
    % Coordinate axis
    \draw[thick,->] (0,0,0) -- (\ejex,0,0) node[below left] {$x$};
    \draw[thick,->] (0,0,0) -- (0,\ejey,0) node[right] {$y$};
    \draw[thick,->] (0,0,0) -- (0,0,\ejez) node[above] {$z$};
    % Projections of the components in the axis
    \draw[gray,very thin,opacity=0.5] (0,0,0) -- (\ux,0,0) -- (\ux,\uy,0) -- (0,\uy,0) -- (0,0,0);	% face on the plane z = 0
    \draw[gray,very thin,opacity=0.5] (0,0,\uz) -- (\ux,0,\uz) -- (\ux,\uy,\uz) -- (0,\uy,\uz) -- (0,0,\uz);	% face on the plane z = \uz
    \draw[gray,very thin,opacity=0.5] (0,0,0) -- (0,0,\uz) -- (\ux,0,\uz) -- (\ux,0,0) -- (0,0,0);	% face on the plane y = 0
    \draw[gray,very thin,opacity=0.5] (0,\uy,0) -- (0,\uy,\uz) -- (\ux,\uy,\uz) -- (\ux,\uy,0) -- (0,\uy,0);	% face on the plane y = \uy
    \draw[gray,very thin,opacity=0.5] (0,0,0) -- (0,\uy,0) -- (0,\uy,\uz) -- (0,0,\uz) -- (0,0,0); % face on the plane x = 0
    \draw[gray,very thin,opacity=0.5] (\ux,0,0) -- (\ux,\uy,0) -- (\ux,\uy,\uz) -- (\ux,0,\uz) -- (\ux,0,0); % face on the plane x = \ux
    % Arc indicating the angle $\alpha$
    % (angle formed by the vector $\vec{v}$ and the $x$ axis)
    \draw[red,thick] plot[domain=0:\angphix,smooth,variable=\t] ({cos(\t r)},{sin(\t r)*\costx},{sin(\t r)*\sintx});
    % Arc indicating the angle $\beta$
    % (angle formed by the vector $\vec{v}$ and the $y$ axis)
    \draw[red,thick] plot[domain=0:\angphiy,smooth,variable=\t] ({sin(\t r)*\sinty},{cos(\t r)},{sin(\t r)*\costy});
    % Arc indicating the angle $\gamma$
    % (angle formed by the vector $\vec{v}$ and the $z$ axis)
    \draw[red,thick] plot[domain=0:\angphiz,smooth,variable=\t] ({sin(\t r)*\costz},{sin(\t r)*\sintz},{cos(\t r)});
    % Vector $\vec{u}$
    \draw[blue,thick,->] (0,0,0) -- (\ux,\uy,\uz) node [below right] {$\vec{u}$};
    % Nodes indicating the direction angles
    \pgfmathsetmacro{\xa}{1.85*cos(0.5*\angphix r)}
    \pgfmathsetmacro{\ya}{1.85*sin(0.5*\angphix r)*\costx}
    \pgfmathsetmacro{\za}{1.85*sin(0.5*\angphiz r)*\sintx}
    \node[red] at (\xa,\ya,\za) {\footnotesize$\alpha$};
    %
    \pgfmathsetmacro{\xb}{1.5*sin(0.5*\angphiy r)*\sinty}
    \pgfmathsetmacro{\yb}{1.5*cos(0.5*\angphiy r)}
    \pgfmathsetmacro{\zb}{1.5*sin(0.5*\angphiy r)*\costy}
    \node[red] at (\xb,\yb,\zb) {\footnotesize$\beta$};
    %
    \pgfmathsetmacro{\xc}{1.5*sin(0.5*\angphiz r)*\costz}
    \pgfmathsetmacro{\yc}{1.5*sin(0.5*\angphiz r)*\sintz}
    \pgfmathsetmacro{\zc}{1.5*cos(0.5*\angphiz r)}
    \node[red] at (\xc,\yc,\zc) {\footnotesize$\gamma$};
    %
  \end{tikzpicture}
  %
\end{document}
```

```tikz
% Drawing angles using the PG 3.0 angles and quotes libraries
% Author: Paul Gaborit
\documentclass[tikz,border=10pt]{standalone}
\usetikzlibrary{quotes,angles}
\begin{document}
\begin{tikzpicture}
  \draw
    (3,-1) coordinate (a) node[right] {a}
    -- (0,0) coordinate (b) node[left] {b}
    -- (2,2) coordinate (c) node[above right] {c}
    pic["$\alpha$", draw=orange, <->, angle eccentricity=1.2, angle radius=1cm] {angle=a--b--c};
\end{tikzpicture}
\end{document}
```
Ou des choses plus techniques comme les raies d'émission de l'atome d'hydrogène. (cliquez pour zoomer)
```tikz
\documentclass[tikz,border=10mm]{standalone}
\usepackage{tikz}
\begin{document}
\begin{tikzpicture}

%états d'énergies

\filldraw[red] (0,0)circle(0.08);
\draw[thick] (0,0)circle(1);
\node[left] at (180:1) {$n=1$};
\draw[thick] (220:2)node[left] {$n=2$}arc(220:480:2);
\draw[thick] (250:3)node[left] {$n=3$}arc(250:450:3);
\draw[thick] (270:4)node[below] {$n=4$}arc(270:430:4);
\draw[thick] (280:5)node[below] {$n=5$}arc(280:420:5);
\draw[thick] (290:6)node[below] {$n=6$} arc(290:410:6);

%série de Lyman

\draw[red, thick] (60:1)--(60:2) node[midway, above, rotate=60, scale=0.5] {$122$ nm};
\draw[red, thick] (55:1)--(55:2) (55:2)--(55:3) node[midway, above, rotate=55,scale=0.5] {$103$ nm};
\draw[red, thick] (50:1)--(50:3) (50:3)--(50:4) node[midway, above, rotate=50,scale=0.5] {$97$ nm};
\draw[red, thick] (45:1)--(45:4) (45:4)--(45:5) node[midway, above, rotate=45,scale=0.5] {$95$ nm};
\draw[red, thick] (40:1)--(40:5) (40:5)--(40:6) node[midway, above, rotate=45,scale=0.5] {$94$ nm};
\node[rotate=40, red, scale=0.75] at (40:7) {Lyman series};

%série de Balmer

\draw[blue, thick] (0:2)--(0:3) node[above, midway, scale=0.5] {656 nm};
\draw[blue, thick] (-5:2)--(-5:3) (-5:3)--(-5:4) node[above, midway, scale=0.5, rotate=-5] {486 nm};
\draw[blue, thick] (-10:2)--(-10:4) (-10:4)--(-10:5) node[above, midway, scale=0.5, rotate=-10] {434 nm};
\draw[blue, thick] (-15:2)--(-15:5) (-15:5)--(-15:6) node[above, midway, scale=0.5, rotate=-15] {410 nm};
\node[rotate=-15, blue, scale=0.75] at (-15:7) {Balmer series};

%série de Paschen

\draw[cyan, thick] (-30:3)--(-30:4) node[above, midway, scale=0.5, rotate=-30] {1875 nm};
\draw[cyan, thick] (-35:3)--(-35:4) (-35:4)--(-35:5) node[above, midway, scale=0.5, rotate=-35] {1282 nm};
\draw[cyan, thick] (-40:3)--(-40:5) (-40:5)--(-40:6) node[above, midway, scale=0.5, rotate=-40] {1094 nm};
\node[rotate=-40, cyan, scale=0.75] at (-40:7) {Paschen series};
\end{tikzpicture}
\end{document}
```

## Mermaid
Un diagramme Mermaid (souvent écrit Mermaid diagram) est un diagramme généré à partir de texte.

👉 Au lieu de dessiner avec une souris (comme sur Draw.io), on écrit une syntaxe simple, et l’outil génère automatiquement le schéma. Ce genre de schéma est très utilisé dans la représentation de processus, d'étapes... Comme tikZ pour Latex, c'est très puissant, facile à intégrer et dynamique.

```mermaid
%%{init{"theme":"base","themeCSS":"* {line-height:1.25em!important; font-size:20px; text-align:left!important;} g[id*=\"A\"] span {font-size:1.01em; color:black; display:block; text-align:center!important} g[id*=\"A\"] rect {fill:black}  g[id*=\"V\"] * {} g[id*=\"B\"] span {font-size:0.9em; color:black; display:block; text-align:center!important} g[id*=\"B\"] rect {fill:#6f0000; stroke:transparent} g[id*=\"C\"] rect {fill:white; stroke:black} g[id*=\"C\"] span {font-size:0.75em; display:block;} g[id*=\"D\"] span, g[id*=\"E\"] span {font-size:0.7em; display:block;} g[id*=\"D\"] rect, g[id*=\"E\"] rect {stroke:transparent!important}.edge-thickness-normal{stroke-width:1px; stroke:black;} .edge-thickness-thick{stroke-width:1px!important;} .edge-pattern-dotted{stroke:transparent}","themeVariables":{"secondaryColor":"white","primaryColor":"hsl(60,9%,97%)","primaryBorderColor":"black"},"flowchart":{"htmlLabels":true,"padding":20,"rankSpacing":50,"nodeSpacing":20}} }%%
flowchart LR
A1(["Titre <br> niveau 1"])

B1("Titre <br>niveau 2")
B2("Titre <br>niveau 2")
B3("Titre <br>niveau 2")

C1["Titre <br>niveau 3"]
C2["Titre <br>niveau 3"]
C3["Titre <br>niveau 3"]

D1("Titre <br>niveau 4")
D2("Titre <br>niveau 4")
D3("Titre <br>niveau 4")

A1 === B1 & B2 & B3

B1 --- C1
B2 --- C2
B3 --- C3

C1 --- D1
C2 --- D2
C3 --- D3
```

## PlantUML
PlantUML est un outil qui permet de créer des diagrammes UML à partir de texte, comme Mermaid… mais plus orienté modélisation logicielle avancée. C'est un standard en entreprise et très utilisé pour les documentation techniques par exemple, très complet mais un peu plus délicat à manipuler que des diagramme Marmaid ou tikZ en Latex.

```plantuml
skinparam ranksep 20
skinparam dpi 125
skinparam packageTitleAlignment left

rectangle "Main" {
  (main.view)
  (singleton)
}
rectangle "Base" {
  (base.component)
  (component)
  (model)
}
rectangle "<b>main.ts</b>" as main_ts

(component) ..> (base.component)
main_ts ==> (main.view)
(main.view) --> (component)
(main.view) ...> (singleton)
(singleton) ---> (model)
```

## Graphviz
Graphviz est un outil qui génère des graphes automatiquement à partir de texte, en utilisant un langage appelé DOT. On l'utilise quand de nombreux élements s'enchainent et découlent les uns des autres. Graphviz va calculer les alignements, les croisements de flèches, la hierrachie des éléments automatiquement. C'est sa grande force. Il est très utilisé pour les graphes techniques et en informatique.
```graphviz
digraph G {
// Template : diagram
// Usage : 
//rankdir=LR
splines=true
//splines=curved
bgcolor=transparent
pad=0.3
style=filled
edge[minlen=4]
node[style=filled, fontcolor=white]
ranksep=0.1
nodesep=0.2

// NIVEAU 1
node[fillcolor=grey2, fontsize=18]
a1[label="Titre"]

// NIVEAU 2
node[fillcolor=red4, fontsize=16]
a1->{
b1[label="Idée 1"]    
b2[label="Idée 2"]
}[headport=n]

node[fontcolor=black]
// NIVEAU 3 (sans intermédiaire)
node [shape=box, fillcolor=white, color=grey50]
// c1[label=""]
b1->c1
c1[label="Précision 1"]
b2->c2
c2[label="Précision 2"]
}
```

## Excalidraw
Pour Excalidraw, les choses sont un peu différentes. ChatMD va prendre le code de rendu graphique au format JSON qui décrit la position, taille, couleur... des élements et les construire à l'écran. Ce n'est pas du "code de structure". En réalité, [Excalidraw](https://excalidraw.com/) est un outil de dessin en ligne (type tableau blanc) qui permet de créer des schémas à la main, avec un style “croquis”. L'intérêt d'avoir le code est de permettre de mieux gérer l'illustration qu'avec une image.

```excalidraw
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [
    {
      "type": "rectangle",
      "version": 175,
      "versionNonce": 279344008,
      "isDeleted": false,
      "id": "2ZYh24ed28FJ0yE-S3YNY",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 580,
      "y": 140,
      "strokeColor": "#000000",
      "backgroundColor": "#15aabf",
      "width": 80,
      "height": 19.999999999999996,
      "seed": 521916552,
      "groupIds": [],
      "strokeSharpness": "sharp",
      "boundElementIds": [
        "Be1y2yzhV3Zd4nwCro__8"
      ]
    },
    {
      "type": "rectangle",
      "version": 180,
      "versionNonce": 164784376,
      "isDeleted": false,
      "id": "bO0OVt6m7LowYpq22ePCA",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 660,
      "y": 140,
      "strokeColor": "#000000",
      "backgroundColor": "#4c6ef5",
      "width": 120,
      "height": 19.999999999999996,
      "seed": 1303206904,
      "groupIds": [],
      "strokeSharpness": "sharp",
      "boundElementIds": [
        "KaCO9-QjUenSyCuuanoTo"
      ]
    },
    {
      "type": "rectangle",
      "version": 183,
      "versionNonce": 27181704,
      "isDeleted": false,
      "id": "jz0Huq9-s6pNxDw0RqHcR",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 780,
      "y": 140,
      "strokeColor": "#000000",
      "backgroundColor": "#fab005",
      "width": 180,
      "height": 19.999999999999996,
      "seed": 861962120,
      "groupIds": [],
      "strokeSharpness": "sharp",
      "boundElementIds": [
        "74ifmqmu0vN0NK0_0FwPm"
      ]
    },
    {
      "type": "rectangle",
      "version": 192,
      "versionNonce": 2123008504,
      "isDeleted": false,
      "id": "UnmNTmwJtm6moubcGtSgB",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 960,
      "y": 140,
      "strokeColor": "#000000",
      "backgroundColor": "#fa5252",
      "width": 80,
      "height": 19.999999999999996,
      "seed": 277814520,
      "groupIds": [],
      "strokeSharpness": "sharp",
      "boundElementIds": [
        "1v60NED2criGG-wo9-oQL"
      ]
    },
    {
      "type": "rectangle",
      "version": 202,
      "versionNonce": 1823814024,
      "isDeleted": false,
      "id": "of76J4WOJHnHi0L61Vst_",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 1040,
      "y": 140,
      "strokeColor": "#000000",
      "backgroundColor": "#be4bdb",
      "width": 180,
      "height": 19.999999999999996,
      "seed": 1496796808,
      "groupIds": [],
      "strokeSharpness": "sharp",
      "boundElementIds": [
        "jjuPzyRneMv3f65lps_6a"
      ]
    },
    {
      "type": "rectangle",
      "version": 193,
      "versionNonce": 1234602744,
      "isDeleted": false,
      "id": "SlvbjeV-9lXbcrlKib-hj",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 1220,
      "y": 140,
      "strokeColor": "#000000",
      "backgroundColor": "#868e96",
      "width": 60,
      "height": 19.999999999999996,
      "seed": 1938865656,
      "groupIds": [],
      "strokeSharpness": "sharp",
      "boundElementIds": [
        "5QQzhw_uqk_rBaW2wMriT"
      ]
    },
    {
      "type": "text",
      "version": 81,
      "versionNonce": 1188901129,
      "isDeleted": false,
      "id": "vrdt3JfbD2Xwz4K4TWScI",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 840,
      "y": -60,
      "strokeColor": "#000000",
      "backgroundColor": "#868e96",
      "width": 190,
      "height": 45,
      "seed": 1499217288,
      "groupIds": [],
      "strokeSharpness": "sharp",
      "boundElementIds": [],
      "fontSize": 36,
      "fontFamily": 1,
      "text": "JavaScript",
      "baseline": 32,
      "textAlign": "left",
      "verticalAlign": "top"
    },
    {
      "type": "arrow",
      "version": 343,
      "versionNonce": 1369065096,
      "isDeleted": false,
      "id": "Be1y2yzhV3Zd4nwCro__8",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 597.5075333823274,
      "y": 299,
      "strokeColor": "#000000",
      "backgroundColor": "#868e96",
      "width": 40,
      "height": 139,
      "seed": 666255096,
      "groupIds": [],
      "strokeSharpness": "round",
      "boundElementIds": [],
      "startBinding": {
        "focus": -0.41953339688473495,
        "gap": 1,
        "elementId": "UxgtvUBaIPnDWJZ9kUQH8"
      },
      "endBinding": {
        "focus": -0.11111111111111113,
        "gap": 1,
        "elementId": "2ZYh24ed28FJ0yE-S3YNY"
      },
      "points": [
        [
          0,
          0
        ],
        [
          -17.507533382327438,
          -59
        ],
        [
          22.492466617672562,
          -139
        ]
      ],
      "lastCommittedPoint": null,
      "startArrowhead": null,
      "endArrowhead": "arrow"
    },
    {
      "type": "text",
      "version": 81,
      "versionNonce": 690339976,
      "isDeleted": false,
      "id": "UxgtvUBaIPnDWJZ9kUQH8",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 580,
      "y": 300,
      "strokeColor": "#000000",
      "backgroundColor": "#868e96",
      "width": 94,
      "height": 45,
      "seed": 84626568,
      "groupIds": [],
      "strokeSharpness": "sharp",
      "boundElementIds": [
        "Be1y2yzhV3Zd4nwCro__8"
      ],
      "fontSize": 36,
      "fontFamily": 1,
      "text": "Fetch",
      "baseline": 32,
      "textAlign": "left",
      "verticalAlign": "top"
    },
    {
      "type": "rectangle",
      "version": 60,
      "versionNonce": 897215480,
      "isDeleted": false,
      "id": "-Lq0agjWQ31TR_Av5Z4HW",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 520,
      "y": -60,
      "strokeColor": "#000000",
      "backgroundColor": "transparent",
      "width": 820,
      "height": 540,
      "seed": 495165432,
      "groupIds": [],
      "strokeSharpness": "sharp",
      "boundElementIds": [
        "jjuPzyRneMv3f65lps_6a"
      ]
    },
    {
      "type": "arrow",
      "version": 537,
      "versionNonce": 1626949112,
      "isDeleted": false,
      "id": "KaCO9-QjUenSyCuuanoTo",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 721.0588599991052,
      "y": 60.17790458606555,
      "strokeColor": "#000000",
      "backgroundColor": "#868e96",
      "width": 1.0588599991051524,
      "height": 79.82209541393445,
      "seed": 637565832,
      "groupIds": [],
      "strokeSharpness": "round",
      "boundElementIds": [],
      "startBinding": null,
      "endBinding": {
        "focus": 0,
        "gap": 1,
        "elementId": "bO0OVt6m7LowYpq22ePCA"
      },
      "points": [
        [
          0,
          0
        ],
        [
          -1.0588599991051524,
          39.82209541393445
        ],
        [
          -1.0588599991051524,
          79.82209541393445
        ]
      ],
      "lastCommittedPoint": null,
      "startArrowhead": null,
      "endArrowhead": "arrow"
    },
    {
      "type": "text",
      "version": 112,
      "versionNonce": 358083143,
      "isDeleted": false,
      "id": "4hEOdlcwK6AHyVhjc-MXS",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 660,
      "y": 20,
      "strokeColor": "#000000",
      "backgroundColor": "#868e96",
      "width": 103,
      "height": 45,
      "seed": 352116984,
      "groupIds": [],
      "strokeSharpness": "sharp",
      "boundElementIds": [],
      "fontSize": 36,
      "fontFamily": 1,
      "text": "Parse",
      "baseline": 32,
      "textAlign": "left",
      "verticalAlign": "top"
    },
    {
      "type": "arrow",
      "version": 534,
      "versionNonce": 983577992,
      "isDeleted": false,
      "id": "74ifmqmu0vN0NK0_0FwPm",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 841.6574209245741,
      "y": 219,
      "strokeColor": "#000000",
      "backgroundColor": "#868e96",
      "width": 43.15128973100309,
      "height": 59.174989629909305,
      "seed": 1853344392,
      "groupIds": [],
      "strokeSharpness": "round",
      "boundElementIds": [],
      "startBinding": {
        "focus": 0.09211398277003865,
        "gap": 1,
        "elementId": "K4so-arfr0JX0NJx8vd7T"
      },
      "endBinding": {
        "focus": -0.2163077865936296,
        "gap": 1,
        "elementId": "jz0Huq9-s6pNxDw0RqHcR"
      },
      "points": [
        [
          0,
          0
        ],
        [
          -1.6574209245741258,
          1
        ],
        [
          41.493868806428964,
          -58.174989629909305
        ]
      ],
      "lastCommittedPoint": null,
      "startArrowhead": null,
      "endArrowhead": "arrow"
    },
    {
      "type": "text",
      "version": 118,
      "versionNonce": 1185705864,
      "isDeleted": false,
      "id": "K4so-arfr0JX0NJx8vd7T",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 640,
      "y": 220,
      "strokeColor": "#000000",
      "backgroundColor": "#868e96",
      "width": 366,
      "height": 45,
      "seed": 765854200,
      "groupIds": [],
      "strokeSharpness": "sharp",
      "boundElementIds": [
        "74ifmqmu0vN0NK0_0FwPm"
      ],
      "fontSize": 36,
      "fontFamily": 1,
      "text": "Compile and Optimize",
      "baseline": 32,
      "textAlign": "left",
      "verticalAlign": "top"
    },
    {
      "type": "arrow",
      "version": 791,
      "versionNonce": 1724761848,
      "isDeleted": false,
      "id": "1v60NED2criGG-wo9-oQL",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 960,
      "y": 320,
      "strokeColor": "#000000",
      "backgroundColor": "#868e96",
      "width": 80,
      "height": 160,
      "seed": 1764571528,
      "groupIds": [],
      "strokeSharpness": "round",
      "boundElementIds": [],
      "startBinding": {
        "focus": -0.1637630662020906,
        "gap": 1,
        "elementId": "dviXudWNxiHYQMZfqHWsH"
      },
      "endBinding": {
        "focus": 0.07692307692307691,
        "gap": 1,
        "elementId": "UnmNTmwJtm6moubcGtSgB"
      },
      "points": [
        [
          0,
          0
        ],
        [
          80,
          -40
        ],
        [
          40,
          -160
        ]
      ],
      "lastCommittedPoint": null,
      "startArrowhead": null,
      "endArrowhead": "arrow"
    },
    {
      "type": "text",
      "version": 194,
      "versionNonce": 473574648,
      "isDeleted": false,
      "id": "dviXudWNxiHYQMZfqHWsH",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 720,
      "y": 320,
      "strokeColor": "#000000",
      "backgroundColor": "#868e96",
      "width": 484,
      "height": 45,
      "seed": 1988297464,
      "groupIds": [],
      "strokeSharpness": "sharp",
      "boundElementIds": [
        "1v60NED2criGG-wo9-oQL"
      ],
      "fontSize": 36,
      "fontFamily": 1,
      "text": "Re-optimize and Deoptimize",
      "baseline": 32,
      "textAlign": "left",
      "verticalAlign": "top"
    },
    {
      "type": "arrow",
      "version": 708,
      "versionNonce": 185615496,
      "isDeleted": false,
      "id": "jjuPzyRneMv3f65lps_6a",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 1140,
      "y": 80,
      "strokeColor": "#000000",
      "backgroundColor": "#868e96",
      "width": 20,
      "height": 60,
      "seed": 1767688328,
      "groupIds": [],
      "strokeSharpness": "round",
      "boundElementIds": [],
      "startBinding": {
        "focus": -0.3021784319542362,
        "gap": 14.800415739789742,
        "elementId": "qhkjvI1VmWZdnKvU5QKZK"
      },
      "endBinding": {
        "focus": 0.15789473684210528,
        "gap": 1,
        "elementId": "of76J4WOJHnHi0L61Vst_"
      },
      "points": [
        [
          0,
          0
        ],
        [
          -20,
          20
        ],
        [
          0,
          60
        ]
      ],
      "lastCommittedPoint": null,
      "startArrowhead": null,
      "endArrowhead": "arrow"
    },
    {
      "type": "text",
      "version": 213,
      "versionNonce": 2105884296,
      "isDeleted": false,
      "id": "qhkjvI1VmWZdnKvU5QKZK",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 1080,
      "y": 20.19958426021026,
      "strokeColor": "#000000",
      "backgroundColor": "#868e96",
      "width": 139,
      "height": 45,
      "seed": 2115494904,
      "groupIds": [],
      "strokeSharpness": "sharp",
      "boundElementIds": [
        "jjuPzyRneMv3f65lps_6a"
      ],
      "fontSize": 36,
      "fontFamily": 1,
      "text": "Execute",
      "baseline": 32,
      "textAlign": "left",
      "verticalAlign": "top"
    },
    {
      "type": "arrow",
      "version": 707,
      "versionNonce": 543827960,
      "isDeleted": false,
      "id": "5QQzhw_uqk_rBaW2wMriT",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 1220,
      "y": 240,
      "strokeColor": "#000000",
      "backgroundColor": "#868e96",
      "width": 20,
      "height": 80,
      "seed": 2059564936,
      "groupIds": [],
      "strokeSharpness": "round",
      "boundElementIds": [],
      "startBinding": {
        "focus": 0.7391304347826086,
        "gap": 2,
        "elementId": "C6fyzTg2FHAmrRYfC_THm"
      },
      "endBinding": {
        "focus": 0.3333333333333333,
        "gap": 1,
        "elementId": "SlvbjeV-9lXbcrlKib-hj"
      },
      "points": [
        [
          0,
          0
        ],
        [
          20,
          -40
        ],
        [
          20,
          -80
        ]
      ],
      "lastCommittedPoint": null,
      "startArrowhead": null,
      "endArrowhead": "arrow"
    },
    {
      "type": "text",
      "version": 227,
      "versionNonce": 2002374136,
      "isDeleted": false,
      "id": "C6fyzTg2FHAmrRYfC_THm",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 1160,
      "y": 220,
      "strokeColor": "#000000",
      "backgroundColor": "#868e96",
      "width": 58,
      "height": 45,
      "seed": 1651025144,
      "groupIds": [],
      "strokeSharpness": "sharp",
      "boundElementIds": [
        "5QQzhw_uqk_rBaW2wMriT"
      ],
      "fontSize": 36,
      "fontFamily": 1,
      "text": "GC",
      "baseline": 32,
      "textAlign": "left",
      "verticalAlign": "top"
    }
  ],
  "appState": {
    "viewBackgroundColor": "#ffffff",
    "gridSize": 20
  }
}
```

## Vega
Vega est une grammaire de visualisation basée sur du JSON déclaratif pour créer des graphiques complexes et interactifs.

👉 Contrairement à Mermaid (diagrammes logiques) ou Excalidraw (dessin libre),
Vega sert à créer des graphiques de visualisations de données.

```vega
{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": 400,
  "height": 200,
  "padding": 5,

  "data": [
    {
      "name": "table",
      "values": [
        {"category": "A", "amount": 28},
        {"category": "B", "amount": 55},
        {"category": "C", "amount": 43},
        {"category": "D", "amount": 91},
        {"category": "E", "amount": 81},
        {"category": "F", "amount": 53},
        {"category": "G", "amount": 19},
        {"category": "H", "amount": 87}
      ]
    }
  ],

  "signals": [
    {
      "name": "tooltip",
      "value": {},
      "on": [
        {"events": "rect:mouseover", "update": "datum"},
        {"events": "rect:mouseout",  "update": "{}"}
      ]
    }
  ],

  "scales": [
    {
      "name": "xscale",
      "type": "band",
      "domain": {"data": "table", "field": "category"},
      "range": "width",
      "padding": 0.05,
      "round": true
    },
    {
      "name": "yscale",
      "domain": {"data": "table", "field": "amount"},
      "nice": true,
      "range": "height"
    }
  ],

  "axes": [
    { "orient": "bottom", "scale": "xscale" },
    { "orient": "left", "scale": "yscale" }
  ],

  "marks": [
    {
      "type": "rect",
      "from": {"data":"table"},
      "encode": {
        "enter": {
          "x": {"scale": "xscale", "field": "category"},
          "width": {"scale": "xscale", "band": 1},
          "y": {"scale": "yscale", "field": "amount"},
          "y2": {"scale": "yscale", "value": 0}
        },
        "update": {
          "fill": {"value": "steelblue"}
        },
        "hover": {
          "fill": {"value": "red"}
        }
      }
    },
    {
      "type": "text",
      "encode": {
        "enter": {
          "align": {"value": "center"},
          "baseline": {"value": "bottom"},
          "fill": {"value": "#333"}
        },
        "update": {
          "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
          "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
          "text": {"signal": "tooltip.amount"},
          "fillOpacity": [
            {"test": "datum === tooltip", "value": 0},
            {"value": 1}
          ]
        }
      }
    }
  ]
}
```

## Vegalite
SOuvent utilisé en lieu et place de Vega, Vagalite est plus simple, plus léger, moins verbeux et plus rapide à écrire. 

```vegalite
{
	"$schema": "https://vega.github.io/schema/vega-lite/v4.json",
	"description": "Horizontally concatenated charts that show different types of discretizing scales.",
	"data": {
		"values": [{ "a": "A", "b": 28 },{ "a": "B", "b": 55 },{ "a": "C", "b": 43 },{ "a": "D", "b": 91 },{ "a": "E", "b": 81 },{ "a": "F", "b": 53 },{ "a": "G", "b": 19 },{ "a": "H", "b": 87 },{ "a": "I", "b": 52 }]
	},
	"hconcat": [
		{
			"mark": "circle",
			"encoding": {
				"y": {
					"field": "b",
					"type": "nominal",
					"sort": null,
					"axis": {
						"ticks": false,
						"domain": false,
						"title": null
					}
				},
				"size": {
					"field": "b",
					"type": "quantitative",
					"scale": {
						"type": "quantize"
					}
				},
				"color": {
					"field": "b",
					"type": "quantitative",
					"scale": {
						"type": "quantize",
						"zero": true
					},
					"legend": {
						"title": "Quantize"
					}
				}
			}
		},
		{
			"mark": "circle",
			"encoding": {
				"y": {
					"field": "b",
					"type": "nominal",
					"sort": null,
					"axis": {
						"ticks": false,
						"domain": false,
						"title": null
					}
				},
				"size": {
					"field": "b",
					"type": "quantitative",
					"scale": {
						"type": "quantile",
						"range": [80, 160, 240, 320, 400]
					}
				},
				"color": {
					"field": "b",
					"type": "quantitative",
					"scale": {
						"type": "quantile",
						"scheme": "magma"
					},
					"legend": {
						"format": "d",
						"title": "Quantile"
					}
				}
			}
		},
		{
			"mark": "circle",
			"encoding": {
				"y": {
					"field": "b",
					"type": "nominal",
					"sort": null,
					"axis": {
						"ticks": false,
						"domain": false,
						"title": null
					}
				},
				"size": {
					"field": "b",
					"type": "quantitative",
					"scale": {
						"type": "threshold",
						"domain": [30, 70],
						"range": [80, 200, 320]
					}
				},
				"color": {
					"field": "b",
					"type": "quantitative",
					"scale": {
						"type": "threshold",
						"domain": [30, 70],
						"scheme": "viridis"
					},
					"legend": {
						"title": "Threshold"
					}
				}
			}
		}
	],
	"resolve": {
		"scale": {
			"color": "independent",
			"size": "independent"
		}
	}
}


```






## fin
Vous avez joué avec Frigondule ! A vous de créer votre propre chatbot avec chatMD.
Pour rappel, mon auteur vous propose quelques liens pour vous aider :+1: 

[Documentation de chatMD](https://chatmd.forge.apps.education.fr/docs/)
[Le mode d'emploi de CodiMD](https://codimd.apps.education.fr/s/H6nqsVq2y#)
[Faire le fichier Markdown sur CodiMD](https://codimd.apps.education.fr/)

[Le fichier Markdown de ce bot]()

    
    
    
    