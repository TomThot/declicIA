// Fonction Sigmoïde
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

// Récupération des éléments HTML
const w1Slider = document.getElementById('w1');
const w2Slider = document.getElementById('w2');
const biasSlider = document.getElementById('bias');

const w1ValueSpan = document.getElementById('w1-value');
const w2ValueSpan = document.getElementById('w2-value');
const biasValueSpan = document.getElementById('bias-value');

const x1Checkbox = document.getElementById('x1');
const x2Checkbox = document.getElementById('x2');

const probabilityValueSpan = document.getElementById('probability-value');
const progressBar = document.getElementById('progressBar');
const decisionText = document.getElementById('decision');

const equationZ = document.getElementById('equation-z');
const equationSigmoid = document.getElementById('equation-sigmoid');


// Fonction de calcul et d'affichage
function updateNeurone() {
    // 1. Récupérer les valeurs des curseurs et checkboxes
    const w1 = parseFloat(w1Slider.value);
    const w2 = parseFloat(w2Slider.value);
    const bias = parseFloat(biasSlider.value);

    const x1 = x1Checkbox.checked ? 1 : 0;
    const x2 = x2Checkbox.checked ? 1 : 0;

    // Mettre à jour les spans à côté des curseurs
    w1ValueSpan.textContent = w1.toFixed(1);
    w2ValueSpan.textContent = w2.toFixed(1);
    biasValueSpan.textContent = bias.toFixed(1);

    // 2. Calcul du Neurone (Somme pondérée)
    const z = (x1 * w1) + (x2 * w2) + bias;

    // 3. Application de la fonction Sigmoïde
    const probability = sigmoid(z);

    // 4. Affichage des résultats
    probabilityValueSpan.textContent = `${(probability * 100).toFixed(2)}%`;
    progressBar.style.width = `${probability * 100}%`;

    // Changer la couleur de la barre de progression selon le résultat
    if (probability > 0.5) {
        progressBar.style.backgroundColor = '#28a745'; // Vert
        decisionText.textContent = '✅ Résultat : On sort se promener !';
        decisionText.className = 'message success';
    } else {
        progressBar.style.backgroundColor = '#dc3545'; // Rouge
        decisionText.textContent = '❌ Résultat : On reste à la maison...';
        decisionText.className = 'message error';
    }

    // Affichage des équations
    equationZ.innerHTML = `z = (${x1} &times; ${w1}) + (${x2} &times; ${w2}) + (${bias.toFixed(1)}) = ${z.toFixed(2)}`;
    equationSigmoid.innerHTML = `&sigma;(z) = 1 / (1 + e<sup>-${z.toFixed(2)}</sup>) = ${probability.toFixed(4)}`;
}

// Écouteurs d'événements pour mettre à jour le neurone en temps réel
w1Slider.addEventListener('input', updateNeurone);
w2Slider.addEventListener('input', updateNeurone);
biasSlider.addEventListener('input', updateNeurone);
x1Checkbox.addEventListener('change', updateNeurone);
x2Checkbox.addEventListener('change', updateNeurone);

// Initialiser le neurone au chargement de la page
updateNeurone();