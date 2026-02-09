document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('message');
    
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'admin_login',
                username,
                password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('admin_token', data.token);
            window.location.href = 'admin-dashboard.html';
        } else {
            messageEl.textContent = data.message || 'Invalid credentials';
        }
    } catch (error) {
        messageEl.textContent = 'Login failed. Please try again.';
    }
});
