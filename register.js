document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/api/auth/signup', {  // Adjust backend URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        console.log (result.message)
        if (response.ok) {
            window.location.href = 'dashboard.html'; // Redirect after successful login
        }
    } catch (error) {
        console.error('Error:', error);
        responseElement.innerText = 'Something went wrong!';
        responseElement.style.color = 'red';
    }
});
