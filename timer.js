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

