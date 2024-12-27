
function savePassword(passwords) {
  localStorage.setItem('passwords', JSON.stringify(passwords));
}

// Function to get passwords from local storage

function getPasswords() {
    return JSON.parse(localStorage.getItem('passwords') || '[]');
}

// Function to render passwords
function renderPasswords() {
    const passwordList = document.getElementById('password-list');
}