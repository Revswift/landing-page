const urlParams = new URLSearchParams(window.location.search);
const position = parseInt(urlParams.get('position')) || 0;
const referralCode = urlParams.get('code') || '';
const referralCount = parseInt(urlParams.get('count')) || 0;

const positionValue = document.getElementById('position-value');
const percentileEl = document.getElementById('percentile');
const referralCountEl = document.getElementById('referral-count');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const referralLink = document.getElementById('referral-link');
const copyBtn = document.getElementById('copy-btn');
const copyIcon = document.getElementById('copy-icon');
const checkIcon = document.getElementById('check-icon');
const copyText = document.getElementById('copy-text');

positionValue.textContent = `#${position.toLocaleString()}`;

const percentileAhead = Math.max(0, Math.min(99, Math.round((1 - (position / 10000)) * 100)));
percentileEl.textContent = `${percentileAhead}%`;

referralCountEl.textContent = referralCount;

const referralGoal = 3;
const progressPercent = Math.min((referralCount / referralGoal) * 100, 100);
progressFill.style.width = `${progressPercent}%`;

if (referralCount >= referralGoal) {
    progressText.textContent = "You've unlocked Early Access!";
} else {
    progressText.textContent = `${referralGoal - referralCount} more to unlock Early Access`;
}

const fullReferralLink = `${window.location.origin}?ref=${referralCode}`;
referralLink.textContent = fullReferralLink;

copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(fullReferralLink);
        copyIcon.classList.add('hidden');
        checkIcon.classList.remove('hidden');
        copyText.textContent = 'Copied';
        
        setTimeout(() => {
            copyIcon.classList.remove('hidden');
            checkIcon.classList.add('hidden');
            copyText.textContent = 'Copy';
        }, 2000);
    } catch (error) {
        console.error('Failed to copy:', error);
    }
});
