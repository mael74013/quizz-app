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