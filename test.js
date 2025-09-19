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
      });

      function initializeIndividualMC() {
        const radioGroups = getUniqueRadioGroups();
        totalMCQuestions = radioGroups.length;

        // Update total display
        document.getElementById("total").textContent = totalMCQuestions;

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

        // Insert after the last radio button's label with proper spacing
        const lastLabel = lastRadio.closest("label") || lastRadio.parentElement;
        lastLabel.parentNode.insertBefore(lineBreak1, lastLabel.nextSibling);
        lastLabel.parentNode.insertBefore(submitButton, lineBreak1.nextSibling);
        lastLabel.parentNode.insertBefore(lineBreak2, submitButton.nextSibling);
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

        // Update score if this is the first time answering correctly
        const questionId = `mc_${groupName}`;
        if (isCorrect && !answeredQuestions.has(questionId)) {
          mcScore++;
          answeredQuestions.add(questionId);
          updateScoreDisplay();
        } else if (!isCorrect && !answeredQuestions.has(questionId)) {
          // Mark as attempted even if wrong
          answeredQuestions.add(questionId);
        }

        // Show visual feedback
        showQuestionResult(groupName, userAnswer, correctAnswer, isCorrect);

        // Update the data-quiz span to show result
        updateDataQuizSpan(groupName, userAnswer, correctAnswer, isCorrect);

        // Disable this question's radios and submit button
        disableQuestion(groupName);

        // Save progress
        saveMCProgress();

        // Save incorrect answer if wrong
        if (!isCorrect) {
          saveIncorrectAnswer(groupName, userAnswer, correctAnswer);
        }
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

      function updateDataQuizSpan(
        groupName,
        userAnswer,
        correctAnswer,
        isCorrect
      ) {
        const answerSpan = findCorrectAnswerSpan(groupName);
        if (!answerSpan) return;

        // Store original content if not already stored
        if (!answerSpan.hasAttribute("data-original-content")) {
          answerSpan.setAttribute(
            "data-original-content",
            answerSpan.innerHTML
          );
        }

        // Update the span to show the result like a data-quiz element
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
        answerSpan.style.borderRadius = "4px";
        answerSpan.style.fontWeight = "bold";
        answerSpan.style.display = "inline-block";
        answerSpan.style.margin = "2px";

        // Add a reset button like in the main script
        const resetButton = document.createElement("button");
        resetButton.textContent = "click to reset";
        resetButton.className = "try-again";
        resetButton.style.cssText = `
    background: transparent;
    border: none;
    color: #666;
    cursor: pointer;
    margin-left: 5px;
    font-size: 14px;
    padding: 2px 4px;
  `;

        resetButton.addEventListener("click", function () {
          resetIndividualQuestion(groupName);
        });

        answerSpan.appendChild(resetButton);
      }

      function showQuestionResult(
        groupName,
        userAnswer,
        correctAnswer,
        isCorrect
      ) {
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
              label.style.borderRadius = "4px";
            } else if (radio.value === userAnswer && !isCorrect) {
              // User's wrong answer - red
              label.style.backgroundColor = "#f8d7da";
              label.style.color = "#721c24";
              label.style.fontWeight = "bold";
              label.style.padding = "4px";
              label.style.borderRadius = "4px";
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
          submitButton.textContent = "Submitted";
          submitButton.disabled = true;
          submitButton.style.background = "#6a11cb";
        }
      }

      function resetIndividualQuestion(groupName) {
        const questionId = `mc_${groupName}`;

        // Remove from answered questions and update score
        if (answeredQuestions.has(questionId)) {
          answeredQuestions.delete(questionId);

          // Check if this was a correct answer that contributed to the score
          const correctAnswer = getCorrectAnswerForGroup(groupName);
          const selectedRadio = document.querySelector(
            `input[type="radio"][name="${groupName}"]:checked`
          );
          if (
            selectedRadio &&
            selectedRadio.value === correctAnswer &&
            mcScore > 0
          ) {
            mcScore--;
            updateScoreDisplay();
          }
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
          submitButton.textContent = "Submit Answer";
          submitButton.disabled = false;
          submitButton.style.background = "#6a11cb";
        }

        // Reset data-quiz span
        const answerSpan = findCorrectAnswerSpan(groupName);
        if (answerSpan) {
          const originalContent = answerSpan.getAttribute(
            "data-original-content"
          );
          if (originalContent) {
            answerSpan.innerHTML = originalContent;
          }
          answerSpan.style.backgroundColor = "";
          answerSpan.style.color = "";
          answerSpan.style.border = "";
          answerSpan.style.padding = "";
          answerSpan.style.borderRadius = "";
          answerSpan.style.fontWeight = "";
          answerSpan.style.display = "";
          answerSpan.style.margin = "";
          answerSpan.classList.remove("revealed", "incorrect");
        }

        // Save progress
        saveMCProgress();
      }

      function updateScoreDisplay() {
        document.getElementById("score").textContent = mcScore;
      }

      function saveIncorrectAnswer(groupName, userAnswer, correctAnswer) {
        const pageId =
          PAGE_ID ||
          window.location.pathname.split("/").pop().replace(".html", "");
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
      }

      function saveMCProgress() {
        const progress = {
          score: mcScore,
          answeredQuestions: Array.from(answeredQuestions),
          timestamp: Date.now(),
        };
        localStorage.setItem(`mcProgress_${PAGE_ID}`, JSON.stringify(progress));
      }

      function loadMCProgress() {
        const saved = localStorage.getItem(`mcProgress_${PAGE_ID}`);
        if (saved) {
          const progress = JSON.parse(saved);
          mcScore = progress.score || 0;
          answeredQuestions = new Set(progress.answeredQuestions || []);

          updateScoreDisplay();

          // Note: We don't restore the visual state here since each question
          // needs to be submitted individually to show results
        }
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