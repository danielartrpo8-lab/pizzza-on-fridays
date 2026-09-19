/**
 * Cuestionario interactivo de la landing page: hace un par de preguntas y,
 * según las respuestas, recomienda una watchlist o app del sidebar. Las
 * URLs/descripciones de cada resultado vienen del backend (ver
 * `app/controllers/home.py`); aquí solo vive el árbol de preguntas y el
 * render.
 */
(function () {
  "use strict";

  const QUESTIONS = {
    goal: {
      text: "¿Qué te gustaría hacer hoy?",
      options: [
        { label: "Ver el panorama general del mercado", next: "result:market" },
        { label: "Seguir empresas específicas", next: "companies" },
        { label: "Entender qué tan arriesgado está un activo", next: "result:risk" },
      ],
    },
    companies: {
      text: "¿Qué tipo de empresas te llaman más la atención?",
      options: [
        { label: "Tecnología y electrónica de consumo", next: "result:tech" },
        { label: "Videojuegos y entretenimiento", next: "result:gaming" },
      ],
    },
  };

  const TOTAL_STEPS = 2; // profundidad máxima del árbol, para la barra de progreso

  function init() {
    const dataEl = document.getElementById("quiz-outcomes");
    const questionView = document.getElementById("quiz-question-view");
    const resultView = document.getElementById("quiz-result-view");
    if (!dataEl || !questionView || !resultView) return;

    let outcomes;
    try {
      outcomes = JSON.parse(dataEl.textContent);
    } catch (err) {
      return;
    }

    const questionText = document.getElementById("quiz-question-text");
    const optionsEl = document.getElementById("quiz-options");
    const progressEl = document.getElementById("quiz-progress");
    const resultIcon = document.getElementById("quiz-result-icon");
    const resultTitle = document.getElementById("quiz-result-title");
    const resultDesc = document.getElementById("quiz-result-desc");
    const resultCta = document.getElementById("quiz-result-cta");
    const restartBtn = document.getElementById("quiz-restart");

    let step = 0;

    function renderProgress() {
      progressEl.innerHTML = "";
      for (let i = 0; i < TOTAL_STEPS; i += 1) {
        const dot = document.createElement("span");
        dot.className = "landing-quiz__dot" + (i < step ? " is-done" : i === step ? " is-active" : "");
        progressEl.appendChild(dot);
      }
    }

    function renderQuestion(id) {
      const question = QUESTIONS[id];
      if (!question) return;
      questionText.textContent = question.text;
      optionsEl.innerHTML = "";
      question.options.forEach((option) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "landing-quiz__option";
        btn.textContent = option.label;
        btn.addEventListener("click", () => handleAnswer(option.next));
        optionsEl.appendChild(btn);
      });
      renderProgress();
    }

    function renderResult(key) {
      const outcome = outcomes[key];
      if (!outcome) return;
      questionView.hidden = true;
      resultView.hidden = false;
      resultIcon.textContent = outcome.icon || "✨";
      resultTitle.textContent = outcome.title || "";
      resultDesc.textContent = outcome.description || "";
      resultCta.href = outcome.url || "#";
    }

    function handleAnswer(next) {
      if (next.startsWith("result:")) {
        renderResult(next.slice("result:".length));
        return;
      }
      step += 1;
      renderQuestion(next);
    }

    function restart() {
      step = 0;
      resultView.hidden = true;
      questionView.hidden = false;
      renderQuestion("goal");
    }

    restartBtn.addEventListener("click", restart);
    renderQuestion("goal");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
