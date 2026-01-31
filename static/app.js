const form = document.getElementById('waitlist-form');
const btnText = document.getElementById('btn-text');
const successMessage = document.getElementById('success-message');

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
    
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email-input').value.trim();
    const jobTitle = document.getElementById('job-title').value.trim();
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const country = document.getElementById('country').value;
    
    if (!firstName || !lastName || !email || !jobTitle || !phoneNumber || !country) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!csrfToken) {
        alert('Security token not loaded. Please refresh the page.');
        return;
    }
    
    btnText.textContent = 'Joining...';
    form.querySelector('button').disabled = true;
    
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                action: 'join',
                first_name: firstName,
                last_name: lastName,
                email: email,
                job_title: jobTitle,
                phone_number: phoneNumber,
                country: country,
                referred_by: referredBy || null,
                csrf_token: csrfToken
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            form.style.display = 'none';
            document.querySelector('.hero-footer').style.display = 'none';
            successMessage.style.display = 'block';
            document.getElementById('success-text').textContent = 
                `You're #${data.position} on the waitlist. Check your email for your referral link.`;
            
            setTimeout(() => {
                const params = new URLSearchParams({
                    position: data.position,
                    code: data.referral_code,
                    count: data.referral_count
                });
                window.location.href = `dashboard.html?${params.toString()}`;
            }, 3000);
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
