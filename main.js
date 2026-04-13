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
