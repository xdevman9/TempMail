const apiUrl = 'https://www.1secmail.com/api/v1/';

const generateBtn = document.getElementById('generateBtn');
const emailBox = document.getElementById('emailBox');
const checkEmailBtn = document.getElementById('checkEmailBtn');
const emailList = document.getElementById('emailList');
const emailContainer = document.querySelector('.email-container');

function generateEmail() {
    fetch(`${apiUrl}?action=genRandomMailbox&count=1`)
        .then(response => response.json())
        .then(data => {
            const randomEmail = data[0];
            emailBox.innerText = randomEmail;
            emailContainer.style.display = 'block';

            localStorage.setItem('generatedEmail', randomEmail);
        });
}

function checkInbox() {
    const emailParts = emailBox.innerText.split('@');
    const login = emailParts[0];
    const domain = emailParts[1];

    fetch(`${apiUrl}?action=getMessages&login=${login}&domain=${domain}`)
        .then(response => response.json())
        .then(data => {
            emailList.innerHTML = ''; 
            if (data.length > 0) {
                data.forEach(email => {
                    const emailItem = document.createElement('div');
                    emailItem.classList.add('email-item');
                    emailItem.innerHTML = `
                        <strong>From:</strong> ${email.from}<br>
                        <strong>Subject:</strong> ${email.subject}<br>
                        <small>${email.date}</small>
                    `;
                    emailItem.addEventListener('click', () => viewMessage(email.id, login, domain));
                    emailList.appendChild(emailItem);
                });
            } else {
                emailList.innerHTML = 'No messages yet.';
            }
        });
}

function viewMessage(id, login, domain) {
    fetch(`${apiUrl}?action=readMessage&login=${login}&domain=${domain}&id=${id}`)
        .then(response => response.json())
        .then(data => {
            alert(`From: ${data.from}\nSubject: ${data.subject}\nMessage: ${data.body}`);
        });
}

window.onload = function() {
    const savedEmail = localStorage.getItem('generatedEmail');
    if (savedEmail) {
        emailBox.innerText = savedEmail;
        emailContainer.style.display = 'block';
    }
}

// Event listeners
generateBtn.addEventListener('click', generateEmail);
checkEmailBtn.addEventListener('click', checkInbox);
