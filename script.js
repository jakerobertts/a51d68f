let score = 0;
let totalQuestions = 0;
let answeredQuestions = new Set();
let currentQuestionIndex = 0;
let quizElementsArray = [];
let allQuizAnswers = [];
const PAGE_ID = window.location.pathname.split('/').pop().replace('.html', '');

// Save state to localStorage
function saveProgress() {
  const progress = {
    score: score,
    answeredQuestions: Array.from(answeredQuestions),
    currentQuestionIndex: currentQuestionIndex,
    timestamp: Date.now(),
    pageId: PAGE_ID
  };
  localStorage.setItem(`quizProgress_${PAGE_ID}`, JSON.stringify(progress));
}

// Load state from localStorage
function loadProgress() {
  const saved = localStorage.getItem(`quizProgress_${PAGE_ID}`);
  if (saved) { // Fixed: was "saveD."
    const progress = JSON.parse(saved); // Fixed: was "saveD."
    score = progress.score || 0;
    answeredQuestions = new Set(progress.answeredQuestions || []);
    currentQuestionIndex = progress.currentQuestionIndex || 0;
    
    // Update display
    document.getElementById('score').textContent = score;
    
    // Restore answered states
    answeredQuestions.forEach(questionId => {
      const element = document.querySelector(`[data-index="${questionId}"]`);
      if (element) {
        element.classList.add('revealed');
        const answer = element.getAttribute('data-answer');
        element.innerHTML = answer;
      }
    });
  }
}

// Call loadProgress when page loads
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
    element.addEventListener('click', function(e) { // Fixed: was "E"
      promptAnswer(element, e);
    });
    
    const blankLength = Math.max(answer.length, 1);
    element.innerHTML = '___';
    element.style.fontFamily = 'Roboto, sans-serif';
    element.style.padding = '2px 2px';
    element.style.backgroundColor = 'transparent';
    element.style.color = '#0000ff';
    element.style.border = '0px solid black';
    element.style.borderRadius = '7px';
    element.style.display = 'inline-block';
    element.style.minWidth = '50px';
    element.style.textAlign = 'center';
    
    if (hint) {
      element.setAttribute('title', `💡 ${hint}`);
    }
  });
  
  totalQuestions = quizElementsArray.length;
  document.getElementById('total').textContent = totalQuestions;
  
  loadProgress();
  if (typeof loadAllProgressFromCloud === 'function') {
    loadAllProgressFromCloud();
  }
});

function updateScoreAndSave() {
  document.getElementById('score').textContent = score;
  saveProgress();
  if (typeof saveAllProgressToCloud === 'function') {
    saveAllProgressToCloud();
  }
}

