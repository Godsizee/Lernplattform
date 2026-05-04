/* modules/QuizEngine.js */
export class QuizEngine {
    constructor(container, questions, options = {}) {
        this.container = container;
        this.questions = questions || [];
        this.onComplete = options.onComplete || (() => {});
        this.lessonId = options.lessonId || 'default';
        
        this.selectedQuestions = [];
        this.incorrectlyAnsweredQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.draggedItem = null;
        
        this.sessionKey = 'quizState_lesson_' + this.lessonId;
        
        this.initDOM();
        
        if (this.questions.length > 0) {
            if (!this.restoreState()) {
                this.startQuiz(this.questions);
            }
        } else {
            this.container.innerHTML = '<div class="form-error">Keine Fragen in diesem Quiz gefunden.</div>';
        }
    }

    initDOM() {
        this.container.innerHTML = `
            <div class="quiz-engine-container">
                <div class="quiz-progress-bar">
                    <div class="quiz-progress-inner" id="quiz-progress-bar-inner"></div>
                </div>
                <div class="quiz-progress-text" id="quiz-progress-text"></div>
                
                <div id="quiz-screen">
                    <h3 id="question-text" class="question-text"></h3>
                    <div id="options-container" class="options-container"></div>
                    <div id="feedback-area" class="feedback-area"></div>
                    <div class="quiz-actions">
                        <button id="check-answer-btn" class="btn btn-primary">Antwort prüfen</button>
                        <button id="next-question-btn" class="btn btn-primary" style="display:none;">Nächste Frage</button>
                    </div>
                </div>
                
                <div id="quiz-result-screen" style="display:none;" class="quiz-result-screen">
                    <h2 id="result-headline" class="result-headline"></h2>
                    <p id="result-text" class="result-text">Du hast <strong id="score-final">0</strong> von <strong id="total-final">0</strong> Fragen richtig beantwortet (<strong id="percentage-final">0</strong>%).</p>
                    <div class="quiz-result-actions">
                        <button id="retry-incorrect-btn" class="btn btn-warning" style="display:none;">Falsche wiederholen</button>
                        <button id="restart-quiz-btn" class="btn btn-secondary">Quiz neu starten</button>
                    </div>
                </div>
            </div>
        `;
        
        this.quizScreen = this.container.querySelector('#quiz-screen');
        this.resultScreen = this.container.querySelector('#quiz-result-screen');
        this.progressBar = this.container.querySelector('#quiz-progress-bar-inner');
        this.progressText = this.container.querySelector('#quiz-progress-text');
        this.questionText = this.container.querySelector('#question-text');
        this.optionsContainer = this.container.querySelector('#options-container');
        this.feedbackArea = this.container.querySelector('#feedback-area');
        
        this.checkBtn = this.container.querySelector('#check-answer-btn');
        this.nextBtn = this.container.querySelector('#next-question-btn');
        this.restartBtn = this.container.querySelector('#restart-quiz-btn');
        this.retryIncorrectBtn = this.container.querySelector('#retry-incorrect-btn');
        
        this.checkBtn.addEventListener('click', () => this.checkAnswer());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.restartBtn.addEventListener('click', () => this.startQuiz(this.questions));
        this.retryIncorrectBtn.addEventListener('click', () => {
            if (this.incorrectlyAnsweredQuestions.length > 0) {
                this.startQuiz(this.incorrectlyAnsweredQuestions);
            }
        });
    }

    saveState() {
        const state = {
            questions: this.selectedQuestions,
            incorrects: this.incorrectlyAnsweredQuestions,
            currentIndex: this.currentQuestionIndex,
            score: this.score
        };
        sessionStorage.setItem(this.sessionKey, JSON.stringify(state));
    }

    clearState() {
        sessionStorage.removeItem(this.sessionKey);
    }

