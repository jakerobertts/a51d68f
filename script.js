let score = 0;
//
let totalQuestions = 0;
let answeredQuestions = new Set();
let currentQuestionIndex = 0;
let quizElementsArray = [];
let allQuizAnswers = [];
const PAGE_ID = window.location.pathname.split('/').pop().replace('.html', '');

//each page has its own unique quiz progress


// Save state to localStorage
function saveProgress() {
  const progress = {
    score: score,
    answeredQuestions: Array.from(answeredQuestions),
    currentQuestionIndex: currentQuestionIndex,
    timestamp: Date.now(),
    pageId: PAGE_ID // Store the current page ID
    
  };
  localStorage.setItem(`quizProgress_${PAGE_ID}`, JSON.stringify(progress));
}

// Load state from localStorage
function loadProgress() {
  const saved = localStorage.getItem(`quizProgress_${PAGE_ID}`);
  if (saved) {
    const progress = JSON.parse(saved);
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
        // Restore original text
        const answer = element.getAttribute('data-answer');
        element.innerHTML = answer;
      }
    });
  }
}

// Call loadProgress when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Convert all elements with data-quiz attribute to quiz words
  const quizElements = document.querySelectorAll('[data-quiz]');
  
  // Store elements in array for sequential access
  quizElementsArray = Array.from(quizElements);
  
  // Collect all quiz answers for autocomplete
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
    
    // Replace content with blank underscores
    const blankLength = Math.max(answer.length, 1);
    element.innerHTML = '___'; // Minimum 1 underscore
    element.style.fontFamily = 'Futura, sans-serif';
    element.style.padding = '2px 2px';
    element.style.backgroundColor = 'transparent';
    element.style.color = 'blue';
    element.style.border = '0px solid black';
    element.style.borderRadius = '7px';
    element.style.display = 'inline-block';
    element.style.minWidth = '50px';
    element.style.textAlign = 'center';
    //placeholder 
    // element.style.placeholder = 'Type your answer...';
    // Add hint tooltip if available
    if (hint) {
      element.setAttribute('title', `💡 ${hint}`);
    }
  });
  
  totalQuestions = quizElementsArray.length;
  document.getElementById('total').textContent = totalQuestions;
  
  // Add this line at the end:
  loadProgress();
  if (typeof loadAllProgressFromCloud === 'function') {
    loadAllProgressFromCloud();
  }
});

// Save progress whenever score changes
function updateScoreAndSave() {
  document.getElementById('score').textContent = score;
  saveProgress();
  if (typeof saveAllProgressToCloud === 'function') {
    saveAllProgressToCloud();
  }
} // Save after each correct answer

