interface Question {
	text: string;
	answer: number;
	penalty: number;
}

interface Quiz {
	intro: string;
	questions: Question[];
}

let jsonString: string = `{
	"intro": "Liczyć każdy może.",
	"questions": [
		{ "text": "1 + 2 = ?", "answer":3, "penalty":8 },
		{ "text": "8 + 4 = ?", "answer":12, "penalty":10 },
		{ "text": "7 - 2 = ?", "answer":5, "penalty":7 },
		{ "text": "21 * 37 = ?", "answer":777, "penalty":5 }
	]
}`;

let quiz: Quiz = JSON.parse(jsonString);
let curNum: number = 0;
let maxNum: number = quiz.questions.length;
let answers = new Array<string>(maxNum);
let times = new Array<number>(maxNum);
let curTime = 0;
let lastTime = 0;
let interval;

function showQuestion(id) {
	const questionElement = document.getElementById("question");
	const answerElement = document.getElementById("answer");
	const footerElement = document.getElementById("footer");
        questionElement.innerHTML = quiz.questions[id].text;
	answerElement.value = answers[id];
	footerElement.innerHTML = "Pytanie : " + (curNum + 1) + " / " + maxNum + "<br>Kara za złą odpowiedź : " + quiz.questions[curNum].penalty + " sekund(y)";
}

function disableButtons(id) {
	const prevButton = document.getElementById("prev");
	const nextButton = document.getElementById("next");

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
	for (let i = 0; i < maxNum; i++) {
		if (answers[i] === "") return false;
	}
	return true;
}

function changeAnswer() {
	const answerElement = document.getElementById("answer");
	answers[curNum] = answerElement.value;
	const stopButton = document.getElementById("stop");
	if (checkAnswers()) stopButton.disabled = false;
	else stopButton.disabled = true;
}

function changeTimer() {
	curTime++;
	const timerElement = document.getElementById("timer");
	timerElement.innerHTML = "Minęło " + curTime + " sekund.";
}

function getResult(id) {
	let report : string = (id + 1) + " : udzielona odpowiedź : " + answers[id];
	ans = Number(answers[id]);
	if(ans === quiz.questions[id].answer) {
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
	document.getElementById("prev").style.display = 'inline';
	document.getElementById("next").style.display = 'inline';
	document.getElementById("stop").style.display = 'inline';
	document.getElementById("footer").style.display = 'inline';
	document.getElementById("timer").style.display = 'inline';
	document.getElementById("answer").style.display = 'inline';
}

function endQuiz() {
	clearInterval(interval);
	hideQuiz();

	let report = "Wyniki : <br>";
	for (let i = 0; i < maxNum; i++) {
		report += getResult(i);
	}

	result = 0;
	for (let i = 0; i < maxNum; i++) result += times[i];
	report += "Wynik końcowy : " + result + "s."

	document.getElementById("question").innerHTML = report;
}

function initQuiz() {
	for (let i = 0; i < maxNum; i++) {
		answers[i] = "";
		times[i] = 0;
	}

	showQuiz();
	document.getElementById("start").style.display = 'none';
	showQuestion(0);

	const answerElement = document.getElementById("answer");
	const prevButton = document.getElementById("prev");
	const nextButton = document.getElementById("next");
	const stopButton = document.getElementById("stop");

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
	const introElement = document.getElementById("intro");
	introElement.innerHTML = quiz.intro;

	const descriptionElement = document.getElementById("question");
	descriptionElement.innerHTML = "Liczba pytań : " + maxNum + ".<br>Kary czasowe : ";
	for(let i = 0; i < maxNum; i++) {
		descriptionElement.innerHTML += quiz.questions[i].penalty + " ";
	}

	document.getElementById("start").onclick = initQuiz;
}

window.onload = loadWindow;
