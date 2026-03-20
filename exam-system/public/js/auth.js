function showCustomDialog(msg, onConfirm) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0'; overlay.style.left = '0';
    overlay.style.width = '100vw'; overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';

    const box = document.createElement('div');
    box.style.background = '#020202';
    box.style.padding = '30px';
    box.style.border = '1px solid #00ff41';
    box.style.textAlign = 'center';
    box.style.color = '#00ff41';
    box.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.2)';
    box.style.maxWidth = '400px';
    box.style.fontFamily = "'Share Tech Mono', 'Courier New', monospace";

    const text = document.createElement('p');
    text.innerText = "> " + msg;
    text.style.fontSize = '16px';
    text.style.lineHeight = '1.6';
    text.style.marginBottom = '25px';
    
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'center';

    const okBtn = document.createElement('button');
    okBtn.innerText = '[ OK ]';
    okBtn.style.padding = '10px 30px';
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
        if (onConfirm) onConfirm();
    };

    btnContainer.appendChild(okBtn);
    box.appendChild(text);
    box.appendChild(btnContainer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

async function startExam() {
    const name = document.getElementById("name").value;
    const dept = document.getElementById("department").value;

    if (!name || !dept) {
        showCustomDialog("Please enter Name and Department");
        return;
    }

    if (document.hidden || document.visibilityState === 'hidden') {
        showCustomDialog("You cannot start the exam while the window is minimized or hidden.");
        return;
    }

    // Check for split-screen or non-maximized window
    // We allow a 10% tolerance for taskbars and browser chrome borders
    const winWidth = window.outerWidth || window.innerWidth;
    const winHeight = window.outerHeight || window.innerHeight;
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;

    if (winWidth < screenWidth * 0.9 || winHeight < screenHeight * 0.9) {
        showCustomDialog("Please maximize your browser window. The exam cannot be started in split-screen, minimized, or restored window sizes.");
        return;
    }

    // Entering Fullscreen using the current click gesture
    const elem = document.documentElement;
    try {
        if (elem.requestFullscreen) {
            await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            await elem.msRequestFullscreen();
        }
    } catch (err) {
        console.warn("Fullscreen request failed, proceeding anyway:", err);
    }

    try {
        const res = await fetch('/api/students/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, department: dept })
        });
        const data = await res.json();

        if (data.id) {
            // Clear any old exam data before starting a new session
            localStorage.removeItem("examAnswers");
            localStorage.removeItem("examCurrent");
            localStorage.removeItem("examEndTime");
            localStorage.removeItem("examQuestions");

            localStorage.setItem("studentId", data.id);
            localStorage.setItem("studentName", name);
            localStorage.setItem("department", dept);

            // SEAMLESS TRANSITION: Load exam content without navigating to preserve Fullscreen
            try {
                const examRes = await fetch("exam.html");
                const html = await examRes.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");

                // 1. Replace the body content
                document.body.innerHTML = doc.body.innerHTML;
                document.title = "CEH Examination - In Progress";

                // 2. Load the necessary scripts manually
                const scripts = ["js/exam.js", "js/timer.js"];
                scripts.forEach(src => {
                    const script = document.createElement("script");
                    script.src = src;
                    document.body.appendChild(script);
                });

                // 3. Update the URL without reloading (optional, helps with refresh)
                window.history.pushState({}, "", "exam.html");

            } catch (loadErr) {
                console.error("Soft navigation failed, falling back:", loadErr);
                window.location = "exam.html";
            }
        } else {
            showCustomDialog(data.error || "Registration failed", () => {
                if (document.fullscreenElement) document.exitFullscreen();
            });
        }
    } catch (err) {
        console.error("Error:", err);
        showCustomDialog("Server error. Please try again.");
    }
}