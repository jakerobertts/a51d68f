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
    element.innerHTML = '&nbsp;'.repeat(blankLength); // Minimum 1 underscore
    element.style.fontFamily = 'apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
    element.style.letterSpacing = '2px';
    element.style.padding = '2px 6px';
    element.style.backgroundColor = 'white';
    element.style.border = '1px solid black';
    element.style.borderRadius = '7px';
    element.style.display = 'inline-block';
    element.style.minWidth = '50px';
    element.style.textAlign = 'center';
    
    // Add hint tooltip if available
    if (hint) {
      element.setAttribute('title', `💡 ${hint}`);
    }
  });
  
  totalQuestions = quizElementsArray.length;
  document.getElementById('total').textContent = totalQuestions;
  
  // Add this line at the end:
  loadProgress();
});

// Save progress whenever score changes
function updateScoreAndSave() {
  document.getElementById('score').textContent = score;
  saveProgress(); // Save after each correct answer
}

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
      element.innerHTML = correctAnswer + ' <span class="feedback correct">✓</span> <button class="try-again">⟳</button>';
      // Add event listener for try-again button
      const tryAgainBtn = element.querySelector('.try-again');
      if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
          resetQuestion(element);
        });
      }
      element.style.backgroundColor = '#d4edda';
      element.style.color = '#155724';
      element.style.border = '1px solid #c3e6cb';
      element.style.padding = '2px 6px';
      
      if (!answeredQuestions.has(questionId)) {
        score++;
        answeredQuestions.add(questionId);
        updateScoreAndSave();
      }
      checkAndCollapseLi(element); // <-- Add this line
      } else if (userAnswer !== '') {
        element.classList.add('incorrect');
        element.classList.remove('revealed');
        element.innerHTML = correctAnswer + ' <span class="feedback incorrect">✗</span> <button class="try-again">⟳</button>';
        // Add event listener for try-again button
        const tryAgainBtn = element.querySelector('.try-again');
        if (tryAgainBtn) {
          tryAgainBtn.addEventListener('click', function() {
            resetQuestion(element);
          });
        }
        element.style.backgroundColor = '#f8d7da';
        element.style.color = '#721c24';
        element.style.border = '1px solid #f5c6cb';
        if (!answeredQuestions.has(questionId)) {
          answeredQuestions.add(questionId);
          updateScoreAndSave();
          updateScoreAndSave();
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
        element.innerHTML = '&nbsp;'.repeat(blankLength);
        element.style.backgroundColor = 'white';
        element.style.border = '1px solid #ccc';
        element.style.color = 'white';
        element.style.padding = '2px 6px';
        element.style.fontFamily = 'apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
        element.style.letterSpacing = '2px';
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
        element.style.backgroundColor = 'white';
        element.style.border = '1px solid #ccc';
        element.style.color = 'white';
        element.style.padding = '2px 6px';
        element.style.fontFamily = 'apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
        element.style.letterSpacing = '2px';
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
    element.style.backgroundColor = '#f0f0f0';
    element.style.color = 'white';
    element.style.border = '1px solid #ccc';
    element.style.borderRadius = '3px';
    element.style.padding = '2px 6px';
    element.style.fontFamily = 'monospace';
    element.style.letterSpacing = '2px';
    element.style.textAlign = 'center';
    element.style.cursor = 'pointer';
    element.style.display = 'inline-block';
    element.style.minWidth = '50px';
  });
}
//Unique quiz progress in each page
// Quiz progress is stored uniquely for each page using PAGE_ID in localStorage keys
function checkAndCollapseLi(element) {
  const li = element.closest('li');
  if (!li) return;
  // Check if all [data-quiz] in this li have class 'revealed'
  const allRevealed = Array.from(li.querySelectorAll('[data-quiz]'))
    .every(el => el.classList.contains('revealed'));
  if (allRevealed) {
    li.classList.add('collapsing');
    setTimeout(() => {
      li.style.display = 'none';
    }, 400); // Match the transition duration
  }
  checkAndCollapseLi(element);
}
