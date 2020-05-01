interface Question {
	text: string;
	answer: number;
}

interface Quiz {
	intro: string;
	questions: Question[];
	points: string;
}

let jsonString: string = `{
	"intro": "Liczyć każdy może.",
	"questions": [
		{ "text": "1 + 2 = ?", "answer":3 },
		{ "text": "8 + 4 = ?", "answer":12 },
		{ "text": "7 - 2 = ?", "answer":5 },
		{ "text": "21 * 37 = ?", "answer":777 }
	],
	"points": "błędna odpowiedź na pytanie pierwsze to 4 sekundy, a na drugie to 10 sekund"
}`;

let quiz: Quiz = JSON.parse(jsonString);
let curNum: number = 0;
let maxNum: number = quiz.questions.length;
let answers = new Array<string>(maxNum);

function showQuestion(id) {
	const questionElement = document.getElementById("question");
	const answerElement = document.getElementById("answer");
        questionElement.innerHTML = quiz.questions[id].text;
	answerElement.value = answers[id];
}

function checkAnswers() {
	for (let i = 0; i < maxNum; i++) {
		if (answers[i] === "") return false;
	}
	return true;
}

function nextQuestion() {
	console.log("1");
	const answerElement = document.getElementById("answer");
	answers[curNum] = answerElement.value;
	curNum++;
	showQuestion(curNum);
}

function prevQuestion() {
	const answerElement = document.getElementById("answer");
	answers[curNum] = answerElement.value;
	curNum--;
	showQuestion(curNum);
}

function init() {
	for (let i = 0; i < maxNum; i++) {
		answers[i] = "";
	}
	showQuestion(0);

	const introElement = document.getElementById("intro");
	const prevButton = document.getElementById("prev");
	const nextButton = document.getElementById("next");

	introElement.innerHTML = quiz.intro;
	prevButton.onclick = prevQuestion;
	nextButton.onclick = nextQuestion;
}

init();
