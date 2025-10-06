<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multiple Choice Quiz</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="quiz-container">
        <h1>Multiple Choice Quiz</h1>
        <div id="question-container">
            <p id="question"></p>
            <div id="options"></div>
            <button id="next-button">Next</button>
        </div>
        <div id="result-container" class="hidden">
            <h2>Your Score: <span id="score"></span></h2>
            <button id="restart-button">Restart Quiz</button>
        </div>
    </div>

    <script src="question.js"></script>
</body>
</html>