function promptAnswer(element, event) {
  if ((element.classList.contains('revealed') || element.classList.contains('incorrect')) && event && !event.target.classList.contains('try-again')) {
    return;
  }
  
  const correctAnswer = element.getAttribute('data-answer');
  const hint = element.getAttribute('data-hint');
  const questionId = element.getAttribute('data-index');
  
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'answer-input';
  input.autocomplete = 'off';
  input.style.width = Math.max(correctAnswer.length * 12, 120) + 'px';
  input.style.padding = '4px 8px';
  input.style.fontSize = '14px';
  input.style.border = '2px solid #007acc';
  input.style.borderRadius = '4px';
  input.style.fontFamily = element.style.fontFamily;
  input.placeholder = 'Type your answer...';
  
  element.innerHTML = '';
  element.appendChild(input);
  element.style.background = 'transparent';
  element.style.border = 'none';
  element.style.padding = '0';
  input.focus();
  
  function checkAnswer() {
    const userAnswer = input.value.toLowerCase().trim();
    if (userAnswer === correctAnswer.toLowerCase()) {
      element.classList.add('revealed');
      element.classList.remove('incorrect');
      element.innerHTML = correctAnswer + ' <button class="try-again" style="background: transparent; padding: 1px; justify-content: center; color: #1BEA75; border: none; max-width: 10px;">✓</button>';
      const tryAgainBtn = element.querySelector('.try-again');
      if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
          resetQuestion(element);
        });
      }
      element.style.backgroundColor = '';
      element.style.color = '';
      element.style.border = '';
      element.style.padding = '1px 1px';

      if (!answeredQuestions.has(questionId)) { // Fixed: was "questionID."
        score++;
        answeredQuestions.add(questionId); // Fixed: was "questionID."
        updateScoreAndSave();
      }
      checkAndCollapseLi(element);
    } else if (userAnswer !== '') {
      element.classList.add('incorrect');
      element.classList.remove('revealed');
      element.innerHTML = correctAnswer + ' <button class="try-again">⟳</button> ';
      const tryAgainBtn = element.querySelector('.try-again');
      if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
          resetQuestion(element);
        });
      }
      tryAgainBtn.style.background = 'transparent';
      tryAgainBtn.style.border = 'none';
      tryAgainBtn.style.padding = '2px 2px';
      element.style.backgroundColor = 'transparent';
      element.style.padding = '2px 2px';
      element.style.color = '#721c24';
      element.style.border = '1px solid #f5c6cb';
      
      if (!answeredQuestions.has(questionId)) { // Fixed: was "questionID."
        answeredQuestions.add(questionId); // Fixed: was "questionID."
        updateScoreAndSave();
      }
      
      const pageId = PAGE_ID || (window.location.pathname.split('/').pop().replace('.html', ''));
      const key = `incorrectTerms_${pageId}`;
      let arr = JSON.parse(localStorage.getItem(key) || "[]");

      const questionData = {
        question: element.textContent.trim(),
        answer: correctAnswer,
        timestamp: Date.now()
      };

      const existingIndex = arr.findIndex(item => item.answer === correctAnswer);
      if (existingIndex === -1) {
        arr.push(questionData); // Fixed: was "questionDatA."
      } else {
        arr[existingIndex] = questionData;
      }
      localStorage.setItem(key, JSON.stringify(arr));
    }
  }

  input.addEventListener('keypress', function(e) { // Fixed: was "E"
    if (e.key === 'Enter') {
      checkAnswer();
    }
  });

  input.addEventListener('blur', function(e) { // Fixed: was "E"
    setTimeout(() => {
      if (input.value.trim() !== '') {
        checkAnswer();
      } else {
        const blankLength = Math.max(correctAnswer.length, 4);
        element.innerHTML = '___';
        element.style.backgroundColor = 'transparent';
        element.style.border = '1px solid #ccc';
        element.style.color = 'transparent';
        element.style.padding = '2px 2px';
        element.style.fontFamily = 'Roboto, sans-serif';
        element.style.textAlign = 'center';
        element.style.cursor = 'pointer';
      }
    }, 150);
  });
}

function resetQuestion(element) {
  element.classList.remove('revealed', 'incorrect');
  const answer = element.getAttribute('data-answer');
  
  const blankLength = Math.max(answer.length, 4);
  element.innerHTML = '___';
  element.style.backgroundColor = 'transparent';
  element.style.border = '1px solid #ccc';
  element.style.color = 'transparent';
  element.style.padding = '2px 2px';
  element.style.fontFamily = 'Roboto, sans-serif';
  element.style.textAlign = 'center';
  element.style.cursor = 'pointer';
  
  const questionId = element.getAttribute('data-index');
  if (answeredQuestions.has(questionId)) { // Fixed: was "questionID."
    answeredQuestions.delete(questionId); // Fixed: was "questionID."
    if (score > 0) {
      score--;
      updateScoreAndSave();
    }
    saveProgress();
    if (typeof saveAllProgressToCloud === 'function') {
      saveAllProgressToCloud();
    }
  }
}

// Add reset progress functionality
let header = document.getElementById('quiz-header');
if (!header) {
  header = document.createElement('div');
  header.id = 'quiz-header';
  header.style.display = 'flex';
  header.style.justifyContent = 'flex-start';
  header.style.alignItems = 'center';
  header.style.padding = '12px 24px';
  header.style.background = '#f8f9fa';
  header.style.borderBottom = '1px solid #e0e0e0';
  document.body.insertBefore(header, document.body.firstChild); // Fixed: was "firstChilD."
}

