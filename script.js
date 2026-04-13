// Variables de jeu
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

// Éléments DOM
const form = document.getElementById('quiz-setup-form');
const appContent = document.getElementById('app-content');
const displaySection = document.getElementById('display-section');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const theme = document.getElementById('theme').value;
    const level = document.getElementById('level').value;
    
    // Simulation d'appel API (Open Trivia DB)
    // On peut adapter l'URL selon le thème choisi
    const url = `https://opentdb.com/api.php?amount=10&type=multiple`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        currentQuestions = data.results;
        startGame();
    } catch (error) {
        alert("Erreur lors du chargement des questions");
    }
});

function startGame() {
    form.style.display = 'none'; // Cache le formulaire
    displaySection.style.display = 'block'; // Affiche la zone de jeu
    showQuestion();
}