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
    // Nouvelle URL pour des questions en français
const url = `https://opentdb.com/api.php?amount=10&category=${theme}&difficulty=${level}&type=multiple`;
    
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


function showQuestion() {
    if (currentIndex >= currentQuestions.length) return endGame();
    
    const q = currentQuestions[currentIndex];
    const allAnswers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);

    appContent.innerHTML = `
        <div class="quiz-card">
            <div id="timer-display">Temps : ${timeLeft}s</div>
            <h3>${q.question}</h3>
            <div class="answers-grid">
                ${allAnswers.map(ans => `<button class="ans-btn">${ans}</button>`).join('')}
            </div>
        </div>
    `;
    
    startTimer();
    
    document.querySelectorAll('.ans-btn').forEach(btn => {
        btn.addEventListener('click', () => checkAnswer(btn.innerText, q.correct_answer));
    });
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 15;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-display').innerText = `Temps : ${timeLeft}s`;
        if (timeLeft <= 0) {
            checkAnswer(null, currentQuestions[currentIndex].correct_answer);
        }
    }, 1000);
}

function checkAnswer(selected, correct) {
    clearInterval(timer);
    
    if (selected === correct) {
        score += 10;
        alert("Bonne réponse !"); // On pourra améliorer le feedback visuel en CSS plus tard
    } else {
        alert(`Dommage ! La réponse était : ${correct}`);
    }
    
    currentIndex++;
    document.getElementById('score-display').innerText = score;
    showQuestion();
}

function endGame() {
    appContent.innerHTML = `<h2>Jeu terminé !</h2><p>Votre score final est de ${score} points.</p>`;
    // Ici on pourra ajouter l'enregistrement dans l'historique
}