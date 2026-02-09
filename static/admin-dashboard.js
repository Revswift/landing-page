// Check authentication
const token = localStorage.getItem('admin_token');
if (!token) {
    window.location.href = 'admin-login.html';
}

let waitlistData = [];

// Load waitlist data
async function loadWaitlist() {
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'admin_get_waitlist',
                token
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            if (data.message === 'Unauthorized') {
                localStorage.removeItem('admin_token');
                window.location.href = 'admin-login.html';
            }
            return;
        }
        
        waitlistData = data.waitlist;
        updateStats(data.stats);
        renderTable();
    } catch (error) {
        console.error('Failed to load waitlist:', error);
    }
}

// Update statistics
function updateStats(stats) {
    document.getElementById('totalCount').textContent = stats.total;
    document.getElementById('realCount').textContent = stats.real;
    document.getElementById('testCount').textContent = stats.test;
    document.getElementById('todayCount').textContent = stats.today;
}

// Render table
function renderTable() {
    const tbody = document.getElementById('waitlistTable');
    
    if (waitlistData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem;">No entries yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = waitlistData.map(entry => `
        <tr>
            <td>${entry.position}</td>
            <td>${entry.first_name} ${entry.last_name} ${entry.is_test ? '<span class="badge badge-test">TEST</span>' : ''}</td>
            <td>${entry.email}</td>
            <td>${entry.job_title}</td>
            <td>${entry.phone_number}</td>
            <td>${entry.country}</td>
            <td>${entry.referral_count}</td>
            <td>${new Date(entry.created_at).toLocaleDateString()}</td>
            <td>
                <button class="btn-small btn-mark" onclick="toggleTest(${entry.id}, ${entry.is_test})">
                    ${entry.is_test ? 'Unmark' : 'Mark Test'}
                </button>
            </td>
        </tr>
    `).join('');
}

// Toggle test status
async function toggleTest(id, currentStatus) {
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'admin_toggle_test',
                token,
                id,
                is_test: !currentStatus
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadWaitlist();
        }
    } catch (error) {
        console.error('Failed to toggle test status:', error);
    }
}

// Export to CSV
function exportCSV() {
    const headers = ['Position', 'First Name', 'Last Name', 'Email', 'Job Title', 'Phone', 'Country', 'Referral Code', 'Referrals', 'Is Test', 'Date'];
    const rows = waitlistData.map(entry => [
        entry.position,
        entry.first_name,
        entry.last_name,
        entry.email,
        entry.job_title,
        entry.phone_number,
        entry.country,
        entry.referral_code,
        entry.referral_count,
        entry.is_test ? 'Yes' : 'No',
        new Date(entry.created_at).toISOString()
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revswift-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}

// Event listeners
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('admin_token');
    window.location.href = 'admin-login.html';
});

document.getElementById('exportBtn').addEventListener('click', exportCSV);
document.getElementById('refreshBtn').addEventListener('click', loadWaitlist);

// Initial load
loadWaitlist();