function promptAnswer(element, event) {
  // Allow re-answering if clicking on feedback area
  if ((element.classList.contains('revealed') || element.classList.contains('incorrect')) && event && !event.target.classList.contains('try-again')) {
    return; // Already answered, unless clicking try again
  }
  
  const correctAnswer = element.getAttribute('data-answer');
  const hint = element.getAttribute('data-hint');
  const questionId = element.getAttribute('data-index'); // Use unique index instead of answer
  // Create input field
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'answer-input';
  input.style.width = Math.max(correctAnswer.length * 12, 120) + 'px';
  input.style.padding = '4px 8px';
  input.style.fontSize = '14px';
  input.style.border = '2px solid #007acc';
  input.style.borderRadius = '4px';
  input.style.fontFamily = element.style.fontFamily;
  input.placeholder = 'Type your answer...';
  
  // Create autocomplete dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'autocomplete-dropdown';
  dropdown.style.position = 'fixed';
  dropdown.style.background = 'white';
  dropdown.style.border = '1px solid #ccc';
  dropdown.style.borderTop = 'none';
  dropdown.style.borderRadius = '0 0 4px 4px';
  dropdown.style.maxHeight = '150px';
  dropdown.style.overflowY = 'auto';
  dropdown.style.zIndex = '999999';
  dropdown.style.display = 'none';
  dropdown.style.width = Math.max(correctAnswer.length * 12, 120) + 'px';
  dropdown.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
  
  // Append dropdown to body to ensure it's on top
  document.body.appendChild(dropdown);
  
  // Create container for input and dropdown
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.display = 'inline-block';
  
  // Replace the blank with container
  element.innerHTML = '';
  container.appendChild(input);
  element.appendChild(container);
  element.style.background = 'transparent';
  element.style.border = 'none';
  element.style.padding = '0';
  input.focus();
  
  // Position dropdown function
  function positionDropdown() {
    const inputRect = input.getBoundingClientRect();
    dropdown.style.left = inputRect.left + 'px';
    dropdown.style.top = (inputRect.bottom) + 'px';
  }
  
  // Add autocomplete functionality
  input.addEventListener('input', function() {
    const value = input.value.toLowerCase();
    dropdown.innerHTML = '';
    
    if (value.length > 0) {
      const matches = allQuizAnswers.filter(answer => 
        answer.toLowerCase().includes(value) && answer.toLowerCase() !== value
      );
      
      if (matches.length > 0) {
        positionDropdown(); // Position dropdown before showing
        dropdown.style.display = 'block';
        matches.slice(0, 8).forEach(match => {
          const option = document.createElement('div');
          option.textContent = match;
          option.style.padding = '8px 12px';
          option.style.cursor = 'pointer';
          option.style.border = 'none';
          option.style.background = 'white';
          option.style.display = 'block';
          
          option.addEventListener('mouseenter', function() {
            option.style.backgroundColor = '#f0f8ff';
          });
          
          option.addEventListener('mouseleave', function() {
            option.style.backgroundColor = 'white';
          });
          
          option.addEventListener('click', function() {
            input.value = match;
            dropdown.style.display = 'none';
            checkAnswer();
          });
          
          dropdown.appendChild(option);
        });
      } else {
        dropdown.style.display = 'none';
      }
    } else {
      dropdown.style.display = 'none';
    }
  });
  
  // Hide dropdown when clicking outside or scrolling
  function hideDropdown(e) {
    if (!container.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  }
  
  document.addEventListener('click', hideDropdown);
  function scrollHideDropdown() {
    dropdown.style.display = 'none';
  }
  document.addEventListener('scroll', scrollHideDropdown);
  
  // Handle answer submission
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
      // Remove green styling for just checkmark
      element.style.backgroundColor = '';
      element.style.color = '';
      element.style.border = '';
      element.style.padding = '1px 1px';

      if (!answeredQuestions.has(questionId)) {
        score++;
        answeredQuestions.add(questionId);
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
      if (!answeredQuestions.has(questionId)) {
        answeredQuestions.add(questionId);
        updateScoreAndSave();
      }
      // Store only the term (the correct answer)
      const pageId = PAGE_ID || (window.location.pathname.split('/').pop().replace('.html', ''));
      const key = `incorrectTerms_${pageId}`;
      let arr = JSON.parse(localStorage.getItem(key) || "[]");
      if (!arr.includes(correctAnswer)) {
        arr.push(correctAnswer);
        localStorage.setItem(key, JSON.stringify(arr));
      }
    }
  }
  // Submit on Enter key or when input loses focus
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      dropdown.style.display = 'none';
      checkAnswer();
    }
  });
  
  input.addEventListener('blur', function(e) {
    // Small delay to allow dropdown clicks to register
    setTimeout(() => {
      if (input.value.trim() !== '') {
        checkAnswer();
      } else {
        // Restore blank state if empty
        const blankLength = Math.max(correctAnswer.length, 4);
      
        element.style.backgroundColor = 'transparent';
        element.style.border = '1px solid #ccc';
        element.style.color = 'transparent';
        element.style.padding = '2px 2px';
        element.style.fontFamily = 'Futura, sans-serif';
        element.style.textAlign = 'center';
        element.style.cursor = 'pointer';
      }
      dropdown.style.display = 'none';
      // Clean up dropdown from body
      if (dropdown.parentNode) {
        dropdown.parentNode.removeChild(dropdown);
      }
      // Remove event listeners
      // Remove event listeners
      document.removeEventListener('click', hideDropdown);
      document.removeEventListener('scroll', scrollHideDropdown);
    }, 150);
  });

