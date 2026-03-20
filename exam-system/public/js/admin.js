async function loadResults() {

    const res = await fetch("/api/admin/results")
    const data = await res.json()

    const table = document.getElementById("resultsTable")

    table.innerHTML = ""

    data.forEach(r => {

        const row = document.createElement("tr")

        row.innerHTML = `
<td>${r.name}</td>
<td>${r.correct_count}</td>
<td>${r.wrong_count}</td>
<td>${r.unanswered_count}</td>
<td>${r.score}</td>
<td><button onclick="deleteAttempt(${r.student_id})" style="background: #ef4444; padding: 5px 10px; font-size: 13px;">Delete</button></td>
`

        table.appendChild(row)

    })

}

function showCustomDialog(msg, isConfirm, onConfirm) {
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
    btnContainer.style.gap = '15px';

    const okBtn = document.createElement('button');
    okBtn.innerText = isConfirm ? '[ YES, PROCEED ]' : '[ OK ]';
    okBtn.style.padding = '10px 24px';
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

    if (isConfirm) {
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = '[ CANCEL ]';
        cancelBtn.style.padding = '10px 24px';
        cancelBtn.style.background = 'transparent';
        cancelBtn.style.border = '1px solid #ff003c';
        cancelBtn.style.color = '#ff003c';
        cancelBtn.style.cursor = 'crosshair';
        cancelBtn.style.fontFamily = "'Share Tech Mono', 'Courier New', monospace";
        cancelBtn.style.textTransform = 'uppercase';
        cancelBtn.onmouseover = () => { cancelBtn.style.background = '#ff003c'; cancelBtn.style.color = '#020202'; };
        cancelBtn.onmouseout = () => { cancelBtn.style.background = 'transparent'; cancelBtn.style.color = '#ff003c'; };
        cancelBtn.onclick = () => document.body.removeChild(overlay);
        btnContainer.appendChild(cancelBtn);
    }

    box.appendChild(text);
    box.appendChild(btnContainer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

function deleteAttempt(studentId) {
    showCustomDialog("Are you sure you want to delete this student's attempt? This entirely removes their data and allows them to retake the exam.", true, async () => {
        try {
            const res = await fetch(`/api/admin/delete/${studentId}`, { method: 'DELETE' });
            const data = await res.json();
            
            if (res.ok) {
                showCustomDialog(data.message, false, () => loadResults());
            } else {
                showCustomDialog("Error: " + data.error, false);
            }
        } catch (err) {
            console.error("Delete Error:", err);
            showCustomDialog("Failed to delete attempt.", false);
        }
    });
}

function clearAllData() {
    showCustomDialog("⚠️ Are you VERY sure you want to completely erase ALL student data and results? This action is permanent and cannot be undone.", true, async () => {
        try {
            const res = await fetch(`/api/admin/clear-all`, { method: 'DELETE' });
            const data = await res.json();
            
            if (res.ok) {
                showCustomDialog(data.message, false, () => loadResults());
            } else {
                showCustomDialog("Error: " + data.error, false);
            }
        } catch (err) {
            console.error("Clear All Error:", err);
            showCustomDialog("Failed to clear all data.", false);
        }
    });
}

loadResults();

// Aggressively disable backward button specifically for the admin panel
(function() {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function() {
        window.history.pushState(null, "", window.location.href);
    };
})();