let questions = JSON.parse(localStorage.getItem("examQuestions")) || [];
let current = parseInt(localStorage.getItem("examCurrent")) || 0;
let answers = JSON.parse(localStorage.getItem("examAnswers")) || {}; 

async function loadExam() {
    if (questions.length === 0) {
        const res = await fetch("/api/exams");
        questions = await res.json();
        localStorage.setItem("examQuestions", JSON.stringify(questions));
    }
    initPalette();
    showQuestion();
}

function showQuestion() {
    const q = questions[current];
    const box = document.getElementById("questionBox");

    box.innerHTML = `
        <h3>Q${current + 1}. ${q.question}</h3>
        <div class="options">
            ${q.options.map(opt => `
                <label>
                    <input type="radio" name="q${current}" value="${opt.replace(/"/g, '&quot;')}" ${answers[current] === opt ? 'checked' : ''} onclick="saveAnswer(this.value)">
                    ${opt}
                </label>
            `).join("")}
        </div>
    `;

    // Update button states: Disable "Previous" on the first question
    const prevBtn = document.querySelector('button[onclick="prevQuestion()"]');
    if (prevBtn) {
        if (current === 0) {
            prevBtn.disabled = true;
            prevBtn.style.opacity = "0.5";
            prevBtn.style.cursor = "not-allowed";
        } else {
            prevBtn.disabled = false;
            prevBtn.style.opacity = "1";
            prevBtn.style.cursor = "pointer";
        }
    }

    // Update button states: Disable "Next" on the last question
    const nextBtn = document.querySelector('button[onclick="nextQuestion()"]');
    if (nextBtn) {
        if (current === questions.length - 1) {
            nextBtn.disabled = true;
            nextBtn.style.opacity = "0.5";
            nextBtn.style.cursor = "not-allowed";
        } else {
            nextBtn.disabled = false;
            nextBtn.style.opacity = "1";
            nextBtn.style.cursor = "pointer";
        }
    }

    updatePalette();
}

function saveAnswer(val) {
    answers[current] = val;
    localStorage.setItem("examAnswers", JSON.stringify(answers));
    updatePalette();
}

function initPalette() {
    const grid = document.getElementById("paletteGrid");
    if (!grid) return;
    grid.innerHTML = "";
    questions.forEach((q, index) => {
        const btn = document.createElement("div");
        btn.classList.add("palette-btn");
        btn.innerText = index + 1;
        btn.onclick = () => {
            current = index;
            localStorage.setItem("examCurrent", current);
            showQuestion();
        };
        grid.appendChild(btn);
    });
    updatePalette();
}

function updatePalette() {
    const grid = document.getElementById("paletteGrid");
    if (!grid) return;
    const btns = grid.children;
    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove("active", "answered", "unanswered");
        if (i === current) {
            btns[i].classList.add("active");
        }
        if (answers[i]) {
            btns[i].classList.add("answered");
        } else {
            btns[i].classList.add("unanswered");
        }
        
        // Ensure active question is visible in the scrollable palette
        if (i === current && btns[i].scrollIntoView) {
            btns[i].scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }
}

function nextQuestion() {
    if (current < questions.length - 1) {
        current++;
        localStorage.setItem("examCurrent", current);
        showQuestion();
    }
}

function prevQuestion() {
    if (current > 0) {
        current--;
        localStorage.setItem("examCurrent", current);
        showQuestion();
    }
}

let submitting = false;

// Disable Browser Back/Forward navigation
function disableBack() {
    if (!window.history || !window.history.pushState) return;
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        if (window.history && window.history.forward && window.history.pushState) {
            window.history.forward(); // Force move forward if back is pressed
            window.history.pushState(null, "", window.location.href);
        }
    };
}

