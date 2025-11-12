document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quiz-container");
  const resultsSummary = document.getElementById("results-summary");
  const startBtn = document.getElementById("start-btn");

  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let userAnswers = [];

  startBtn.addEventListener("click", startQuiz);

  function startQuiz() {
    quizContainer.innerHTML = `
      <p class="text-muted">Cargando preguntas...</p>
      <div class="spinner-border text-primary" role="status"></div>
    `;

    fetch("questions.json")
      .then(response => {
        if (!response.ok) throw new Error("Error al cargar las preguntas");
        return response.json();
      })
      .then(data => {
        questions = data;
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        showQuestion();
      })
      .catch(error => {
        quizContainer.innerHTML = `
          <div class="alert alert-danger" role="alert">
             ${error.message}
          </div>
        `;
      });
  }

  function showQuestion() {
    const q = questions[currentQuestionIndex];
    quizContainer.innerHTML = `
      <h4 class="mb-3">${q.text}</h4>
      <form id="quiz-form" class="text-start mb-3">
        ${q.options
          .map(
            opt => `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="answer" id="${opt.id}" value="${opt.id}">
            <label class="form-check-label" for="${opt.id}">${opt.text}</label>
          </div>
        `
          )
          .join("")}
      </form>
      <button id="next-btn" class="btn btn-primary mt-3">
        ${currentQuestionIndex === questions.length - 1 ? "Finalizar" : "Siguiente"}
      </button>
    `;

    document.getElementById("next-btn").addEventListener("click", handleNext);
  }

  function handleNext() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
      alert("Selecciona una respuesta antes de continuar.");
      return;
    }

    const answer = selected.value;
    const currentQuestion = questions[currentQuestionIndex];
    userAnswers.push({
      question: currentQuestion.text,
      selected: answer,
      correct: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation
    });

    if (answer === currentQuestion.correctAnswer) {
      score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }

  function showResults() {
    quizContainer.innerHTML = `
      <h3 class="text-success"> ¡Has completado el quiz!</h3>
      <p class="mt-2">Tu puntuación: <strong>${score} / ${questions.length}</strong></p>
    `;

    const incorrect = userAnswers.filter(q => q.selected !== q.correct);
    if (incorrect.length > 0) {
      let explanationsHTML = `
        <h5 class="mt-4"> Explicaciones de las respuestas incorrectas:</h5>
      `;
      incorrect.forEach(q => {
        explanationsHTML += `
          <div class="alert alert-warning mt-2">
            <strong>Pregunta:</strong> ${q.question}<br>
            <strong>Tu respuesta:</strong> ${q.selected}<br>
            <strong>Respuesta correcta:</strong> ${q.correct}<br>
            <em>${q.explanation}</em>
          </div>
        `;
      });
      resultsSummary.innerHTML = explanationsHTML;
    } else {
      resultsSummary.innerHTML = `
        <div class="alert alert-success mt-4">
          🏆 ¡Todas las respuestas fueron correctas!
        </div>
      `;
    }
  }
});