const resetButton = document.createElement('button');
resetButton.textContent = 'Reset Progress';
resetButton.style.marginRight = '16px';
resetButton.style.padding = '6px 14px';
resetButton.style.fontSize = '15px';
resetButton.style.borderRadius = '4px';
resetButton.style.border = '1px solid #007acc';
resetButton.style.background = '#fff';
resetButton.style.cursor = 'pointer';
resetButton.addEventListener('click', function() {
  if (confirm('Are you sure you want to reset your progress?')) {
    resetProgress();
  }
});
header.appendChild(resetButton);

function resetProgress() {
  localStorage.removeItem(`quizProgress_${PAGE_ID}`);
  score = 0;
  answeredQuestions = new Set();
  currentQuestionIndex = 0;
  document.getElementById('score').textContent = score;
  quizElementsArray.forEach(element => {
    element.classList.remove('revealed', 'incorrect');
    const answer = element.getAttribute('data-answer');
    element.innerHTML = '___';
    element.style.backgroundColor = 'transparent';
    element.style.color = 'transparent';
    element.style.border = '0px solid #ccc';
    element.style.borderRadius = '3px';
    element.style.padding = '2px 2px';
    element.style.fontFamily = 'Roboto, sans-serif';
    element.style.textAlign = 'center';
    element.style.cursor = 'pointer';
    element.style.display = 'inline-block';
    element.style.minWidth = '50px';
  });
}

function isAnswerCorrect(userInput, correctAnswer) {
  const cleanInput = userInput.trim().toLowerCase().replace(/[^a-z0-9]/gi, "");
  const cleanAnswer = correctAnswer.trim().toLowerCase().replace(/[^a-z0-9]/gi, "");
  return cleanInput === cleanAnswer;
}

// Firebase authentication (only run if Firebase elements exist)
document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.getElementById('login-btn');
  const importBtn = document.getElementById('import-btn');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
        .then(result => {
          alert("Logged in as " + result.user.email);
          saveProgressToUser(result.user.uid); // Fixed: was "uiD."
        })
        .catch(error => {
          alert("Login failed: " + error.message); // Fixed: was "messagE."
        });
    });
  }
  
  if (importBtn) {
    importBtn.addEventListener('click', function() {
      const user = firebase.auth().currentUser;
      if (user) {
        importProgressFromUser(user.uid); // Fixed: was "uiD."
      } else {
        alert("Please log in with Google first using the Sync Progress button.");
      }
    });
  }
});

function importProgressFromUser(userID) { // Fixed: was "userID."
  firebase.database().ref('allProgress/' + userID).once('value').then(snapshot => { // Fixed: was "userID."
    const cloudProgress = snapshot.val();
    if (cloudProgress) {
      for (let key in cloudProgress) {
        localStorage.setItem(key, cloudProgress[key]);
      }
      alert("Progress Saved!");
      location.reload();
    } else {
      alert("No progress found for this Google account.");
    }
  });
}

function saveProgressToUser(userID) { // Fixed: was "userID."
  const allProgress = {};
  for (let key in localStorage) { // Fixed: was "localStoragE"
    if (key.startsWith('quizProgress_') || key.startsWith('incorrectTerms_')) {
      allProgress[key] = localStorage.getItem(key);
    }
  }
  firebase.database().ref('allProgress/' + userID).set(allProgress) // Fixed: was "userID."
    .then(() => {
      alert("Progress synced to your Google account!");
    })
    .catch(error => {
      alert("Failed to sync progress: " + error.message);
    });
}

// Certainty bars functionality
document.querySelectorAll('.certainty-bar').forEach(function(bar) {
  bar.addEventListener('input', function() {
    this.parentElement.querySelector('.certainty-value').textContent = this.value;
    localStorage.setItem(this.id, this.value);
  });
  const saved = localStorage.getItem(bar.id); // Fixed: was "bar.iD."
  if (saved) { // Fixed: was "saveD."
    bar.value = saved;
    bar.parentElement.querySelector('.certainty-value').textContent = saved;
  }
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

