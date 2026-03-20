// Tab/Window switching detection (Alt+Tab, New Tab)
window.addEventListener("blur", function () {
    alert("Warning: Window/Tab switch detected. Your exam will be submitted automatically.");
    submitExam();
});

document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        submitExam();
    }
});

// Prevent common cheating shortcuts
document.addEventListener("keydown", function (e) {
    // Prevent F12, Ctrl+Shift+I, Ctrl+U, Ctrl+C, Ctrl+V, etc.
    if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
        (e.ctrlKey && e.keyCode === 67) || // Ctrl+C
        (e.ctrlKey && e.keyCode === 86)    // Ctrl+V
    ) {
        e.preventDefault();
        alert("This action is disabled for security reasons.");
    }
});

// Disable right-click
document.addEventListener("contextmenu", e => e.preventDefault());

// Disable text selection
document.onselectstart = function () { return false; };

// Optional: Force Fullscreen (usually requires user interaction first)
function startFullScreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
}
