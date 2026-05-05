/* modules/QuizEngine.js */
import { escapeHTML } from '../utils/Helpers.js';

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
        this.isFocusMode = true; // Default ON
        
        this.sessionKey = 'quizState_lesson_' + this.lessonId;
        
        this.initDOM();
        
        if (this.questions.length > 0) {
            if (!this.restoreState()) {
                this.startQuiz(this.questions);
            }
        } else {
            this.container.innerHTML = '<div class="quiz-empty-state">Keine Fragen in diesem Quiz gefunden.</div>';
        }
    }

    initDOM() {
        this.container.innerHTML = `
            <div class="quiz-modern-wrapper">
                <div class="quiz-header-minimal">
                    <div class="quiz-controls-left">
                        <div class="focus-toggle-wrapper" data-tooltip="Fokus-Modus umschalten">
                            <label class="focus-switch">
                                <input type="checkbox" id="focus-mode-toggle" checked>
                                <span class="focus-slider"></span>
                            </label>
                            <span class="focus-label">
                                <span class="focus-icon-container">
                                    <i class="ph ph-eye focus-icon-off"></i>
                                    <i class="ph ph-eye-closed focus-icon-on"></i>
                                </span>
                                Fokus-Modus
                            </span>
                        </div>
                    </div>
                    <div class="quiz-progress-info">
                        <span id="quiz-progress-text"></span>
                        <div class="quiz-progress-track">
                            <div class="quiz-progress-fill" id="quiz-progress-bar-inner"></div>
                        </div>
                    </div>
                </div>
                
                <div id="quiz-screen" class="quiz-active-screen">
                    <div class="question-container">
                        <div class="question-badge">Frage ${this.currentQuestionIndex + 1}</div>
                        <h2 id="question-text" class="question-heading"></h2>
                    </div>
                    
                    <div id="options-container" class="options-grid"></div>
                    
                    <div id="feedback-area" class="feedback-overlay"></div>
                    
                    <div class="quiz-footer-actions">
                        <button id="check-answer-btn" class="quiz-btn quiz-btn-primary">Antwort prüfen</button>
                        <button id="next-question-btn" class="quiz-btn quiz-btn-success" style="display:none;">
                            Nächste Frage <i class="ph ph-arrow-right"></i>
                        </button>
                    </div>
                </div>
                
                <div id="quiz-result-screen" style="display:none;" class="quiz-finished-screen">
                    <div class="result-circle-wrapper">
                        <div class="result-percentage" id="percentage-final">0%</div>
                        <svg class="result-svg">
                            <circle class="bg" cx="60" cy="60" r="54"></circle>
                            <circle class="progress" cx="60" cy="60" r="54" id="result-stroke"></circle>
                        </svg>
                    </div>
                    
                    <h2 id="result-headline" class="result-title"></h2>
                    <p id="result-text" class="result-subtitle"></p>
                    
                    <div class="result-actions">
                        <button id="retry-incorrect-btn" class="quiz-btn quiz-btn-warning" style="display:none;">
                            <i class="ph ph-arrow-counter-clockwise"></i> Falsche wiederholen
                        </button>
                        <button id="restart-quiz-btn" class="quiz-btn quiz-btn-secondary">
                            <i class="ph ph-arrows-clockwise"></i> Alles neu starten
                        </button>
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

        // Focus Toggle Logic
        const focusToggle = this.container.querySelector('#focus-mode-toggle');
        if (focusToggle) {
            focusToggle.addEventListener('change', (e) => {
                this.isFocusMode = e.target.checked;
                this.updateFocusUI();
            });
            // Initial state
            this.updateFocusUI();
        }
    }

    updateFocusUI() {
        if (this.isFocusMode) {
            document.body.classList.add('quiz-focus-mode');
        } else {
            document.body.classList.remove('quiz-focus-mode');
        }
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
        this.feedbackArea.classList.remove('active');
        this.nextBtn.style.display = 'none';
        this.checkBtn.style.display = 'inline-flex';
        this.checkBtn.disabled = false;
        
        this.updateProgress();
        
        const question = this.selectedQuestions[this.currentQuestionIndex];
        this.questionText.textContent = question.question;
        this.container.querySelector('.question-badge').textContent = `Frage ${this.currentQuestionIndex + 1} von ${this.selectedQuestions.length}`;
        
        this.optionsContainer.innerHTML = '';

        const shuffledKeys = Object.keys(question.options).sort(() => Math.random() - 0.5);
        shuffledKeys.forEach(key => {
            const optionCard = document.createElement('div');
            optionCard.className = 'option-card';
            optionCard.innerHTML = `
                <input type="${question.type}" name="quiz_opt" id="opt_${key}" value="${key}">
                <label for="opt_${key}">
                    <span class="option-marker">${key}</span>
                    <span class="option-text">${escapeHTML(question.options[key])}</span>
                </label>
            `;
            
            // Handle click on the card itself
            optionCard.addEventListener('click', (e) => {
                if (this.checkBtn.style.display === 'none') return;
                
                const input = optionCard.querySelector('input');
                
                // If the user clicked the label or marker directly, 
                // we don't need to manually toggle since the browser does it.
                // But we want to ensure the card's visual state updates.
                
                if (question.type === 'radio') {
                    this.optionsContainer.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                    optionCard.classList.add('selected');
                } else {
                    // For checkboxes, toggle selected class
                    setTimeout(() => {
                        optionCard.classList.toggle('selected', input.checked);
                    }, 50);
                }
            });
            this.optionsContainer.appendChild(optionCard);
        });
    }

    checkAnswer() {
        const question = this.selectedQuestions[this.currentQuestionIndex];
        const selectedInputs = this.optionsContainer.querySelectorAll('input:checked');
        if (selectedInputs.length === 0) return;

        this.checkBtn.disabled = true;
        let isCorrect = false;

        const correctAnswers = Array.isArray(question.correct) ? question.correct.sort() : [question.correct];
        const userAnswers = Array.from(selectedInputs).map(input => input.value).sort();
        isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(userAnswers);
        
        this.optionsContainer.querySelectorAll('.option-card').forEach(card => {
            const input = card.querySelector('input');
            const val = input.value;
            
            if (correctAnswers.includes(val)) {
                card.classList.add('correct');
            } else if (input.checked) {
                card.classList.add('wrong');
            }
            input.disabled = true;
            card.style.cursor = 'default';
        });

        if (isCorrect) {
            this.score++;
            this.showFeedback('Hervorragend! Das ist absolut richtig.', 'success');
        } else {
            this.incorrectlyAnsweredQuestions.push(question);
            const solutionText = correctAnswers.map(k => `<strong>${k}</strong>`).join(', ');
            this.showFeedback(`Nicht ganz richtig. Die korrekte Lösung wäre: ${solutionText}`, 'error');
        }
        
        this.nextBtn.style.display = 'inline-flex';
        this.checkBtn.style.display = 'none';
        this.saveState();
    }

    showFeedback(message, type) {
        this.feedbackArea.className = `feedback-overlay active ${type}`;
        this.feedbackArea.innerHTML = `
            <div class="feedback-content">
                <i class="ph ${type === 'success' ? 'ph-check-circle' : 'ph-x-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.selectedQuestions.length) {
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    updateProgress() {
        const percent = (this.currentQuestionIndex / this.selectedQuestions.length) * 100;
        this.progressBar.style.width = `${percent}%`;
    }

    showResults() {
        this.clearState();
        this.quizScreen.style.display = 'none';
        this.resultScreen.style.display = 'flex';
        
        const total = this.selectedQuestions.length;
        const percentage = Math.round((this.score / total) * 100);
        
        const stroke = this.container.querySelector('#result-stroke');
        const radius = 54;
        const circumference = 2 * Math.PI * radius;
        stroke.style.strokeDasharray = `${circumference} ${circumference}`;
        stroke.style.strokeDashoffset = circumference;
        
        setTimeout(() => {
            const offset = circumference - (percentage / 100) * circumference;
            stroke.style.strokeDashoffset = offset;
            this.animateValue('percentage-final', 0, percentage, 1000, '%');
        }, 100);

        const headline = this.container.querySelector('#result-headline');
        const text = this.container.querySelector('#result-text');
        
        if (percentage >= 80) {
            headline.textContent = "Meisterhaft!";
            text.textContent = `Du hast ${this.score} von ${total} Fragen richtig beantwortet. Eine exzellente Leistung!`;
            headline.style.color = 'var(--color-success)';
        } else if (percentage >= 60) {
            headline.textContent = "Bestanden!";
            text.textContent = `Du hast ${this.score} von ${total} Fragen richtig beantwortet. Gut gemacht!`;
            headline.style.color = 'var(--color-primary)';
        } else {
            headline.textContent = "Versuch's nochmal!";
            text.textContent = `Du hast nur ${this.score} von ${total} Fragen richtig beantwortet. Übung macht den Meister.`;
            headline.style.color = 'var(--color-warning)';
        }

        // NEU: Konfetti-Effekt bei Erfolg (mind. 60%)
        if (percentage >= 60 && typeof window.confetti === 'function') {
            window.confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#a972ff', '#3fb950', '#ffbd00']
            });
        }
        
        this.retryIncorrectBtn.style.display = this.incorrectlyAnsweredQuestions.length > 0 ? 'inline-flex' : 'none';
        
        // Final Callback to save score
        this.onComplete(percentage);
    }

    animateValue(id, start, end, duration, suffix = '') {
        const obj = document.getElementById(id);
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start) + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
}