function showCustomConfirm(msg, onConfirm) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0'; overlay.style.left = '0';
    overlay.style.width = '100vw'; overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.85)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';

    const box = document.createElement('div');
    box.style.background = '#020202';
    box.style.padding = '30px';
    box.style.border = '1px solid #00ff41';
    box.style.borderRadius = '0';
    box.style.textAlign = 'center';
    box.style.color = '#00ff41';
    box.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.2)';
    box.style.fontFamily = "'Share Tech Mono', 'Courier New', monospace";

    const text = document.createElement('p');
    text.innerText = "> " + msg;
    text.style.fontSize = '18px';
    text.style.whiteSpace = 'pre-line';
    
    const btnContainer = document.createElement('div');
    btnContainer.style.marginTop = '20px';

    const okBtn = document.createElement('button');
    okBtn.innerText = '[ SUBMIT ]';
    okBtn.style.marginRight = '15px';
    okBtn.style.padding = '10px 20px';
    okBtn.style.background = 'transparent';
    okBtn.style.border = '1px solid #00ff41';
    okBtn.style.color = '#00ff41';
    okBtn.style.cursor = 'crosshair';
    okBtn.style.fontFamily = "'Share Tech Mono', 'Courier New', monospace";
    okBtn.style.textTransform = 'uppercase';
    okBtn.onmouseover = () => { okBtn.style.background = '#00ff41'; okBtn.style.color = '#020202'; };
    okBtn.onmouseout = () => { okBtn.style.background = 'transparent'; okBtn.style.color = '#00ff41'; };
    okBtn.onclick = () => {
        document.body.removeChild(overlay);
        onConfirm();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = '[ CANCEL ]';
    cancelBtn.style.padding = '10px 20px';
    cancelBtn.style.background = 'transparent';
    cancelBtn.style.border = '1px solid #ff003c';
    cancelBtn.style.color = '#ff003c';
    cancelBtn.style.cursor = 'crosshair';
    cancelBtn.style.fontFamily = "'Share Tech Mono', 'Courier New', monospace";
    cancelBtn.style.textTransform = 'uppercase';
    cancelBtn.onmouseover = () => { cancelBtn.style.background = '#ff003c'; cancelBtn.style.color = '#020202'; };
    cancelBtn.onmouseout = () => { cancelBtn.style.background = 'transparent'; cancelBtn.style.color = '#ff003c'; };
    cancelBtn.onclick = () => {
        document.body.removeChild(overlay);
    };

    btnContainer.appendChild(okBtn);
    btnContainer.appendChild(cancelBtn);
    box.appendChild(text);
    box.appendChild(btnContainer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

async function submitExam(force = false) {
    if (submitting || !questions || questions.length === 0) return;

    if (force !== true) {
        let unansweredCount = 0;
        for (let i = 0; i < questions.length; i++) {
            if (!answers[i]) unansweredCount++;
        }
        
        let msg = unansweredCount > 0 
            ? `You still have ${unansweredCount} unanswered question(s).\n\nAre you sure you want to submit the exam?`
            : `You have answered all questions.\n\nAre you sure you want to submit the exam?`;

        // Render custom modal instead of native confirm to prevent fullscreen exit
        showCustomConfirm(msg, () => {
            processSubmission();
        });
        return; // wait for user action
    } else {
        processSubmission();
    }
}

async function processSubmission() {
    submitting = true;

    // Convert answers map to array of {id, selected}
    const submittedAnswers = questions.map((q, index) => ({
        id: q.id,
        selected: answers[index] || null
    }));

    try {
        const res = await fetch("/api/exams/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                student_id: localStorage.getItem("studentId"), // Ensure student_id is sent if backend expects it
                answers: submittedAnswers
            })
        });
        const data = await res.json();

        // Store results for result.html
        localStorage.setItem("lastScore", data.score);
        localStorage.setItem("lastCorrect", data.correct);
        localStorage.setItem("lastWrong", data.wrong);
        localStorage.setItem("lastUnanswered", questions.length - data.correct - data.wrong);

    } catch (err) {
        console.error("Submission error:", err);
    }

    // Clear exam progress on submission
    localStorage.removeItem("examAnswers");
    localStorage.removeItem("examCurrent");
    localStorage.removeItem("examEndTime");
    localStorage.removeItem("examQuestions");
    window.dispatchEvent(new Event('examSubmitted'));

    window.location.replace("result.html"); // Use replace to prevent going back to exam
}

// Security: Terminate exam on tab switch or losing focus
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && !submitting) {
        // Tab switched
        submitExam(true);
    }
});

window.addEventListener("blur", () => {
    if (!submitting) {
        // Window lost focus (Alt+Tab, clicking another app, etc.)
        submitExam(true);
    }
});

// Exam Mode Security Settings
function enableExamMode() {
    function isFullscreen() {
        return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    }

    function reqFullscreen(el) {
        if (el.requestFullscreen) {
            el.requestFullscreen().catch(e => console.error("Fullscreen fail:", e));
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        }
    }

    // 1. Initial Fullscreen Check (Should already be active from auth.js)
    if (!isFullscreen()) {
        // Fallback for direct page access
        document.addEventListener("click", () => {
            if (!isFullscreen()) {
                reqFullscreen(document.documentElement);
            }
        }, { once: true });
    }

    // 2. Disable Right Click
    document.addEventListener('contextmenu', event => event.preventDefault());

    // 3. Disable Shortcuts (F12, Ctrl+Shift+I, Ctrl+U, etc.)
    document.addEventListener('keydown', (e) => {
        const isF12 = e.key === "F12" || e.keyCode === 123;
        const isI = e.key === "I" || e.keyCode === 73;
        const isJ = e.key === "J" || e.keyCode === 74;
        const isC = e.key === "C" || e.keyCode === 67;
        const isU = e.key === "U" || e.keyCode === 85;

        if (
            isF12 ||
            (e.ctrlKey && e.shiftKey && (isI || isJ || isC)) ||
            (e.ctrlKey && isU)
        ) {
            e.preventDefault();
        }
    });

    // 4. Force Fullscreen - If they try to exit, submit or warn
    const fullscreenChangeEvents = ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'MSFullscreenChange'];
    fullscreenChangeEvents.forEach(eventType => {
        document.addEventListener(eventType, () => {
            if (!isFullscreen() && !submitting) {
                // Option A: Submit immediately for violation
                submitExam(true);
                // Option B: alert("Fullscreen is required. Exam terminating.");
            }
        });
    });
}

disableBack();
enableExamMode();

// 5. Prevent accidental refresh/exit during exam
window.addEventListener("beforeunload", (e) => {
    if (!submitting) {
        e.preventDefault();
        e.returnValue = ""; // Standard requirement for showing the "Stay or Leave" dialog
    }
});

loadExam();