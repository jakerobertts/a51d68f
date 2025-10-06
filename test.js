let mcScore = 0;
let totalMCQuestions = 0;
let answeredQuestions = new Set();
const PAGE_ID = window.location.pathname.split("/").pop().replace(".html", "");

// Firebase-only save/load functions
async function saveMCProgress() {
  const progress = {
    score: mcScore,
    answeredQuestions: Array.from(answeredQuestions),
    timestamp: Date.now(),
    totalQuestions: totalMCQuestions,
    pageId: PAGE_ID
  };
  
  if (window.currentUser && window.saveQuizData) {
    await window.saveQuizData(`multiplechoice_${PAGE_ID}`, progress);
    console.log('MC progress saved to Firebase');
  } else {
    console.log('No user authenticated - MC progress not saved');
  }
}

async function loadMCProgress() {
  if (!window.currentUser || !window.loadQuizData) {
    console.log('No user authenticated - cannot load MC progress');
    return;
  }

  try {
    const progress = await window.loadQuizData(`multiplechoice_${PAGE_ID}`);
    const correctnessData = await window.loadQuizData(`correctness_${PAGE_ID}`) || {};
    
    if (progress && Object.keys(progress).length > 0) {
      mcScore = progress.score || 0;
      answeredQuestions = new Set(progress.answeredQuestions || []);
      updateScoreDisplay();
      
      // Restore visual state for answered questions
      answeredQuestions.forEach(questionId => {
        const groupName = questionId;
        const wasCorrect = correctnessData[questionId] === true;
        const correctAnswer = getCorrectAnswerForGroup(groupName);
        
        if (correctAnswer) {
          restoreQuestionState(groupName, correctAnswer, wasCorrect);
        }
      });
      
      console.log('MC progress loaded from Firebase');
    }
  } catch (error) {
    console.error('Failed to load MC progress:', error);
  }
}

async function storeAnswerCorrectness(questionId, isCorrect) {
  if (!window.currentUser || !window.saveQuizData) {
    console.log('No user authenticated - correctness not saved');
    return;
  }

  try {
    const existing = await window.loadQuizData(`correctness_${PAGE_ID}`) || {};
    existing[questionId] = isCorrect;
    await window.saveQuizData(`correctness_${PAGE_ID}`, existing);
    console.log('Answer correctness saved to Firebase');
  } catch (error) {
    console.error('Failed to save answer correctness:', error);
  }
}

async function checkIfPreviouslyCorrect(questionId) {
  if (!window.currentUser || !window.loadQuizData) {
    return false;
  }

  try {
    const correctnessData = await window.loadQuizData(`correctness_${PAGE_ID}`) || {};
    return correctnessData[questionId] === true;
  } catch (error) {
    console.error('Failed to check previous correctness:', error);
    return false;
  }
}

async function saveIncorrectAnswer(groupName, userAnswer, correctAnswer) {
  if (!window.currentUser || !window.saveQuizData) {
    console.log('No user authenticated - incorrect answer not saved');
    return;
  }

  try {
    const existingData = await window.loadQuizData(`incorrect_mc_${PAGE_ID}`) || {};
    const incorrectAnswers = existingData.answers || [];
    
    const questionData = {
      question: `${groupName}: Multiple Choice Question`,
      answer: correctAnswer,
      userAnswer: userAnswer,
      timestamp: Date.now(),
      type: "multiple_choice",
      pageId: PAGE_ID
    };

    const existingIndex = incorrectAnswers.findIndex(
      (item) => item.question === questionData.question
    );
    
    if (existingIndex === -1) {
      incorrectAnswers.push(questionData);
    } else {
      incorrectAnswers[existingIndex] = questionData;
    }
    
    await window.saveQuizData(`incorrect_mc_${PAGE_ID}`, { answers: incorrectAnswers });
    console.log('Incorrect MC answer saved to Firebase');
  } catch (error) {
    console.error('Failed to save incorrect answer:', error);
  }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  initializeIndividualMC();
  
  // Wait for Firebase auth then load progress
  setTimeout(() => {
    loadMCProgress();
  }, 1000);
  
  addResetProgressButton();
});

