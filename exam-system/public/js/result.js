// Disable Browser Back Button on result page
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
    // Alternatively redirect home if they try to go back
    // window.location.href = "index.html";
};

function loadResult() {
    document.getElementById("correct").innerText = localStorage.getItem("lastCorrect") || 0;
    document.getElementById("wrong").innerText = localStorage.getItem("lastWrong") || 0;
    document.getElementById("unanswered").innerText = localStorage.getItem("lastUnanswered") || 0;
    document.getElementById("score").innerText = localStorage.getItem("lastScore") || 0;
}

loadResult();