import { QUESTIONS, TIMER_DURATION, LETTERS } from './data.js';
import { startTimer, calcScore } from './timer.js';

const $ = id => document.getElementById(id);

const dom = {
  quizScreen:       $('quiz-screen'),
  resultScreen:     $('result-screen'),
  questionText:     $('question-text'),
  optionsContainer: $('options-container'),
  progressFill:     $('progress-fill'),
  feedback:         $('feedback'),
  nextBtn:          $('next-btn'),
  restartBtn:       $('restart-btn'),
  qCurrent:         $('q-current'),
  qTotal:           $('q-total'),
  timerText:        $('timer-text'),
  timerArc:         $('timer-arc'),
  liveCorrect:      $('live-correct'),
  liveWrong:        $('live-wrong'),
  livePct:          $('live-pct'),
  resultEmoji:      $('result-emoji'),
  resultTitle:      $('result-title'),
  resultScore:      $('result-score'),
  resultSub:        $('result-sub'),
  resultBadges:     $('result-badges'),
};

let state = createState();

function createState() {
  return { current: 0, score: 0, wrong: 0, answered: false,
           timeLeft: TIMER_DURATION, timerInterval: null,
           totalTime: 0, startTime: Date.now(), total: QUESTIONS.length };
}

function loadQuestion(index) {
  const q = QUESTIONS[index];
  state.answered = false;
  dom.questionText.textContent = q.question;
  dom.qCurrent.textContent = index + 1;
  dom.qTotal.textContent   = QUESTIONS.length;
  dom.progressFill.style.width = ${(index / QUESTIONS.length) * 100}%;
  hideFeedback();
  dom.optionsContainer.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = <span class="option-letter">${LETTERS[i]}</span>${opt};
    btn.addEventListener('click', e => { createRipple(btn, e); handleAnswer(i, btn); });
    dom.optionsContainer.appendChild(btn);
  });
  dom.nextBtn.style.display = 'none';
  startTimer(state, dom, timeOut);
}

function handleAnswer(selectedIndex, btn) {
  if (state.answered) return;
  state.answered = true;
  clearInterval(state.timerInterval);
  const correct = QUESTIONS[state.current].answer;
  if (selectedIndex === correct) {
    btn.classList.add('correct');
    state.score++;
    showFeedback(true, randomSuccess());
  } else {
    btn.classList.add('wrong');
    state.wrong++;
    highlightCorrect();
    showFeedback(false, randomFail());
  }
  disableOptions();
  updateLiveScore();
  dom.nextBtn.style.display = 'inline-block';
}

function highlightCorrect() {
  const btns = dom.optionsContainer.querySelectorAll('.option-btn');
  btns[QUESTIONS[state.current].answer].classList.add('correct');
}

function disableOptions() {
  dom.optionsContainer.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
}
