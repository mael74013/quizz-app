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
dom.nextBtn.addEventListener('click', () => {
  state.current++;
  if (state.current < QUESTIONS.length) {
    dom.questionText.classList.add('fade-out');
    dom.optionsContainer.classList.add('fade-out');
    setTimeout(() => {
      dom.questionText.classList.replace('fade-out', 'fade-in');
      dom.optionsContainer.classList.replace('fade-out', 'fade-in');
      loadQuestion(state.current);
      setTimeout(() => {
        dom.questionText.classList.remove('fade-in');
        dom.optionsContainer.classList.remove('fade-in');
      }, 300);
    }, 200);
  } else {
    showResult();
  }
});

dom.restartBtn.addEventListener('click', () => {
  state = createState();
  updateLiveScore();
  dom.resultScreen.style.display = 'none';
  dom.quizScreen.style.display   = 'block';
  loadQuestion(0);
});

function timeOut() {
  state.answered = true;
  state.wrong++;
  showFeedback(false, "⏱ Temps écoulé !");
  highlightCorrect();
  disableOptions();
  updateLiveScore();
  dom.nextBtn.style.display = 'inline-block';
}

function updateLiveScore() {
  dom.liveCorrect.textContent = state.score;
  dom.liveWrong.textContent   = state.wrong;
  const answered = state.score + state.wrong;
  dom.livePct.textContent = answered > 0 ? ${Math.round((state.score / answered) * 100)}% : '0%';
}

function showResult() {
  clearInterval(state.timerInterval);
  const pct = calcScore(state);
  dom.progressFill.style.width = '100%';
  dom.quizScreen.style.display  = 'none';
  dom.resultScreen.style.display = 'flex';
  dom.resultScore.textContent = ${pct}%;
  dom.resultSub.textContent   = ${state.score} bonne${state.score > 1 ? 's' : ''} réponse${state.score > 1 ? 's' : ''} sur ${QUESTIONS.length};
  const grades = [[100,'','Parfait !'],[80,'','Excellent !'],[60,'','Bien joué !'],[40,'','Peut mieux faire'],[0,'','Entraîne-toi !']];
  const [,emoji, title] = grades.find(([min]) => pct >= min);
  dom.resultEmoji.textContent = emoji;
  dom.resultTitle.textContent = title;
  const min = Math.floor(state.totalTime / 60), sec = state.totalTime % 60;
  dom.resultBadges.innerHTML = `
    <span class="badge badge-ok">✓ ${state.score} correctes</span>
    <span class="badge badge-ko">✗ ${state.wrong} fausses</span>
    <span class="badge badge-time">⏱ ${min > 0 ? ${min}m ${sec}s : ${sec}s}</span>`;
}

function showFeedback(ok, msg) {
  dom.feedback.textContent = msg;
  dom.feedback.className = show ${ok ? 'ok' : 'ko'};
}
function hideFeedback() { dom.feedback.className = ''; dom.feedback.textContent = ''; }

const randomSuccess = () => [' Excellent !',' Bonne réponse !',' Parfait !',' Correct !'][Math.floor(Math.random()*4)];
const randomFail    = () => [' Raté !',' Pas tout à fait…',' Presque !',' Faux !'][Math.floor(Math.random()*4)];

function createRipple(btn, e) {
  const r = document.createElement('span');
  r.className = 'ripple';
  const d = Math.max(btn.clientWidth, btn.clientHeight);
  const rect = btn.getBoundingClientRect();
  r.style.cssText = width:${d}px;height:${d}px;left:${e.clientX-rect.left-d/2}px;top:${e.clientY-rect.top-d/2}px;
  btn.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}

dom.qTotal.textContent = QUESTIONS.length;
updateLiveScore();
loadQuestion(0);
