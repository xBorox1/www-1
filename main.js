var jsonString = "{\n\t\"intro\": \"Liczy\u0107 ka\u017Cdy mo\u017Ce.\",\n\t\"questions\": [\n\t\t{ \"text\": \"1 + 2 = ?\", \"answer\":3 },\n\t\t{ \"text\": \"8 + 4 = ?\", \"answer\":12 },\n\t\t{ \"text\": \"7 - 2 = ?\", \"answer\":5 },\n\t\t{ \"text\": \"21 * 37 = ?\", \"answer\":777 }\n\t],\n\t\"points\": \"b\u0142\u0119dna odpowied\u017A na pytanie pierwsze to 4 sekundy, a na drugie to 10 sekund\"\n}";
var quiz = JSON.parse(jsonString);
var curNum = 0;
var maxNum = quiz.questions.length;
var answers = new Array(maxNum);
function showQuestion(id) {
    var questionElement = document.getElementById("question");
    var answerElement = document.getElementById("answer");
    questionElement.innerHTML = quiz.questions[id].text;
    answerElement.value = answers[id];
}
function checkAnswers() {
    for (var i = 0; i < maxNum; i++) {
        if (answers[i] === "")
            return false;
    }
    return true;
}
function nextQuestion() {
    console.log("1");
    var answerElement = document.getElementById("answer");
    answers[curNum] = answerElement.value;
    curNum++;
    showQuestion(curNum);
}
function prevQuestion() {
    var answerElement = document.getElementById("answer");
    answers[curNum] = answerElement.value;
    curNum--;
    showQuestion(curNum);
}
function init() {
    for (var i = 0; i < maxNum; i++) {
        answers[i] = "";
    }
    showQuestion(0);
    var introElement = document.getElementById("intro");
    var prevButton = document.getElementById("prev");
    var nextButton = document.getElementById("next");
    introElement.innerHTML = quiz.intro;
    prevButton.onclick = prevQuestion;
    nextButton.onclick = nextQuestion;
}
init();