function initializeIndividualMC() {
  const radioGroups = getUniqueRadioGroups();
  totalMCQuestions = radioGroups.length;

  const totalElement = document.getElementById("total");
  if (totalElement) {
    totalElement.textContent = totalMCQuestions;
  }

  radioGroups.forEach((groupName) => {
    addSubmitButtonToGroup(groupName);
  });
}

function getUniqueRadioGroups() {
  const groups = new Set();
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    groups.add(radio.name);
  });
  return Array.from(groups);
}

function addSubmitButtonToGroup(groupName) {
  const radios = document.querySelectorAll(`input[type="radio"][name="${groupName}"]`);
  const lastRadio = radios[radios.length - 1];

  if (!lastRadio) return;

  const lineBreak1 = document.createElement("br");
  const lineBreak2 = document.createElement("br");

  const submitButton = document.createElement("button");
  submitButton.className = "mc-submit-btn";
  submitButton.setAttribute("data-group", groupName);
  submitButton.textContent = "Submit Answer";
  submitButton.style.cssText = `
    background: #6a11cb;
    color: white;
    border: none;
    padding: 6px 12px;
    font-size: 12px;
    font-family: Verdana, sans-serif;
    border-radius: 4px;
    cursor: pointer;
    margin: 8px 0;
    display: block;
    transition: background 0.3s ease;
  `;

  submitButton.addEventListener("click", function () {
    submitIndividualQuestion(groupName);
  });

  const lastLabel = lastRadio.closest("label") || lastRadio.parentElement;
  lastLabel.parentNode.insertBefore(lineBreak1, lastLabel.nextSibling);
  lastLabel.parentNode.insertBefore(submitButton, lineBreak1.nextSibling);
  lastLabel.parentNode.insertBefore(lineBreak2, submitButton.nextSibling);
}

async function submitIndividualQuestion(groupName) {
  const selectedRadio = document.querySelector(`input[type="radio"][name="${groupName}"]:checked`);

  if (!selectedRadio) {
    alert("Please select an answer before submitting.");
    return;
  }

  const userAnswer = selectedRadio.value;
  const correctAnswer = getCorrectAnswerForGroup(groupName);
  const isCorrect = userAnswer === correctAnswer;
  const questionId = groupName;

  // Update score and answered questions
  if (!answeredQuestions.has(questionId)) {
    answeredQuestions.add(questionId);
    if (isCorrect) {
      mcScore++;
    }
  } else {
    const wasCorrectBefore = await checkIfPreviouslyCorrect(questionId);
    if (wasCorrectBefore && !isCorrect) {
      mcScore--;
    } else if (!wasCorrectBefore && isCorrect) {
      mcScore++;
    }
  }

  // Store the correctness of this answer
  await storeAnswerCorrectness(questionId, isCorrect);

  updateScoreDisplay();
  showQuestionResult(groupName, userAnswer, correctAnswer, isCorrect);
  updateDataQuizSpan(groupName, userAnswer, correctAnswer, isCorrect);
  disableQuestion(groupName);

  // Save progress to Firebase
  await saveMCProgress();

  // Save incorrect answer if wrong
  if (!isCorrect) {
    await saveIncorrectAnswer(groupName, userAnswer, correctAnswer);
  }

  console.log(`Question ${questionId}: ${isCorrect ? 'Correct' : 'Incorrect'}, Score: ${mcScore}/${answeredQuestions.size}`);
}

