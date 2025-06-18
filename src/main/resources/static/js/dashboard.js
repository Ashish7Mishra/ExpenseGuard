// Run this script after the HTML document has finished loading.
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('jwtToken');

    // --- Page Load Logic ---

    // 1. Check if the user is logged in.
    if (!token) {
        // If no token is found, redirect to the login page.
        window.location.href = '/login';
        return; // Stop executing the rest of the script.
    }

    // 2. If a token exists, fetch the user's expenses.
    fetchExpenses(token);


    // --- Event Listeners ---

    // 3. Listen for the submission of the "Add Expense" form.
    const addExpenseForm = document.getElementById('add-expense-form');
    addExpenseForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission.
        createExpense(token);
    });

    // 4. Listen for clicks on the "Delete" buttons.
    // We attach the listener to the table body to handle dynamically added buttons.
    const expenseTableBody = document.getElementById('expense-table-body');
    expenseTableBody.addEventListener('click', function (event) {
        // Check if the clicked element is a delete button.
        if (event.target && event.target.classList.contains('delete-btn')) {
            const expenseId = event.target.getAttribute('data-expense-id');
            if (confirm('Are you sure you want to delete this expense?')) {
                deleteExpense(token, expenseId);
            }
        }
    });

    // 5. Setup logout functionality.
    setupLogout();
});

/**
 * Fetches all expenses for the current user and renders them in the table.
 * @param {string} token The user's JWT.
 */
async function fetchExpenses(token) {
    const tableBody = document.getElementById('expense-table-body');
    const noExpensesMessage = document.getElementById('no-expenses-message');
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center">Loading...</td></tr>'; // Show a loading message.

    try {
        const response = await fetch('/api/v1/expenses', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const expenses = await response.json();
            renderExpenses(expenses);
        } else if (response.status === 403 || response.status === 401) {
            // If the token is invalid or expired, redirect to login.
            localStorage.removeItem('jwtToken');
            window.location.href = '/login';
        } else {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Could not load expenses.</td></tr>';
        }
    } catch (error) {
        console.error('Error fetching expenses:', error);
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Could not connect to server.</td></tr>';
    }
}

/**
 * Renders the list of expenses into the table.
 * @param {Array} expenses The array of expense objects.
 */
function renderExpenses(expenses) {
    const tableBody = document.getElementById('expense-table-body');
    const noExpensesMessage = document.getElementById('no-expenses-message');
    tableBody.innerHTML = ''; // Clear the table body first.

    if (expenses.length === 0) {
        noExpensesMessage.classList.remove('d-none'); // Show the "no expenses" message.
    } else {
        noExpensesMessage.classList.add('d-none'); // Hide the message.
        expenses.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.expenseDate}</td>
                <td>${expense.description}</td>
                <td class="text-end">$${expense.amount.toFixed(2)}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-danger delete-btn" data-expense-id="${expense.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

/**
 * Handles the creation of a new expense.
 * @param {string} token The user's JWT.
 */
async function createExpense(token) {
    const description = document.getElementById('expenseDescription').value;
    const amount = document.getElementById('expenseAmount').value;
    const expenseDate = document.getElementById('expenseDate').value;

    const expenseData = {
        description,
        amount,
        expenseDate
    };

    try {
        const response = await fetch('/api/v1/expenses', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseData)
        });

        if (response.ok) {
            // Close the modal (using Bootstrap's JS API)
            const modalElement = document.getElementById('addExpenseModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
            
            // Clear the form fields
            document.getElementById('add-expense-form').reset();

            // Refresh the expense list to show the new item.
            fetchExpenses(token);
        } else {
            // Handle errors (e.g., show an alert inside the modal)
            alert('Could not create expense. Please check your input.');
        }
    } catch (error) {
        console.error('Error creating expense:', error);
        alert('Could not connect to server.');
    }
}

/**
 * Deletes a specific expense.
 * @param {string} token The user's JWT.
 * @param {string} expenseId The ID of the expense to delete.
 */
async function deleteExpense(token, expenseId) {
    try {
        const response = await fetch(`/api/v1/expenses/${expenseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            // On successful deletion, just refresh the expense list.
            fetchExpenses(token);
        } else {
            alert('Could not delete expense. You may not have permission.');
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Could not connect to server.');
    }
}

/**
 * Sets up the logout button and navigation links.
 */
function setupLogout() {
    const navLinks = document.getElementById('nav-links');
    const token = localStorage.getItem('jwtToken');

    if (token) {
        // If logged in, show a "Logout" button.
        navLinks.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="#" id="logout-btn">Logout</a>
            </li>
        `;
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('jwtToken'); // The "logout" action.
            window.location.href = '/login'; // Redirect to login page.
        });
    } else {
        // If not logged in, show Login and Register links.
        navLinks.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="/login">Login</a></li>
            <li class="nav-item"><a class="nav-link" href="/register">Register</a></li>
        `;
    }
}