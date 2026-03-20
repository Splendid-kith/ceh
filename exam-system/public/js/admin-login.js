async function loginAdmin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('errorMessage');

    if (!username || !password) {
        errorDiv.textContent = "Please fill in all fields.";
        errorDiv.style.display = "block";
        return;
    }

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            // In a real app, we'd store a token here. 
            // For now, we'll just redirect to the admin page.
            localStorage.setItem('adminAuthenticated', 'true');
            window.location.href = '/admin.html';
        } else {
            errorDiv.textContent = result.message || "Invalid credentials.";
            errorDiv.style.display = "block";
        }
    } catch (err) {
        errorDiv.textContent = "An error occurred. Please try again later.";
        errorDiv.style.display = "block";
    }
}
