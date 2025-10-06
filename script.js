let score = 0;
let totalQuestions = 0;
let answeredQuestions = new Set();
let currentQuestionIndex = 0;
let quizElementsArray = [];
let allQuizAnswers = [];
const PAGE_ID = window.location.pathname.split('/').pop().replace('.html', '');

// Firebase-only save/load functions
async function saveProgress() {
  const progress = {
    score: score,
    answeredQuestions: Array.from(answeredQuestions),
    currentQuestionIndex: currentQuestionIndex,
    timestamp: Date.now(),
    pageId: PAGE_ID
  };

  // Save to Firebase if user is authenticated
  if (window.currentUser && window.saveQuizData) {
    await window.saveQuizData(`fillblanks_${PAGE_ID}`, progress);
    console.log('Progress saved to Firebase');
  } else {
    console.log('No user authenticated - progress not saved');
  }
}

async function loadProgress() {
  if (!window.currentUser || !window.loadQuizData) {
    console.log('No user authenticated - cannot load progress');
    return;
  }

  try {
    const progress = await window.loadQuizData(`fillblanks_${PAGE_ID}`);
    
    if (progress && Object.keys(progress).length > 0) {
      score = progress.score || 0;
      answeredQuestions = new Set(progress.answeredQuestions || []);
      currentQuestionIndex = progress.currentQuestionIndex || 0;
      
      // Update display
      const scoreElement = document.getElementById('score');
      if (scoreElement) {
        scoreElement.textContent = score;
      }
      
      // Restore answered states
      answeredQuestions.forEach(questionId => {
        const element = document.querySelector(`[data-index="${questionId}"]`);
        if (element) {
          element.classList.add('revealed');
          const answer = element.getAttribute('data-answer');
          element.innerHTML = answer + ' <button class="try-again" style="background: transparent; padding: 1px; color: #1BEA75; border: none;">✓</button>';
          
          const tryAgainBtn = element.querySelector('.try-again');
          if (tryAgainBtn) {
            tryAgainBtn.addEventListener('click', function() {
              resetQuestion(element);
            });
          }
        }
      });
      
      console.log('Progress loaded from Firebase');
    }
  } catch (error) {
    console.error('Failed to load progress:', error);
  }
}

// Save incorrect answers to Firebase
async function saveIncorrectAnswer(questionData) {
  if (!window.currentUser || !window.saveQuizData) {
    console.log('No user authenticated - incorrect answer not saved');
    return;
  }

  try {
    // Load existing incorrect answers
    const existingData = await window.loadQuizData(`incorrect_${PAGE_ID}`) || {};
    const incorrectAnswers = existingData.answers || [];
    
    const existingIndex = incorrectAnswers.findIndex(item => item.answer === questionData.answer);
    if (existingIndex === -1) {
      incorrectAnswers.push(questionData);
    } else {
      incorrectAnswers[existingIndex] = questionData;
    }
    
    await window.saveQuizData(`incorrect_${PAGE_ID}`, { answers: incorrectAnswers });
    console.log('Incorrect answer saved to Firebase');
  } catch (error) {
    console.error('Failed to save incorrect answer:', error);
  }
}

// Save certainty ratings to Firebase
async function saveCertaintyRating(barId, value) {
  if (!window.currentUser || !window.saveQuizData) {
    console.log('No user authenticated - certainty rating not saved');
    return;
  }

  try {
    const existingData = await window.loadQuizData(`certainty_${PAGE_ID}`) || {};
    existingData[barId] = value;
    await window.saveQuizData(`certainty_${PAGE_ID}`, existingData);
    console.log('Certainty rating saved to Firebase');
  } catch (error) {
    console.error('Failed to save certainty rating:', error);
  }
}