    restoreState() {
        const saved = sessionStorage.getItem(this.sessionKey);
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.selectedQuestions = state.questions;
                this.incorrectlyAnsweredQuestions = state.incorrects;
                this.currentQuestionIndex = state.currentIndex;
                this.score = state.score;

                if (this.selectedQuestions && this.selectedQuestions.length > 0) {
                    if (this.currentQuestionIndex >= this.selectedQuestions.length) {
                        this.clearState();
                        return false;
                    }
                    this.quizScreen.style.display = 'block';
                    this.resultScreen.style.display = 'none';
                    this.displayQuestion();
                    return true;
                }
            } catch(e) {
                this.clearState();
            }
        }
        return false;
    }

    startQuiz(questions) {
        this.incorrectlyAnsweredQuestions = [];
        this.selectedQuestions = [...questions].sort(() => Math.random() - 0.5);
        this.currentQuestionIndex = 0;
        this.score = 0;
        
        this.saveState();
        
        this.quizScreen.style.display = 'block';
        this.resultScreen.style.display = 'none';
        
        this.displayQuestion();
    }

    displayQuestion() {
        this.feedbackArea.innerHTML = '';
        this.nextBtn.style.display = 'none';
        this.checkBtn.style.display = 'inline-block';
        this.checkBtn.disabled = false;
        
        this.updateProgress();
        
        const question = this.selectedQuestions[this.currentQuestionIndex];
        this.questionText.textContent = question.question;
        this.optionsContainer.innerHTML = '';

        if (question.type === 'radio' || question.type === 'checkbox') {
            this.displayStandardQuestion(question);
        } else if (question.type === 'matching') {
            this.displayMatchingQuestion(question);
        } else if (question.type === 'ordering') {
            this.displayOrderingQuestion(question);
        }
    }

    displayStandardQuestion(question) {
        const shuffledKeys = Object.keys(question.options).sort(() => Math.random() - 0.5);
        shuffledKeys.forEach(key => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option-item';
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = question.type;
            input.name = 'quiz_option';
            input.value = key;
            label.appendChild(input);
            label.appendChild(document.createTextNode(' ' + question.options[key]));
            optionDiv.appendChild(label);
            this.optionsContainer.appendChild(optionDiv);
        });
    }

    displayMatchingQuestion(question) {
        // Reduced logic for SAP standard migration support.
        const msg = document.createElement('p');
        msg.textContent = "(Matching questions not fully supported in this reduced view. Skipping...)";
        this.optionsContainer.appendChild(msg);
    }

    displayOrderingQuestion(question) {
        const msg = document.createElement('p');
        msg.textContent = "(Ordering questions not fully supported in this reduced view. Skipping...)";
        this.optionsContainer.appendChild(msg);
    }

    checkAnswer() {
        this.checkBtn.disabled = true;
        const question = this.selectedQuestions[this.currentQuestionIndex];
        let isCorrect = false;

        if (question.type === 'radio' || question.type === 'checkbox') {
            const correctAnswers = Array.isArray(question.correct) ? question.correct.sort() : [question.correct];
            const selectedInputs = this.optionsContainer.querySelectorAll('input:checked');
            const userAnswers = Array.from(selectedInputs).map(input => input.value).sort();
            isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(userAnswers);
            
            this.optionsContainer.querySelectorAll('label').forEach(label => {
                const input = label.querySelector('input');
                if (correctAnswers.includes(input.value)) {
                    label.classList.add('correct-answer');
                } else if (Array.from(selectedInputs).includes(input)) {
                    label.classList.add('wrong-answer');
                }
                input.disabled = true;
            });
        }

        if (isCorrect) {
            this.score++;
            this.showFeedback('Richtig!', 'success');
        } else {
            this.incorrectlyAnsweredQuestions.push(question);
            let solutionHtml = '';
            const correctAnswersArray = Array.isArray(question.correct) ? question.correct : [question.correct];
            solutionHtml = correctAnswersArray.map(key => question.options[key]).join(', ');
            this.showFeedback(`Leider falsch. Die richtige Antwort ist: <br><strong>${solutionHtml}</strong>`, 'fail');
        }
        
        this.nextBtn.style.display = 'inline-block';
        this.checkBtn.style.display = 'none';
    }

    showFeedback(message, type) {
        this.feedbackArea.innerHTML = `<div class="alert alert-${type === 'success' ? 'success' : 'danger'}">${message}</div>`;
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.selectedQuestions.length) {
            this.saveState();
            this.displayQuestion();
        } else {
            this.progressBar.style.width = `100%`;
            this.clearState();
            this.showResults();
        }
    }

    showResults() {
        this.quizScreen.style.display = 'none';
        this.resultScreen.style.display = 'block';
        
        const total = this.selectedQuestions.length;
        const percentage = total > 0 ? Math.round((this.score / total) * 100) : 0;
        
        this.container.querySelector('#score-final').textContent = this.score;
        this.container.querySelector('#total-final').textContent = total;
        this.container.querySelector('#percentage-final').textContent = percentage;
        
        const resultHeadline = this.container.querySelector('#result-headline');
        
        if (percentage >= 60) {
            resultHeadline.textContent = "Glückwunsch! Quiz bestanden.";
            resultHeadline.style.color = 'var(--color-success)';
            this.onComplete(true); // Callback if passed
        } else {
            resultHeadline.textContent = "Nicht bestanden. Versuche es erneut.";
            resultHeadline.style.color = 'var(--color-warning)';
        }
        
        if (this.retryIncorrectBtn) {
            this.retryIncorrectBtn.style.display = this.incorrectlyAnsweredQuestions.length > 0 ? 'inline-block' : 'none';
        }
    }

    updateProgress() {
        const progressPercentage = (this.currentQuestionIndex / this.selectedQuestions.length) * 100;
        this.progressBar.style.width = `${progressPercentage}%`;
        this.progressText.textContent = `Frage ${this.currentQuestionIndex + 1} von ${this.selectedQuestions.length}`;
    }
}
