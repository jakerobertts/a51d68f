let mcScore = 0;
let totalMCQuestions = 0;
let answeredQuestions = new Set();
const PAGE_ID = window.location.pathname
  .split("/")
  .pop()
  .replace(".html", "");

// Initialize individual multiple choice questions
document.addEventListener("DOMContentLoaded", function () {
  initializeIndividualMC();
  loadMCProgress();
  
  // Add reset progress button
  addResetProgressButton();
});

function initializeIndividualMC() {
  const radioGroups = getUniqueRadioGroups();
  totalMCQuestions = radioGroups.length;

  // Update total display
  const totalElement = document.getElementById("total");
  if (totalElement) {
    totalElement.textContent = totalMCQuestions;
  }

  // Add submit button for each question group
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
  // Find the last radio button of this group
  const radios = document.querySelectorAll(
    `input[type="radio"][name="${groupName}"]`
  );
  const lastRadio = radios[radios.length - 1];

  if (!lastRadio) return;

  // Create line breaks for spacing
  const lineBreak1 = document.createElement("br");
  const lineBreak2 = document.createElement("br");

  // Create submit button
  const submitButton = document.createElement("button");
  submitButton.className = "mc-submit-btn";
  submitButton.setAttribute("data-group", groupName);
  submitButton.textContent = "Confirm";
  submitButton.style.cssText = `
    background:rgb(224, 224, 224);
    color: night;
    border: 1px solid #ccc;
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

  // Insert after the last radio button's label with proper spacing
  const lastLabel = lastRadio.closest("label") || lastRadio.parentElement;
  lastLabel.parentNode.insertBefore(lineBreak1, lastLabel.nextSibling);
  lastLabel.parentNode.insertBefore(submitButton, lineBreak1.nextSibling);
  lastLabel.parentNode.insertBefore(lineBreak2, submitButton.nextSibling);
}

function addResetProgressButton() {
  // Create reset button
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset All Progress";
resetButton.style.cssText = `
    background:rgb(106, 105, 105);
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 14px;
    font-family: system-ui;
    border-radius: 6px;
    cursor: pointer;
    margin: 40px auto 0 auto;
    display: block;
    transition: background 0.3s ease;
`;

  // Add hover effect
  resetButton.addEventListener("mouseenter", function() {
    this.style.background = "#0056b3";
  });
  
  resetButton.addEventListener("mouseleave", function() {
    this.style.background = "#007bff";
  });

  resetButton.addEventListener("click", function () {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      resetAllProgress();
    }
  });

  document.body.appendChild(resetButton);
}

function resetAllProgress() {
  // Clear localStorage for this page
  const progressKey = `quizProgress_${PAGE_ID}`;
  const correctnessKey = `questionCorrectness_${PAGE_ID}`;
  const incorrectKey = `incorrectTerms_${PAGE_ID}`;
  
  localStorage.removeItem(progressKey);
  localStorage.removeItem(correctnessKey);
  localStorage.removeItem(incorrectKey);

  // Reset variables
  mcScore = 0;
  answeredQuestions.clear();

  // Reset all questions visually
  getUniqueRadioGroups().forEach(groupName => {
    resetIndividualQuestion(groupName);
  });

  updateScoreDisplay();
  console.log("All progress reset for", PAGE_ID);
}

function submitIndividualQuestion(groupName) {
  // Get selected answer
  const selectedRadio = document.querySelector(
    `input[type="radio"][name="${groupName}"]:checked`
  );

  if (!selectedRadio) {
    alert("Please select an answer before submitting.");
    return;
  }

  const userAnswer = selectedRadio.value;
  const correctAnswer = getCorrectAnswerForGroup(groupName);
  const isCorrect = userAnswer === correctAnswer;

  // Convert group name to question ID
  const questionId = groupName; // Use just the group name (q1, q2, etc.)

  // Update score and answered questions
  if (!answeredQuestions.has(questionId)) {
    // First time answering this question
    answeredQuestions.add(questionId);
    if (isCorrect) {
      mcScore++;
    }
  } else {
    // Already answered, check if we need to update score
    const wasCorrectBefore = checkIfPreviouslyCorrect(questionId);
    if (wasCorrectBefore && !isCorrect) {
      mcScore--; // Was correct, now wrong
    } else if (!wasCorrectBefore && isCorrect) {
      mcScore++; // Was wrong, now correct
    }
  }

  // Store the correctness of this answer
  storeAnswerCorrectness(questionId, isCorrect);

  updateScoreDisplay();

  // Show visual feedback
  showQuestionResult(groupName, userAnswer, correctAnswer, isCorrect);

  // Update the data-quiz span to show result
  updateDataQuizSpan(groupName, userAnswer, correctAnswer, isCorrect);

  // Disable this question's radios and submit button
  disableQuestion(groupName);

  // Save progress immediately
  saveMCProgress();

  // Save incorrect answer if wrong
  if (!isCorrect) {
    saveIncorrectAnswer(groupName, userAnswer, correctAnswer);
  }

  console.log(`Question ${questionId}: ${isCorrect ? 'Correct' : 'Incorrect'}, Score: ${mcScore}/${answeredQuestions.size}`);
}

function checkIfPreviouslyCorrect(questionId) {
  const key = `questionCorrectness_${PAGE_ID}`;
  const stored = JSON.parse(localStorage.getItem(key) || "{}");
  return stored[questionId] === true;
}

function storeAnswerCorrectness(questionId, isCorrect) {
  const key = `questionCorrectness_${PAGE_ID}`;
  const stored = JSON.parse(localStorage.getItem(key) || "{}");
  stored[questionId] = isCorrect;
  localStorage.setItem(key, JSON.stringify(stored));
}

function getCorrectAnswerForGroup(groupName) {
  const answerSpan = findCorrectAnswerSpan(groupName);
  return answerSpan ? answerSpan.getAttribute("data-quiz") : null;
}

function findCorrectAnswerSpan(groupName) {
  // Find the first radio button of this group
  const firstRadio = document.querySelector(
    `input[type="radio"][name="${groupName}"]`
  );
  if (!firstRadio) return null;

  // Look backwards from the radio group to find the data-quiz span
  let currentElement = firstRadio.parentElement;
  while (currentElement && currentElement !== document.body) {
    let prevElement = currentElement.previousElementSibling;
    while (prevElement) {
      if (
        prevElement.hasAttribute &&
        prevElement.hasAttribute("data-quiz")
      ) {
        return prevElement;
      }
      const spanInside = prevElement.querySelector
        ? prevElement.querySelector("[data-quiz]")
        : null;
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

  // Store original content if not already stored
  if (!answerSpan.hasAttribute("data-original-content")) {
    answerSpan.setAttribute("data-original-content", answerSpan.innerHTML);
  }

  // Update the span to show the result
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

  answerSpan.style.padding = "4px 8px";
  answerSpan.style.borderRadius = "0px";
  answerSpan.style.fontWeight = "bold";
  answerSpan.style.display = "inline-block";
  answerSpan.style.margin = "2px";

  // Add a reset button
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
  // Style the radio buttons
  document
    .querySelectorAll(`input[type="radio"][name="${groupName}"]`)
    .forEach((radio) => {
      const label = radio.closest("label") || radio.parentElement;

      if (radio.value === correctAnswer) {
        // Correct answer - always green
        label.style.backgroundColor = "#d4edda";
        label.style.color = "#155724";
        label.style.fontWeight = "bold";
        label.style.padding = "4px";
        label.style.borderRadius = "0px";
        label.style.border = ""; // Remove border
      } else if (radio.value === userAnswer && !isCorrect) {
        // User's wrong answer - red
        label.style.backgroundColor = "#f8d7da";
        label.style.color = "#721c24";
        label.style.fontWeight = "bold";
        label.style.padding = "4px";
        label.style.borderRadius = "0px";
        label.style.border = ""; // Remove border
      }
    });
}

function disableQuestion(groupName) {
  // Disable radio buttons
  document
    .querySelectorAll(`input[type="radio"][name="${groupName}"]`)
    .forEach((radio) => {
      radio.disabled = true;
    });

  // Update submit button
  const submitButton = document.querySelector(
    `.mc-submit-btn[data-group="${groupName}"]`
  );
  if (submitButton) {
    submitButton.textContent = "Submitted ✓";
    submitButton.disabled = true;
    submitButton.style.background = "#f1f1f1";
    submitButton.style.color = "black";
    submitButton.style.cursor = "default";
    submitButton.style.fontFamily = "Verdana, sans-serif";
  }
}

function resetIndividualQuestion(groupName) {
  const questionId = groupName;

  // Remove from answered questions
  if (answeredQuestions.has(questionId)) {
    // Check if this was correct and adjust score
    if (checkIfPreviouslyCorrect(questionId)) {
      mcScore--;
    }
    answeredQuestions.delete(questionId);
    
    // Remove from correctness tracking
    const key = `questionCorrectness_${PAGE_ID}`;
    const stored = JSON.parse(localStorage.getItem(key) || "{}");
    delete stored[questionId];
    localStorage.setItem(key, JSON.stringify(stored));
    
    updateScoreDisplay();
  }

  // Re-enable radio buttons
  document
    .querySelectorAll(`input[type="radio"][name="${groupName}"]`)
    .forEach((radio) => {
      radio.disabled = false;
      radio.checked = false;
      const label = radio.closest("label") || radio.parentElement;
      label.style.backgroundColor = "";
      label.style.color = "";
      label.style.fontWeight = "";
      label.style.padding = "";
      label.style.borderRadius = "";
      label.style.border = "";
    });

  // Reset submit button
  const submitButton = document.querySelector(
    `.mc-submit-btn[data-group="${groupName}"]`
  );
  if (submitButton) {
    submitButton.textContent = "Confirm";
    submitButton.disabled = false;
    submitButton.style.background = "#e0e0e0";
    submitButton.style.cursor = "pointer";
  }

  // Reset data-quiz span
  const answerSpan = findCorrectAnswerSpan(groupName);
  if (answerSpan) {
    const originalContent = answerSpan.getAttribute("data-original-content");
    if (originalContent) {
      answerSpan.innerHTML = originalContent;
    }
    answerSpan.style.backgroundColor = "";
    answerSpan.style.color = "";
    answerSpan.style.border = "";
    answerSpan.style.padding = "";
    answerSpan.style.borderRadius = "";
    answerSpan.style.fontWeight = "";
    answerSpan.style.display = "none"; // Hide again
    answerSpan.style.margin = "";
    answerSpan.classList.remove("revealed", "incorrect");
  }

  // Save progress
  saveMCProgress();
}

function updateScoreDisplay() {
  const scoreElement = document.getElementById("score");
  if (scoreElement) {
    scoreElement.textContent = mcScore;
  }
}

function saveIncorrectAnswer(groupName, userAnswer, correctAnswer) {
  const pageId = PAGE_ID || window.location.pathname.split("/").pop().replace(".html", "");
  const key = `incorrectTerms_${pageId}`;
  let arr = JSON.parse(localStorage.getItem(key) || "[]");

  const questionData = {
    question: `${groupName}: Multiple Choice Question`,
    answer: correctAnswer,
    userAnswer: userAnswer,
    timestamp: Date.now(),
    type: "multiple_choice",
  };

  const existingIndex = arr.findIndex(
    (item) => item.question === questionData.question
  );
  if (existingIndex === -1) {
    arr.push(questionData);
  } else {
    arr[existingIndex] = questionData;
  }
  localStorage.setItem(key, JSON.stringify(arr));
  console.log(`Saved incorrect answer for ${groupName} to localStorage`);
}

function saveMCProgress() {
  const progress = {
    score: mcScore,
    answeredQuestions: Array.from(answeredQuestions),
    timestamp: Date.now(),
    totalQuestions: totalMCQuestions
  };
  
  const key = `quizProgress_${PAGE_ID}`;
  localStorage.setItem(key, JSON.stringify(progress));
  console.log(`Saved progress to ${key}:`, progress);
}

function loadMCProgress() {
  const key = `quizProgress_${PAGE_ID}`;
  const correctnessKey = `questionCorrectness_${PAGE_ID}`;
  const saved = localStorage.getItem(key);
  const correctnessData = JSON.parse(localStorage.getItem(correctnessKey) || "{}");
  
  if (saved) {
    try {
      const progress = JSON.parse(saved);
      mcScore = progress.score || 0;
      answeredQuestions = new Set(progress.answeredQuestions || []);

      updateScoreDisplay();
      console.log(`Loaded progress from ${key}:`, progress);

      // Restore visual state for answered questions
      answeredQuestions.forEach(questionId => {
        const groupName = questionId; // Since we use groupName as questionId
        const wasCorrect = correctnessData[questionId] === true;
        const correctAnswer = getCorrectAnswerForGroup(groupName);
        
        if (correctAnswer) {
          // Show the question as already answered
          const answerSpan = findCorrectAnswerSpan(groupName);
          if (answerSpan) {
            // Store original content
            if (!answerSpan.hasAttribute("data-original-content")) {
              answerSpan.setAttribute("data-original-content", answerSpan.innerHTML);
            }
            
            // Show result
            if (wasCorrect) {
              answerSpan.innerHTML = `${correctAnswer} ✓`;
              answerSpan.style.backgroundColor = "#d4edda";
              answerSpan.style.color = "#155724";
              answerSpan.style.border = "1px solid #28a745";
              answerSpan.classList.add("revealed");
            } else {
              // For incorrect answers, we might not have the user's answer stored
              answerSpan.innerHTML = `${correctAnswer} (Previously answered incorrectly)`;
              answerSpan.style.backgroundColor = "#f8d7da";
              answerSpan.style.color = "#721c24";
              answerSpan.style.border = "1px solid #dc3545";
              answerSpan.classList.add("incorrect");
            }
            
            answerSpan.style.padding = "4px 8px";
            answerSpan.style.borderRadius = "0px";
            answerSpan.style.fontWeight = "bold";
            answerSpan.style.display = "inline-block";
            answerSpan.style.margin = "2px";

            // Add reset button
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
          
          // Disable the question
          disableQuestion(groupName);
          
          // Style the correct answer
          document.querySelectorAll(`input[type="radio"][name="${groupName}"]`).forEach((radio) => {
            const label = radio.closest("label") || radio.parentElement;
            if (radio.value === correctAnswer) {
              label.style.backgroundColor = "#d4edda";
              label.style.color = "#155724";
              label.style.fontWeight = "bold";
              label.style.padding = "4px";
              label.style.border = ""; // Remove border
            }
          });
        }
      });
      
    } catch (e) {
      console.error("Error loading progress:", e);
    }
  }
  
  // Handle explanation buttons
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
}

// In your quiz JavaScript (test.js or inline), when a quiz is completed:
function saveQuizCompletion(pageId, score, totalQuestions) {
  const key = `quizProgress_${pageId}`;
  const existing = JSON.parse(localStorage.getItem(key) || '{}');
  
  const now = new Date();
  
  const updatedProgress = {
    ...existing,
    score: score,
    totalQuestions: totalQuestions,
    answeredQuestions: existing.answeredQuestions || [],
    lastCompleted: now.toISOString(),
    completionCount: (existing.completionCount || 0) + 1,
    completionHistory: [
      ...(existing.completionHistory || []),
      {
        date: now.toISOString(),
        score: score,
        totalQuestions: totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100)
      }
    ].slice(-10) // Keep last 10 completions
  };
  
  localStorage.setItem(key, JSON.stringify(updatedProgress));
}

// Debug function to check localStorage
function debugStorage() {
  console.log("=== DEBUG STORAGE ===");
  console.log("PAGE_ID:", PAGE_ID);
  console.log("Current mcScore:", mcScore);
  console.log("Current answeredQuestions:", Array.from(answeredQuestions));
  
  const progressKey = `quizProgress_${PAGE_ID}`;
  const progress = localStorage.getItem(progressKey);
  console.log(`Storage key: ${progressKey}`);
  console.log("Stored progress:", progress);
  
  const correctnessKey = `questionCorrectness_${PAGE_ID}`;
  const correctness = localStorage.getItem(correctnessKey);
  console.log(`Correctness key: ${correctnessKey}`);
  console.log("Stored correctness:", correctness);
}

// Call this in console to debug: debugStorage()
window.debugStorage = debugStorage;