// Load certainty ratings from Firebase
async function loadCertaintyRatings() {
  if (!window.currentUser || !window.loadQuizData) {
    return {};
  }

  try {
    const certaintyData = await window.loadQuizData(`certainty_${PAGE_ID}`) || {};
    console.log('Certainty ratings loaded from Firebase');
    return certaintyData;
  } catch (error) {
    console.error('Failed to load certainty ratings:', error);
    return {};
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  const quizElements = document.querySelectorAll('[data-quiz]');
  
  quizElementsArray = Array.from(quizElements);
  allQuizAnswers = quizElementsArray.map(el => el.getAttribute('data-quiz')).sort();
  
  quizElementsArray.forEach((element, index) => {
    const answer = element.getAttribute('data-quiz');
    const hint = element.getAttribute('data-hint');
    
    element.classList.add('quiz-word');
    element.setAttribute('data-answer', answer);
    element.setAttribute('data-index', index);
    element.style.cursor = 'pointer';
    element.addEventListener('click', function(e) {
      promptAnswer(element, e);
    });
    
    element.innerHTML = '___';
    element.style.cssText = `
      font-family: Roboto, sans-serif;
      padding: 2px 2px;
      background-color: transparent;
      color: #0000ff;
      border: 0px solid black;
      border-radius: 7px;
      display: inline-block;
      min-width: 50px;
      text-align: center;
      cursor: pointer;
    `;
    
    if (hint) {
      element.setAttribute('title', `💡 ${hint}`);
    }
  });
  
  totalQuestions = quizElementsArray.length;
  const totalElement = document.getElementById('total');
  if (totalElement) {
    totalElement.textContent = totalQuestions;
  }
  
  // Wait for Firebase auth then load progress
  setTimeout(() => {
    loadProgress();
    loadAndApplyCertaintyRatings();
  }, 1000);
});

async function updateScoreAndSave() {
  const scoreElement = document.getElementById('score');
  if (scoreElement) {
    scoreElement.textContent = score;
  }
  await saveProgress();
}

function promptAnswer(element, event) {
  if ((element.classList.contains('revealed') || element.classList.contains('incorrect')) && 
      event && !event.target.classList.contains('try-again')) {
    return;
  }
  
  const correctAnswer = element.getAttribute('data-answer');
  const questionId = element.getAttribute('data-index');
  
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'answer-input';
  input.autocomplete = 'off';
  input.style.cssText = `
    width: ${Math.max(correctAnswer.length * 12, 120)}px;
    padding: 4px 8px;
    font-size: 14px;
    border: 2px solid #007acc;
    border-radius: 4px;
    font-family: ${element.style.fontFamily};
  `;
  input.placeholder = 'Type your answer...';
  
  element.innerHTML = '';
  element.appendChild(input);
  element.style.background = 'transparent';
  element.style.border = 'none';
  element.style.padding = '0';
  input.focus();
  
  async function checkAnswer() {
    const userAnswer = input.value.toLowerCase().trim();
    if (userAnswer === correctAnswer.toLowerCase()) {
      element.classList.add('revealed');
      element.classList.remove('incorrect');
      element.innerHTML = correctAnswer + ' <button class="try-again" style="background: transparent; padding: 1px; color: #1BEA75; border: none;">✓</button>';
      
      const tryAgainBtn = element.querySelector('.try-again');
      if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
          resetQuestion(element);
        });
      }
      
      element.style.cssText = `
        background-color: transparent;
        color: inherit;
        border: none;
        padding: 1px 1px;
        cursor: pointer;
      `;

      if (!answeredQuestions.has(questionId)) {
        score++;
        answeredQuestions.add(questionId);
        await updateScoreAndSave();
      }
      checkAndCollapseLi(element);
    } else if (userAnswer !== '') {
      element.classList.add('incorrect');
      element.classList.remove('revealed');
      element.innerHTML = correctAnswer + ' <button class="try-again">⟳</button>';
      
      const tryAgainBtn = element.querySelector('.try-again');
      if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
          resetQuestion(element);
        });
        tryAgainBtn.style.cssText = `
          background: transparent;
          border: none;
          padding: 2px 2px;
          cursor: pointer;
        `;
      }
      
      element.style.cssText = `
        background-color: transparent;
        padding: 2px 2px;
        color: #721c24;
        border: 1px solid #f5c6cb;
        cursor: pointer;
      `;
      
      if (!answeredQuestions.has(questionId)) {
        answeredQuestions.add(questionId);
        await updateScoreAndSave();
      }
      
      // Save incorrect answer to Firebase
      const questionData = {
        question: element.textContent.trim(),
        answer: correctAnswer,
        userAnswer: userAnswer,
        timestamp: Date.now(),
        pageId: PAGE_ID
      };
      await saveIncorrectAnswer(questionData);
    }
  }

  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  });

  input.addEventListener('blur', function() {
    setTimeout(() => {
      if (input.value.trim() !== '') {
        checkAnswer();
      } else {
        element.innerHTML = '___';
        element.style.cssText = `
          background-color: transparent;
          border: 1px solid #ccc;
          color: transparent;
          padding: 2px 2px;
          font-family: Roboto, sans-serif;
          text-align: center;
          cursor: pointer;
        `;
      }
    }, 150);
  });
}