function restoreQuestionState(groupName, correctAnswer, wasCorrect) {
  const answerSpan = findCorrectAnswerSpan(groupName);
  if (answerSpan) {
    if (!answerSpan.hasAttribute("data-original-content")) {
      answerSpan.setAttribute("data-original-content", answerSpan.innerHTML);
    }
    
    if (wasCorrect) {
      answerSpan.innerHTML = `${correctAnswer} ✓`;
      answerSpan.style.backgroundColor = "#d4edda";
      answerSpan.style.color = "#155724";
      answerSpan.style.border = "1px solid #28a745";
      answerSpan.classList.add("revealed");
    } else {
      answerSpan.innerHTML = `${correctAnswer} (Previously answered incorrectly)`;
      answerSpan.style.backgroundColor = "#f8d7da";
      answerSpan.style.color = "#721c24";
      answerSpan.style.border = "1px solid #dc3545";
      answerSpan.classList.add("incorrect");
    }
    
    answerSpan.style.cssText += `
      padding: 4px 8px;
      border-radius: 0px;
      font-weight: bold;
      display: inline-block;
      margin: 2px;
    `;

    const resetButton = document.createElement("button");
    resetButton.textContent = "try again";
    resetButton.className = "try-again";
    resetButton.style.cssText = `
      background: transparent;
      border: none;
      color: #666;
      cursor: pointer;
      margin-left: 5px;
      font-size: 12px;
      padding: 2px 4px;
      text-decoration: underline;
    `;

    resetButton.addEventListener("click", function () {
      resetIndividualQuestion(groupName);
    });

    answerSpan.appendChild(resetButton);
  }
  
  disableQuestion(groupName);
  
  document.querySelectorAll(`input[type="radio"][name="${groupName}"]`).forEach((radio) => {
    const label = radio.closest("label") || radio.parentElement;
    if (radio.value === correctAnswer) {
      label.style.cssText += `
        background-color: #d4edda;
        color: #155724;
        font-weight: bold;
        padding: 4px;
      `;
    }
  });
}

function addResetProgressButton() {
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset All Progress";
  resetButton.style.cssText = `
    background: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 14px;
    font-family: system-ui;
    border-radius: 6px;
    cursor: pointer;
    margin: 40px auto 0 auto;
    display: block;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: background 0.3s ease;
  `;

  resetButton.addEventListener("mouseenter", function() {
    this.style.background = "#c82333";
  });
  
  resetButton.addEventListener("mouseleave", function() {
    this.style.background = "#dc3545";
  });

  resetButton.addEventListener("click", function () {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      resetAllProgress();
    }
  });

  document.body.appendChild(resetButton);
}

async function resetAllProgress() {
  // Clear Firebase data
  if (window.currentUser && window.saveQuizData) {
    await window.saveQuizData(`multiplechoice_${PAGE_ID}`, {});
    await window.saveQuizData(`correctness_${PAGE_ID}`, {});
    await window.saveQuizData(`incorrect_mc_${PAGE_ID}`, { answers: [] });
  }

  mcScore = 0;
  answeredQuestions.clear();

  getUniqueRadioGroups().forEach(groupName => {
    resetIndividualQuestion(groupName);
  });

  updateScoreDisplay();
  console.log("All progress reset for", PAGE_ID);
}

async function resetIndividualQuestion(groupName) {
  const questionId = groupName;

  if (answeredQuestions.has(questionId)) {
    if (await checkIfPreviouslyCorrect(questionId)) {
      mcScore--;
    }
    answeredQuestions.delete(questionId);
    
    // Remove from correctness tracking
    if (window.currentUser && window.saveQuizData) {
      const existing = await window.loadQuizData(`correctness_${PAGE_ID}`) || {};
      delete existing[questionId];
      await window.saveQuizData(`correctness_${PAGE_ID}`, existing);
    }
    
    updateScoreDisplay();
  }

  // Re-enable radio buttons
  document.querySelectorAll(`input[type="radio"][name="${groupName}"]`).forEach((radio) => {
    radio.disabled = false;
    radio.checked = false;
    const label = radio.closest("label") || radio.parentElement;
    label.style.cssText = '';
  });

  // Reset submit button
  const submitButton = document.querySelector(`.mc-submit-btn[data-group="${groupName}"]`);
  if (submitButton) {
    submitButton.textContent = "Submit Answer";
    submitButton.disabled = false;
    submitButton.style.background = "#6a11cb";
    submitButton.style.cursor = "pointer";
  }

  // Reset data-quiz span
  const answerSpan = findCorrectAnswerSpan(groupName);
  if (answerSpan) {
    const originalContent = answerSpan.getAttribute("data-original-content");
    if (originalContent) {
      answerSpan.innerHTML = originalContent;
    }
    answerSpan.style.cssText = 'display: none;';
    answerSpan.classList.remove("revealed", "incorrect");
  }

  await saveMCProgress();
}

function getCorrectAnswerForGroup(groupName) {
  const answerSpan = findCorrectAnswerSpan(groupName);
  return answerSpan ? answerSpan.getAttribute("data-quiz") : null;
}