function resetQuestion(element) {
  // Reset the question state
  element.classList.remove('revealed', 'incorrect');
  const answer = element.getAttribute('data-answer');
  
  // Restore blank state
  const blankLength = Math.max(answer.length, 4);
  element.innerHTML = ' '.repeat(blankLength);
        element.innerHTML = ' '.repeat(blankLength);
        element.style.backgroundColor = 'transparent';
        element.style.border = '1px solid #ccc';
        element.style.color = 'transparent';
        element.style.padding = '2px 2px';
        element.style.fontFamily = 'Futura, sans-serif';
        element.style.textAlign = 'center';
        element.style.cursor = 'pointer';
  // Remove from answered questions and decrement score if previously answered
  const questionId = element.getAttribute('data-index');
  if (answeredQuestions.has(questionId)) {
    answeredQuestions.delete(questionId);
    if (score > 0) {
      score--;
      updateScoreAndSave();
    }
    saveProgress();
    if (typeof saveAllProgressToCloud === 'function') {
      saveAllProgressToCloud();
    }
  }
}}
// Add a reset progress button inside a dedicated header container
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
  document.body.insertBefore(header, document.body.firstChild);
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

/**
 * Resets the quiz progress by clearing localStorage, resetting score and answered questions,
 * and restoring the UI to its initial state.
 */
function resetProgress() {
  // Remove progress from localStorage
  localStorage.removeItem(`quizProgress_${PAGE_ID}`);
  // Reset variables
  score = 0;
  answeredQuestions = new Set();
  currentQuestionIndex = 0;
  // Reset UI
  document.getElementById('score').textContent = score;
  quizElementsArray.forEach(element => {
    element.classList.remove('revealed', 'incorrect');
    const answer = element.getAttribute('data-answer');
    const blankLength = Math.max(answer.length, 4);
    element.innerHTML = ' '.repeat(blankLength);
    element.style.backgroundColor = 'transparent';
    element.style.color = 'transparent';
    element.style.border = '0px solid #ccc';
    element.style.borderRadius = '3px';
    element.style.padding = '2px 2px';
    element.style.fontFamily = 'Futura, sans-serif';
    element.style.textAlign = 'center';
    element.style.cursor = 'pointer';
    element.style.display = 'inline-block';
    element.style.minWidth = '50px';
  });
}
//Unique quiz progress in each page
// Quiz progress is stored uniquely for each page using PAGE_ID in localStorage


function isAnswerCorrect(userInput, correctAnswer) {
  // Remove spaces, apostrophes, and punctuation, make lowercase
  const cleanInput = userInput.trim().toLowerCase().replace(/[^a-z0-9]/gi, "");
  const cleanAnswer = correctAnswer.trim().toLowerCase().replace(/[^a-z0-9]/gi, "");
  return cleanInput === cleanAnswer;
}

// Add Firebase authentication and progress syncing
document.addEventListener('DOMContentLoaded', function() {
  // Google Auth login and import
  document.getElementById('login-btn').addEventListener('click', function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        alert("Logged in as " + result.user.email);
        // Save ALL progress from localStorage to cloud using Google user ID
        saveProgressToUser(result.user.uid);
        // Optionally, also import after saving:
        // importProgressFromUser(result.user.uid);
      })
      .catch(error => {
        alert("Login failed: " + error.message);
      });
  });
  
  // Add this for the import button:
  document.getElementById('import-btn').addEventListener('click', function() {
    const user = firebase.auth().currentUser;
    if (user) {
      importProgressFromUser(user.uid);
    } else {
      alert("Please log in with Google first using the Sync Progress button.");
    }
  });
});

// Import progress from Firebase using Google user ID
function importProgressFromUser(userId) {
  firebase.database().ref('allProgress/' + userId).once('value').then(snapshot => {
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

function saveProgressToUser(userId) {
  // Gather all quiz progress keys from localStorage
  const allProgress = {};
  for (let key in localStorage) {
    if (key.startsWith('quizProgress_')) {
      allProgress[key] = localStorage.getItem(key);
    }
  }
  // Save to Firebase under this user's ID
  firebase.database().ref('allProgress/' + userId).set(allProgress)
    .then(() => {
      alert("Progress synced to your Google account!");
    })
    .catch(error => {
      alert("Failed to sync progress: " + error.message);
    });
}
document.querySelectorAll('.certainty-bar').forEach(function(bar) {
  bar.addEventListener('input', function() {
    this.parentElement.querySelector('.certainty-value').textContent = this.value;
    // Save to localStorage
    localStorage.setItem(this.id, this.value);
  });
  // Load saved value if exists
  const saved = localStorage.getItem(bar.id);
  if (saved) {
    bar.value = saved;
    bar.parentElement.querySelector('.certainty-value').textContent = saved;
  }
});