const quizData = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctAnswer: "Mars"
    },
    {
      question: "Who wrote 'To Kill a Mockingbird'?",
      options: ["Harper Lee", "Mark Twain", "F. Scott Fitzgerald", "Ernest Hemingway"],
      correctAnswer: "Harper Lee"
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: "Pacific Ocean"
    },
    {
      question: "What is the chemical symbol for water?",
      options: ["O2", "CO2", "H2O", "NaCl"],
      correctAnswer: "H2O"
    }
];
let currentQn = 0;
let currentAns;
let score = 0;
let $qnDiv = document.querySelector('.question');
let $scoreElem = document.querySelector('.score');

function setQuestion(qIndex){
    if(qIndex < quizData.length){
      $qnDiv.textContent = `Question ${qIndex + 1} of ${quizData.length}: ${quizData[qIndex].question}`;
      $qnDiv.setAttribute('qID', qIndex);
      let count = 0;
      for (let i = 0; i < 4; i++) {
        let $ansItem = document.createElement('div');
        $ansItem.classList.add('item');
        $ansItem.textContent = quizData[qIndex].options[count++];
        $ansItem.style.backgroundColor = 'white';
        document.querySelector('.answer').appendChild($ansItem);
      }
      let $ansItem = document.querySelector('.')
      $ansItem.forEach(element => {
          element.textContent = quizData[qIndex].options[count++];
          element.style.backgroundColor = 'white';
      });
      $scoreElem.textContent = `Score : ${score} / ${quizData.length}`;
    }
    else{
      let $finalScoreDiv = document.createElement('div');
      $finalScoreDiv.classList.add('final-score');
      $finalScoreDiv.textContent = `You Scored : ${score}`;
      let $ansElem = document.querySelector('.answer');
      $ansElem.innerHTML = '';
      $ansElem.appendChild($finalScoreDiv);
      $qnDiv.textContent = `Game Over!!!`
      document.querySelector('.score').remove();
      let $restart = document.querySelector('.restart');
      $restart.textContent = `Play Again..`;
      $restart.addEventListener('click', () => {
        currentQn = 0;
        setQuestion(currentQn);
      })
    }
}
setQuestion(currentQn);

document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', function() {
    if(currentAns){
      currentAns.style.backgroundColor = 'white';
    }
    currentAns = this;
    this.style.backgroundColor = '#6abdff';
  });
});

document.querySelector('.go-next').addEventListener('click', () => {
  if(quizData[$qnDiv.getAttribute('qid')].correctAnswer === currentAns.textContent){
    score++;
    setScore();
  }
  setQuestion(++currentQn);
});


function setScore(){
  $scoreElem.textContent = `Score : ${score} / ${quizData.length}`;
}




  