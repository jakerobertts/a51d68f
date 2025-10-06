### Step 1: Create the HTML Structure

Create an HTML file named `quiz.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multiple Choice Quiz</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .question-container {
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .button {
            margin-top: 20px;
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>

<div class="question-container" id="question-container">
    <h2 id="question"></h2>
    <div id="options"></div>
    <button class="button" id="next-button">Next</button>
</div>

<script>
    const questions = [
        {
            question: "Which of the following is NOT a vector?",
            options: ["Velocity", "Speed", "Displacement", "Force"],
            answer: 1 // Index of the correct answer
        },
        {
            question: "Which of the following is a scalar?",
            options: ["Velocity", "Acceleration", "Temperature", "Displacement"],
            answer: 2
        },
        {
            question: "Which method involves placing the tail of one vector at the tip of another to find the resultant?",
            options: ["Tip-to-tail method", "Parallelogram method", "Component method", "Cross product method"],
            answer: 0
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    function loadQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        document.getElementById('question').innerText = currentQuestion.question;
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';

        currentQuestion.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.innerHTML = `<input type="radio" name="option" value="${index}"> ${option}`;
            optionsContainer.appendChild(optionElement);
        });
    }

    function showScore() {
        document.getElementById('question-container').innerHTML = `<h2>Your Score: ${score} out of ${questions.length}</h2>`;
    }

    document.getElementById('next-button').addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="option"]:checked');
        if (selectedOption) {
            const answerIndex = parseInt(selectedOption.value);
            if (answerIndex === questions[currentQuestionIndex].answer) {
                score++;
            }
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                showScore();
            }
        } else {
            alert('Please select an answer before proceeding.');
        }
    });

    loadQuestion();
</script>

</body>
</html>
```

### Explanation of the Code

1. **HTML Structure**: The HTML consists of a container for the question and options, and a button to proceed to the next question.

2. **CSS Styles**: Basic styles are applied to make the quiz visually appealing.

3. **JavaScript Logic**:
   - An array of questions is defined, where each question has a text, options, and the index of the correct answer.
   - The `loadQuestion` function displays the current question and its options.
   - The `showScore` function displays the user's score at the end of the quiz.
   - An event listener on the "Next" button checks if an option is selected, updates the score if the answer is correct, and loads the next question or shows the score if the quiz is finished.

### How to Use

1. Save the code above in a file named `quiz.html`.
2. Open the file in a web browser.
3. Answer the questions and click "Next" to proceed through the quiz.
4. At the end, your score will be displayed.

You can expand this by adding more questions, improving the UI, or even storing the results in a database if needed.