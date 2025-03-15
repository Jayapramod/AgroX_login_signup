document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent page reload

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3001/api/auth/login', { // API to send OTP
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        alert(result.message); // Show success or error message

        if (response.ok) {
            document.getElementById('loginForm').style.display = 'none';  // Hide login form
            document.getElementById('otpForm').style.display = 'block';  // Show OTP form
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to send OTP');
    }
});

// Handle OTP Verification
document.getElementById('otpForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value; // Keep email same
    const otp = document.getElementById('otp').value;

    try {
        const response = await fetch('http://localhost:3001/api/auth/verify', { // API to verify OTP
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });

        const result = await response.json();
        console.log(result.message);

        if (response.ok) {
            window.location.href = 'dashboard.html'; // Redirect after successful login
        }
    } catch (error) {
        console.error('Error:', error);
        alert('OTP verification failed');
    }
});
