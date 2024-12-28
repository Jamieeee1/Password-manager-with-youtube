//Function to save password to local storage
function savePasswords(passwords) {
  localStorage.setItem('passwords', JSON.stringify(passwords));
}

// Function to get passwords from local storage
function getPasswords() {
    return JSON.parse(localStorage.getItem('passwords')) || [];
}

// Function to render passwords
function renderPasswords() {
    const passwordList = document.getElementById('password-list');
    const passwords = getPasswords();
    passwordList.innerHTML = '';

    passwords.forEach((item, index) => {
      const listItem = document.createElement('li');

      //create a span for a website and password
      const passwordSpan = document.createElement('span');
      passwordSpan.innerHTML = `
      <strong>${item.website}</strong>: 
      <span class="passwpord" id ="password-${index}"> ${'*'.repeat(item.password.length)}</span>
      <i class="fas fa-eye show-password" onclick="togglePassword(${index})" title = "Show/HidePassword"></i>`;

      //create a div for action buttons
      const actionsDiv = document.createElement('div');
      actionsDiv.classList.add('actions');
      actionsDiv.innerHTML = `
      <i class = "fas fa-copy" onclick="copyPassword(${index})" title = "Copy"></i>
      <i class = "fas fa-edit" onclick="promptEditPassword(${index})" title = "Edit"></i>
      <i class = "fas fa-trash-alt" onclick="confirmDelete(${index})" title = "Delete"></i>
      `;

      //Append elements to the list item

      listItem.appendChild(passwordSpan);
      listItem.appendChild(actionsDiv);
      passwordList.appendChild(listItem);
    
    })
}

//Function to add a new password 
document.getElementById('add-btn').addEventListener('click', () => {
  const website = document.getElementById('website').value;
  const password = document.getElementById('password').value;

  if (website && password) {
    const passwords = getPasswords();
    passwords.push({website, password});
    savePasswords(passwords);
    renderPasswords();
    document.getElementById('website').value = '';
    document.getElementById('password').value = '';
  } else {
    showPopup('Please fill in both fields.');
  }
});

//Function to copy password

function copyPassword(index) {
  const passwords = getPasswords();
  navigator.clipboard.writeText(passwords[index].password);
  showPopup('Password copied to clipboard');
}

//Function to show custom popup

function showPopup (message, hasCancel = false, isEditing = false, index=null ) {
  const popup = document.getElementById('custom-popup');
  const popupMessage = document.getElementById('popup-message');
  const popupInputContainer = document.getElementById('popup-input-container');
  const popupInput = document.getElementById('popup-input');

  popupMessage.textContent = message;
  popupInputContainer.classList.toggle('hidden', !isEditing);
  document.getElementById('popup-cancel').classList.toggle('hidden', !hasCancel);

  if (isEditing && index !== null) {
    popupInput.value = getPasswords()[index].password;
  }

  popup.classList.remove('hidden');

  return new Promise((resolve) => {
    document.getElementById('popup-ok').onclick = () => {
      if (isEditing && index !== null) {
        const newPassword = popupInput.value;
        if (newPassword) {
          const passwords = getPasswords();
          passwords[index].password = newPassword;
          savePasswords(passwords);
          renderPasswords();
        } else {
          showPopup('Password cannot be empty');
          return
        }
      }
      popup.classList.add('hidden');
      resolve(true);
    };

    if (hasCancel) {
      document.getElementById('popup-cancel').onclick = () => {
        popup.classList.add('hidden');
        resolve(false);
      }
    };
  })

};


//function to confirm deletion with custom popup

async function confirmDelete(index) {
  const confirmed = await showPopup('Are you sure you want to delete this password?', true);
  if (confirmed) {
    deletePassword(index); 
  }
}

//Fuction for prompt editing password
async function promptEditPassword(index) {
  await showPopup('Enter new password:', false, true, index);
}

//Function to delete password 
function deletePassword(index) {
  const passwords = getPasswords();
  passwords.splice(index, 1);
  savePasswords(passwords);
  renderPasswords();
}

//Function to toggle password visibility
function togglePassword(index) {
  const passwordSpan = document.getElementById(`password-${index}`);
  const passwords = getPasswords();
 
  if (passwordSpan.textContent === '*'.repeat(passwords[index].password.length)) {
    passwordSpan.textContent = passwords[index].password;
  } else {
    passwordSpan.textContent = '*'.repeat(passwords[index].password.length);
  }
}


//Initial render of passwords
renderPasswords();
