const form = document.getElementById('waitlist-form');
const emailInput = document.getElementById('email-input');
const btnText = document.getElementById('btn-text');

const urlParams = new URLSearchParams(window.location.search);
const referredBy = (urlParams.get('ref') || '').replace(/[^A-Z0-9]/g, '').substring(0, 6);

let csrfToken = '';

async function getCSRFToken() {
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({action: 'get_csrf'})
        });
        const data = await response.json();
        csrfToken = data.csrf_token;
    } catch (error) {
        console.error('Failed to get CSRF token:', error);
    }
}

getCSRFToken();

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    if (!email) return;
    
    if (!csrfToken) {
        alert('Security token not loaded. Please refresh the page.');
        return;
    }
    
    btnText.textContent = 'Joining...';
    form.querySelector('button').disabled = true;
    
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'join',
                email: email,
                referred_by: referredBy || null,
                csrf_token: csrfToken
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const params = new URLSearchParams({
                position: data.position,
                code: data.referral_code,
                count: data.referral_count
            });
            window.location.href = `dashboard.html?${params.toString()}`;
        } else {
            alert(data.message || 'Something went wrong. Please try again.');
            btnText.textContent = 'Join the Waitlist';
            form.querySelector('button').disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
        btnText.textContent = 'Join the Waitlist';
        form.querySelector('button').disabled = false;
    }
});