function findCorrectAnswerSpan(groupName) {
  const firstRadio = document.querySelector(`input[type="radio"][name="${groupName}"]`);
  if (!firstRadio) return null;

  let currentElement = firstRadio.parentElement;
  while (currentElement && currentElement !== document.body) {
    let prevElement = currentElement.previousElementSibling;
    while (prevElement) {
      if (prevElement.hasAttribute && prevElement.hasAttribute("data-quiz")) {
        return prevElement;
      }
      const spanInside = prevElement.querySelector ? prevElement.querySelector("[data-quiz]") : null;
      if (spanInside) {
        return spanInside;
      }
      prevElement = prevElement.previousElementSibling;
    }
    currentElement = currentElement.parentElement;
  }
  return null;
}

function updateDataQuizSpan(groupName, userAnswer, correctAnswer, isCorrect) {
  const answerSpan = findCorrectAnswerSpan(groupName);
  if (!answerSpan) return;

  if (!answerSpan.hasAttribute("data-original-content")) {
    answerSpan.setAttribute("data-original-content", answerSpan.innerHTML);
  }

  if (isCorrect) {
    answerSpan.innerHTML = `${correctAnswer} ✓`;
    answerSpan.style.backgroundColor = "#d4edda";
    answerSpan.style.color = "#155724";
    answerSpan.style.border = "1px solid #28a745";
    answerSpan.classList.add("revealed");
  } else {
    answerSpan.innerHTML = `${correctAnswer} (You chose: ${userAnswer})`;
    answerSpan.style.backgroundColor = "#f8d7da";
    answerSpan.style.color = "#721c24";
    answerSpan.style.border = "1px solid #dc3545";
    answerSpan.classList.add("incorrect");
  }

  answerSpan.style.cssText += `
    padding: 4px 8px;
    border-radius: 0px;
    font-weight: bold;
    display: inline-block;
    margin: 2px;
  `;

  const resetButton = document.createElement("button");
  resetButton.textContent = "try again";
  resetButton.className = "try-again";
  resetButton.style.cssText = `
    background: transparent;
    border: none;
    color: #666;
    cursor: pointer;
    margin-left: 5px;
    font-size: 12px;
    padding: 2px 4px;
    text-decoration: underline;
  `;

  resetButton.addEventListener("click", function () {
    resetIndividualQuestion(groupName);
  });

  answerSpan.appendChild(resetButton);
}

function showQuestionResult(groupName, userAnswer, correctAnswer, isCorrect) {
  document.querySelectorAll(`input[type="radio"][name="${groupName}"]`).forEach((radio) => {
    const label = radio.closest("label") || radio.parentElement;

    if (radio.value === correctAnswer) {
      label.style.cssText += `
        background-color: #d4edda;
        color: #155724;
        font-weight: bold;
        padding: 4px;
        border-radius: 0px;
      `;
    } else if (radio.value === userAnswer && !isCorrect) {
      label.style.cssText += `
        background-color: #f8d7da;
        color: #721c24;
        font-weight: bold;
        padding: 4px;
        border-radius: 0px;
      `;
    }
  });
}

function disableQuestion(groupName) {
  document.querySelectorAll(`input[type="radio"][name="${groupName}"]`).forEach((radio) => {
    radio.disabled = true;
  });

  const submitButton = document.querySelector(`.mc-submit-btn[data-group="${groupName}"]`);
  if (submitButton) {
    submitButton.textContent = "Submitted ✓";
    submitButton.disabled = true;
    submitButton.style.background = "gray";
    submitButton.style.cursor = "default";
  }
}

function updateScoreDisplay() {
  const scoreElement = document.getElementById("score");
  if (scoreElement) {
    scoreElement.textContent = mcScore;
  }
}

// Handle explanation buttons
document.addEventListener('DOMContentLoaded', function() {
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
});

// Wait for Firebase auth to be ready
window.addEventListener('load', () => {
  const checkAuth = setInterval(() => {
    if (window.currentUser) {
      loadMCProgress();
      clearInterval(checkAuth);
    }
  }, 500);
  
  setTimeout(() => clearInterval(checkAuth), 10000);
});

console.log('Multiple choice Firebase script loaded for', PAGE_ID);