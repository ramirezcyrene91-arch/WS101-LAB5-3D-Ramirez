// ws.js

document.addEventListener('DOMContentLoaded', function() {
    fetchEmployees(); 

    const form = document.getElementById('employee-form');
    form.addEventListener('submit', handleFormSubmit);
});

async function fetchEmployees() {
    try {
        const response = await fetch('/api/employees'); 
        if (!response.ok) {
            throw new Error('Failed to fetch employees');
        }
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        showStatusMessage('Error fetching employees: ' + error.message, 'error');
    }
}

function displayEmployees(employees) {
    const tbody = document.querySelector('#employee-table tbody');
    tbody.innerHTML = ''; 

    if (employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No employees found.</td></tr>';
        return;
    }

    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.firstName}</td>
            <td>${employee.lastName}</td>
            <td>${employee.email}</td>
            <td>
                <button onclick="editEmployee(${employee.id}, '${employee.firstName}', '${employee.lastName}', '${employee.email}')">Edit</button>
                <button onclick="deleteEmployee(${employee.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editEmployee(id, firstName, lastName, email) {
    document.getElementById('grade-id').value = id;
    document.getElementById('uname').value = firstName;
    document.getElementById('Lname').value = lastName;
    document.getElementById('EmailAdd').value = email;
    document.getElementById('uname').focus();
}

async function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) {
        return;
    }

    try {
        const response = await fetch(`/api/employees/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete employee');
        }
        showStatusMessage('Employee deleted successfully!', 'success');
        fetchEmployees(); 
    } catch (error) {
        showStatusMessage('Error deleting employee: ' + error.message, 'error');
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('grade-id').value;
    const firstName = document.getElementById('uname').value.trim();
    const lastName = document.getElementById('Lname').value.trim();
    const email = document.getElementById('EmailAdd').value.trim();

    if (!firstName || !lastName || !email) {
        showStatusMessage('Please fill in all fields.', 'error');
        return;
    }

    const employee = { firstName, lastName, email };

    try {
        let response;
        if (id) {
            
            response = await fetch(`/api/employees/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employee)
            });
        } else {
            
            response = await fetch('/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employee)
            });
        }

        if (!response.ok) {
            throw new Error('Failed to save employee');
        }

        showStatusMessage(id ? 'Employee updated successfully!' : 'Employee added successfully!', 'success');
        document.getElementById('employee-form').reset();
        document.getElementById('grade-id').value = '';
        fetchEmployees(); 
    } catch (error) {
        showStatusMessage('Error saving employee: ' + error.message, 'error');
    }
}

function showStatusMessage(message, type) {
    const statusElement = document.getElementById('status-message');
    statusElement.textContent = message;
    statusElement.style.color = type === 'error' ? '#ff0000' : '#008000'; 
    setTimeout(() => {
        statusElement.textContent = '';
    }, 5000); 
}