async function resetQuestion(element) {
  element.classList.remove('revealed', 'incorrect');
  const answer = element.getAttribute('data-answer');
  const questionId = element.getAttribute('data-index');
  
  element.innerHTML = '___';
  element.style.cssText = `
    background-color: transparent;
    border: 1px solid #ccc;
    color: transparent;
    padding: 2px 2px;
    font-family: Roboto, sans-serif;
    text-align: center;
    cursor: pointer;
  `;
  
  if (answeredQuestions.has(questionId)) {
    answeredQuestions.delete(questionId);
    if (score > 0) {
      score--;
      await updateScoreAndSave();
    }
  }
}

// Add reset progress functionality
let header = document.getElementById('quiz-header');
if (!header) {
  header = document.createElement('div');
  header.id = 'quiz-header';
  header.style.cssText = `
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 12px 24px;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
  `;
  document.body.insertBefore(header, document.body.firstChild);
}

const resetButton = document.createElement('button');
resetButton.textContent = 'Reset Progress';
resetButton.style.cssText = `
  margin-right: 16px;
  padding: 6px 14px;
  font-size: 15px;
  border-radius: 4px;
  border: 1px solid #007acc;
  background: #fff;
  cursor: pointer;
`;
resetButton.addEventListener('click', function() {
  if (confirm('Are you sure you want to reset your progress?')) {
    resetProgress();
  }
});
header.appendChild(resetButton);

async function resetProgress() {
  // Reset Firebase data
  if (window.currentUser && window.saveQuizData) {
    await window.saveQuizData(`fillblanks_${PAGE_ID}`, {});
    await window.saveQuizData(`incorrect_${PAGE_ID}`, { answers: [] });
    await window.saveQuizData(`certainty_${PAGE_ID}`, {});
  }
  
  score = 0;
  answeredQuestions = new Set();
  currentQuestionIndex = 0;
  
  const scoreElement = document.getElementById('score');
  if (scoreElement) {
    scoreElement.textContent = score;
  }
  
  quizElementsArray.forEach(element => {
    element.classList.remove('revealed', 'incorrect');
    element.innerHTML = '___';
    element.style.cssText = `
      background-color: transparent;
      color: transparent;
      border: 0px solid #ccc;
      border-radius: 3px;
      padding: 2px 2px;
      font-family: Roboto, sans-serif;
      text-align: center;
      cursor: pointer;
      display: inline-block;
      min-width: 50px;
    `;
  });
  
  // Reset certainty bars
  document.querySelectorAll('.certainty-bar').forEach(function(bar) {
    bar.value = 50; // Reset to middle value
    bar.parentElement.querySelector('.certainty-value').textContent = '50';
  });
}

function isAnswerCorrect(userInput, correctAnswer) {
  const cleanInput = userInput.trim().toLowerCase().replace(/[^a-z0-9]/gi, "");
  const cleanAnswer = correctAnswer.trim().toLowerCase().replace(/[^a-z0-9]/gi, "");
  return cleanInput === cleanAnswer;
}

// Certainty bars functionality (Firebase-only)
async function loadAndApplyCertaintyRatings() {
  const certaintyData = await loadCertaintyRatings();
  
  document.querySelectorAll('.certainty-bar').forEach(function(bar) {
    if (certaintyData[bar.id]) {
      bar.value = certaintyData[bar.id];
      bar.parentElement.querySelector('.certainty-value').textContent = certaintyData[bar.id];
    }
  });
}

document.querySelectorAll('.certainty-bar').forEach(function(bar) {
  bar.addEventListener('input', function() {
    this.parentElement.querySelector('.certainty-value').textContent = this.value;
    // Save to Firebase instead of localStorage
    saveCertaintyRating(this.id, this.value);
  });
});

// Explanation buttons functionality
document.querySelectorAll('.explanation-button').forEach(function(button) {
  button.addEventListener('click', function() {
    const explanation = this.nextElementSibling;
    if (explanation.style.display === 'block') {
      explanation.style.display = 'none';
      this.textContent = 'Show Explanation';
    } else {
      explanation.style.display = 'block';
      this.textContent = 'Hide Explanation';
    }
  });
});

// Add missing function if not defined elsewhere
function checkAndCollapseLi(element) {
  // This function should handle any list collapsing logic if needed
  // Add implementation if required for your specific use case
}

// Wait for Firebase auth to be ready
window.addEventListener('load', () => {
  // Check periodically for Firebase auth
  const checkAuth = setInterval(() => {
    if (window.currentUser) {
      loadProgress();
      loadAndApplyCertaintyRatings();
      clearInterval(checkAuth);
    }
  }, 500);
  
  // Stop checking after 10 seconds
  setTimeout(() => clearInterval(checkAuth), 10000);
});

console.log('Fill-in-blanks Firebase script loaded for', PAGE_ID);

