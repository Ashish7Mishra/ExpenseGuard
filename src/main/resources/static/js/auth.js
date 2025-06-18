// This function runs when the entire HTML document has been loaded.
document.addEventListener('DOMContentLoaded', function () {
    // --- LOGIN FORM HANDLING ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            // 1. Prevent the default browser form submission which reloads the page.
            event.preventDefault();

            // 2. Get the values from the input fields.
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // 3. Prepare the data payload for the API call.
            const loginData = {
                email: email,
                password: password
            };

            // 4. Call our async function to handle the API request.
            handleAuthRequest('/api/v1/auth/authenticate', loginData, 'login-btn');
        });
    }

    // --- REGISTER FORM HANDLING ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const firstname = document.getElementById('firstname').value;
            const lastname = document.getElementById('lastname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const registerData = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password
            };

            handleAuthRequest('/api/v1/auth/register', registerData, 'register-btn');
        });
    }
});



async function handleAuthRequest(url, data, buttonId) {
    const button = document.getElementById(buttonId);
    const spinner = button.querySelector('.spinner-border');
    const alertPlaceholder = document.getElementById('alert-placeholder');

    // Reset UI state before the request
    alertPlaceholder.innerHTML = ''; // Clear previous error messages
    button.disabled = true;          // Disable the button to prevent multiple clicks
    spinner.classList.remove('d-none'); // Show the loading spinner

    try {
        // Use the Fetch API to make the POST request.
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Check if the response was successful (status code 200-299)
        if (response.ok) {
            // Convert the response body to JSON
            const result = await response.json();
            // Store the received token in the browser's localStorage
            localStorage.setItem('jwtToken', result.token);
            // Redirect the user to the dashboard page on success
            window.location.href = '/';
        } else {
            // If the server returned an error (e.g., 403 Forbidden for bad credentials)
            let errorMessage = 'An unknown error occurred. Please try again.';
            try {
                // Try to parse the error response from the server, if any
                const errorResult = await response.json();
                errorMessage = errorResult.message || `Error: ${response.statusText}`;
            } catch (e) {
                // If the error response wasn't JSON, use the status text
                errorMessage = `Error: ${response.status} ${response.statusText}`;
            }
            // Display the error message to the user
            showAlert(errorMessage, 'danger');
        }
    } catch (error) {
        // This catches network errors (e.g., server is down)
        console.error('Fetch error:', error);
        showAlert('Could not connect to the server. Please check your connection.', 'danger');
    } finally {
        // This block runs whether the request succeeded or failed.
        // Re-enable the button and hide the spinner so the user can try again.
        button.disabled = false;
        spinner.classList.add('d-none');
    }
}


function showAlert(message, type) {
    const alertPlaceholder = document.getElementById('alert-placeholder');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    alertPlaceholder.append(wrapper);
}