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
function endQuiz() {
    clearInterval(interval);
    document.getElementById("quiz").style.display = 'none';
    var report = "Wyniki : <br>";
    for (var i = 0; i < maxNum; i++) {
        report += getResult(i);
    }
    result = 0;
    for (var i = 0; i < maxNum; i++)
        result += times[i];
    report += "Wynik końcowy : " + result + "s.";
    document.getElementById("question").innerHTML = report;
    document.getElementById("save").style.display = 'inline';
    document.getElementById("stats").style.display = 'inline';
}
function initQuiz() {
    curNum = 0;
    for (var i = 0; i < maxNum; i++) {
        answers[i] = "";
        times[i] = 0;
    }
    document.getElementById("quiz").style.display = 'inline';
    document.getElementById("start").style.display = 'none';
    showQuestion(0);
    var prevButton = document.getElementById("prev");
    var nextButton = document.getElementById("next");
    var stopButton = document.getElementById("stop");
    prevButton.disabled = true;
    stopButton.disabled = true;
    nextButton.disabled = false;
    console.log("No jestem");
    curTime = 0;
    var timerElement = document.getElementById("timer");
    timerElement.innerHTML = "Minęło " + curTime + " sekund.";
    interval = setInterval(changeTimer, 1000);
}
function everyLoad() {
    document.getElementById("quiz").style.display = 'none';
    document.getElementById("stats").style.display = 'none';
    var descriptionElement = document.getElementById("question");
    descriptionElement.innerHTML = "Liczba pytań : " + maxNum + ".<br>Kary czasowe : ";
    for (var i = 0; i < maxNum; i++) {
        descriptionElement.innerHTML += quiz.questions[i].penalty + " ";
    }
}
function loadWindow() {
    everyLoad();
    var answerElement = document.getElementById("answer");
    var prevButton = document.getElementById("prev");
    var nextButton = document.getElementById("next");
    var stopButton = document.getElementById("stop");
    answerElement.onchange = changeAnswer;
    prevButton.onclick = prevQuestion;
    nextButton.onclick = nextQuestion;
    stopButton.onclick = endQuiz;
    var introElement = document.getElementById("intro");
    introElement.innerHTML = quiz.intro;
    document.getElementById("start").onclick = initQuiz;
    document.getElementById("cancel").onclick = cancelQuiz;
    document.getElementById("save").onclick = saveResult;
}
function cancelQuiz() {
    clearInterval(interval);
    document.getElementById("start").style.display = 'inline';
    everyLoad();
}
function saveResult() {
    document.getElementById("start").style.display = 'inline';
    window.localStorage.setItem('result', "1");
    console.log(window.localStorage.getItem('result'));
    everyLoad();
}
window.onload = loadWindow;
