<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Question 1</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="question-container">
        <h1>Question 1</h1>
        <p>Which of the following is NOT a vector?</p>
        <form id="question1">
            <label><input type="radio" name="answer" value="A"> A. Velocity</label><br>
            <label><input type="radio" name="answer" value="B"> B. Speed</label><br>
            <label><input type="radio" name="answer" value="C"> C. Displacement</label><br>
            <label><input type="radio" name="answer" value="D"> D. Force</label><br><br>
            <button type="button" onclick="submitAnswer(1)">Next</button>
        </form>
    </div>
    <script>
        function submitAnswer(questionNumber) {
            const form = document.getElementById(`question${questionNumber}`);
            const selectedAnswer = form.answer.value;
            localStorage.setItem(`answer${questionNumber}`, selectedAnswer);
            window.location.href = 'question2.html';
        }
    </script>
</body>
</html>