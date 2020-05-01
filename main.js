var jsonString = "{\n\t\"intro\": \"Liczy\u0107 ka\u017Cdy mo\u017Ce.\",\n\t\"questions\": [\n\t\t{ \"text\": \"1 + 2 = ?\", \"answer\":3, \"penalty\":8 },\n\t\t{ \"text\": \"8 + 4 = ?\", \"answer\":12, \"penalty\":10 },\n\t\t{ \"text\": \"7 - 2 = ?\", \"answer\":5, \"penalty\":7 },\n\t\t{ \"text\": \"21 * 37 = ?\", \"answer\":777, \"penalty\":5 }\n\t]\n}";
var quiz = JSON.parse(jsonString);
var curNum = 0;
var maxNum = quiz.questions.length;
var answers = new Array(maxNum);
var times = new Array(maxNum);
var curTime = 0;
var lastTime = 0;
var interval;
function showQuestion(id) {
    var questionElement = document.getElementById("question");
    var answerElement = document.getElementById("answer");
    var footerElement = document.getElementById("footer");
    questionElement.innerHTML = quiz.questions[id].text;
    answerElement.value = answers[id];
    footerElement.innerHTML = "Pytanie : " + (curNum + 1) + " / " + maxNum + "<br>Kara za złą odpowiedź : " + quiz.questions[curNum].penalty + " sekund(y)";
}
function disableButtons(id) {
    var prevButton = document.getElementById("prev");
    var nextButton = document.getElementById("next");
    if (id === 0) {
        prevButton.disabled = true;
    }
    else {
        prevButton.disabled = false;
    }
    if (id === maxNum - 1) {
        nextButton.disabled = true;
    }
    else {
        nextButton.disabled = false;
    }
}
function actTime(id) {
    times[id] += (curTime - lastTime);
    lastTime = curTime;
}
function nextQuestion() {
    actTime(curNum);
    curNum++;
    showQuestion(curNum);
    disableButtons(curNum);
}
function prevQuestion() {
    actTime(curNum);
    curNum--;
    showQuestion(curNum);
    disableButtons(curNum);
}
function checkAnswers() {
    for (var i = 0; i < maxNum; i++) {
        if (answers[i] === "")
            return false;
    }
    return true;
}
function changeAnswer() {
    var answerElement = document.getElementById("answer");
    answers[curNum] = answerElement.value;
    var stopButton = document.getElementById("stop");
    if (checkAnswers())
        stopButton.disabled = false;
    else
        stopButton.disabled = true;
}
function changeTimer() {
    curTime++;
    var timerElement = document.getElementById("timer");
    timerElement.innerHTML = "Minęło " + curTime + " sekund.";
}
function getResult(id) {
    var report = (id + 1) + " : udzielona odpowiedź : " + answers[id];
    ans = Number(answers[id]);
    if (ans === quiz.questions[id].answer) {
        report += '<span class="correct"> poprawna </span>';
    }
    else {
        report += '<span class="incorrect"> niepoprawna </span>, prawidłowa : ' + quiz.questions[id].answer;
        times[id] += quiz.questions[id].penalty;
    }
    report += ", czas : " + times[id];
    report += "s.<br>";
    return report;
}
function hideQuiz() {
    document.getElementById("prev").style.display = 'none';
    document.getElementById("next").style.display = 'none';
    document.getElementById("stop").style.display = 'none';
    document.getElementById("footer").style.display = 'none';
    document.getElementById("timer").style.display = 'none';
    document.getElementById("answer").style.display = 'none';
}
function showQuiz() {
    document.getElementById("prev").style.display = 'block';
    document.getElementById("next").style.display = 'block';
    document.getElementById("stop").style.display = 'block';
    document.getElementById("footer").style.display = 'block';
    document.getElementById("timer").style.display = 'block';
    document.getElementById("answer").style.display = 'block';
}
function endQuiz() {
    clearInterval(interval);
    hideQuiz();
    var report = "Wyniki : <br>";
    for (var i = 0; i < maxNum; i++) {
        report += getResult(i);
    }
    result = 0;
    for (var i = 0; i < maxNum; i++)
        result += times[i];
    report += "Wynik końcowy : " + result + "s.";
    document.getElementById("question").innerHTML = report;
}
function initQuiz() {
    for (var i = 0; i < maxNum; i++) {
        answers[i] = "";
        times[i] = 0;
    }
    showQuestion(0);
    var answerElement = document.getElementById("answer");
    var prevButton = document.getElementById("prev");
    var nextButton = document.getElementById("next");
    var stopButton = document.getElementById("stop");
    answerElement.onchange = changeAnswer;
    prevButton.onclick = prevQuestion;
    nextButton.onclick = nextQuestion;
    stopButton.onclick = endQuiz;
    prevButton.disabled = true;
    stopButton.disabled = true;
    interval = setInterval(changeTimer, 1000);
}
function loadWindow() {
    hideQuiz();
    var introElement = document.getElementById("intro");
    introElement.innerHTML = quiz.intro;
    var descriptionElement = document.getElementById("question");
    descriptionElement.innerHTML = "Liczba pytań : " + maxNum + ".";
}
window.onload = loadWindow;
