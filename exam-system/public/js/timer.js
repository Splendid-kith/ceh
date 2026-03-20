// Initialize or retrieve the end time from localStorage
let endTime = localStorage.getItem("examEndTime");

if (!endTime) {
    // Set for 35 minutes from now
    endTime = Date.now() + (35 * 60 * 1000);
    localStorage.setItem("examEndTime", endTime);
}

let timerElement = document.getElementById("time");

let timer = setInterval(function () {
    let now = Date.now();
    let timeLeft = Math.floor((endTime - now) / 1000);

    if (timeLeft < 0) {
        clearInterval(timer);
        localStorage.removeItem("examEndTime");
        submitExam(true); // Force submit without prompt
        return;
    }

    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    // Pad with leading zeros
    let displayMinutes = minutes < 10 ? "0" + minutes : minutes;
    let displaySeconds = seconds < 10 ? "0" + seconds : seconds;

    if (timerElement) {
        timerElement.innerHTML = displayMinutes + ":" + displaySeconds;
    }
}, 1000);

// Ensure the end time is cleared when the exam is submitted (called from exam.js submitExam)
window.addEventListener('examSubmitted', () => {
    localStorage.removeItem("examEndTime");
});