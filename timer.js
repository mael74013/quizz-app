import { TIMER_DURATION } from './data.js';

const ARC_LEN = 163;

export function startTimer(state, dom, onTimeout) {
  state.timeLeft = TIMER_DURATION;
  updateTimerUI(state, dom);
  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerUI(state, dom);
    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      if (!state.answered) onTimeout();
    }
  }, 1000);
}
export function updateTimerUI(state, dom) {
  const ratio = state.timeLeft / TIMER_DURATION;
  dom.timerArc.style.strokeDashoffset = ARC_LEN * (1 - ratio);
  dom.timerText.textContent = state.timeLeft;
  if (ratio > .5)       dom.timerArc.style.stroke = 'var(--accent)';
  else if (ratio > .25) dom.timerArc.style.stroke = '#f5a623';
  else                  dom.timerArc.style.stroke = 'var(--danger)';
}

export function calcScore(state) {
  const pct = Math.round((state.score / state.total) * 100);
  state.totalTime = Math.round((Date.now() - state.startTime) / 1000);
  return pct;
}
