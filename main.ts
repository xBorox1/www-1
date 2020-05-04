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
	curTime += 0.1;
	curTime = Math.round(curTime * 10) / 10;
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
		report += ', kara : ' + quiz.questions[id].penalty + "s";
		times[id] += quiz.questions[id].penalty;
	}
	times[id] = Math.round(times[id] * 10) / 10;
	report += ", czas : " + times[id];
	report += "s.<br>";
	return report;
}

function endQuiz() {
	actTime(curNum);
	clearInterval(interval);
	document.getElementById("quiz").style.display = 'none';
	document.getElementById("chbox").checked = false;

	let report = "Wyniki : <br>";
	for (let i = 0; i < maxNum; i++) {
		report += getResult(i);
	}

	result = 0;
	for (let i = 0; i < maxNum; i++) result += times[i];
	result = Math.round(10 * result) / 10;
	report += "Wynik końcowy : " + result + "s."

	document.getElementById("question").innerHTML = report;
	document.getElementById("save").style.display = 'inline';
	document.getElementById("stats").style.display = 'inline';
}

function initQuiz() {
	curNum = 0;
	for (let i = 0; i < maxNum; i++) {
		answers[i] = "";
		times[i] = 0;
	}

	document.getElementById("quiz").style.display = 'inline';
	document.getElementById("start").style.display = 'none';
	document.getElementById("storage").style.display = 'none';
	showQuestion(0);

	const prevButton = document.getElementById("prev");
	const nextButton = document.getElementById("next");
	const stopButton = document.getElementById("stop");

	prevButton.disabled = true;
	stopButton.disabled = true;
	nextButton.disabled = false;

	curTime = 0;
	lastTime = 0;
	const timerElement = document.getElementById("timer");
	timerElement.innerHTML = "Minęło " + curTime + " sekund.";
	interval = setInterval(changeTimer, 100);
}

function getResultFromString(str) {
	let i = 0;
	while(str[i] !== 's') i++;
	return Number(str.substring(0, i));
}

function everyLoad() {
	document.getElementById("quiz").style.display = 'none';
	document.getElementById("stats").style.display = 'none';
	document.getElementById("storage").style.display = 'inline';

	const descriptionElement = document.getElementById("question");
	descriptionElement.innerHTML = "Liczba pytań : " + maxNum + ".<br>Kary czasowe : ";
	for(let i = 0; i < maxNum; i++) {
		descriptionElement.innerHTML += quiz.questions[i].penalty + " ";
	}

	let results = new Array<[number, number]>();

	for(let i=0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		results[i] = [getResultFromString(localStorage[key]), key];
	}
	results = results.sort((x, y) => x[0] - y[0]);

	const listElement = document.getElementById("storage-list");
	listElement.innerHTML = "";

	for(let i=0; i < Math.min(localStorage.length, 5); i++) {
		listElement.innerHTML += "<li> " + localStorage[results[i][1]] + "</li>";
	}
}

function loadWindow() {
	everyLoad();
	const answerElement = document.getElementById("answer");
	const prevButton = document.getElementById("prev");
	const nextButton = document.getElementById("next");
	const stopButton = document.getElementById("stop");

	answerElement.onchange = changeAnswer;
	prevButton.onclick = prevQuestion;
	nextButton.onclick = nextQuestion;
	stopButton.onclick = endQuiz;

	const introElement = document.getElementById("intro");
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

	let saved = String(result) + "s";
	if (document.getElementById("chbox").checked) {
		saved += " : ";
		for (let i = 0; i < maxNum; i++) {
			saved += String((i + 1) + " - " + String(times[i]) + "s, ");
		}
	}
	localStorage.setItem(String(localStorage.length), saved);

	everyLoad();
}

window.onload = loadWindow;
