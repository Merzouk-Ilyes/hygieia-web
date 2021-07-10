
const eye = document.querySelector("#eye");
const eye2 = document.querySelector("#eye2");
const password = document.querySelector("#password");
const confirmpassword = document.querySelector("#confirmpassword");
function Validate() {
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirmpassword").value;
  if (password != confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }
  return true;
}

function forgetAlert() {
  alert("Votre email est correct !! ");
  window.open("//mail.google.com");
}


const eye = document.querySelector('#eye');
const password = document.querySelector('#password');
const confirmpassword = document.querySelector('#confirmpassword');
const btn = document.getElementById('btn');

const email_login = document.getElementById('email');

const password_login = document.getElementById('password');

eye.addEventListener('click', (e) => {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    if( type==='password' ) {
        eye.classList.remove('fi-rr-eye-crossed');
        eye.classList.toggle('fi-rr-eye');
    } else { 
        eye.classList.remove('fi-rr-eye');
        eye.classList.toggle('fi-rr-eye-crossed');  
    }
});
function Validate() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmpassword").value;
    if (password != confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }}





function forgetAlert() {
    alert("Votre email est correct !!!!");
    window.open('//mail.google.com'); 
}

function checkInputs() {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@esi-sba.dz/;
// email incorrect ; 
    if (!email_login.value.match(validRegex)) {
        const parent = email_login.parentElement.parentElement;
	const small = parent.querySelector('small');
	small.className = 'error';
	small.innerText = "Adresse e-mail incorrecte.";
    return ; 
    }else {
        const parent = email_login.parentElement.parentElement;
        const small = parent.querySelector('small');
        small.className = 'noterror';
        small.innerText = null;
     
    }
    if(password_login.value.length < 8) {
        const parent = password_login.parentElement.parentElement;
        const small = parent.querySelector('small');
        small.className = 'error';
        small.innerText = "Mot de passe incorrecte.";
        return ; 

    }else {
        const parent = password_login.parentElement.parentElement;
        const small = parent.querySelector('small');
        small.className = 'noterror';
        small.innerText = null ;   
    }
    $.ajax({
        method: 'POST',
        url: '/users/login',
        data: {
            "email": email_login.value,
            "password": password_login.value,
        },
        success: function (result) { 
            console.log(result);
            if (result.error == "Email incorrect!") {
                const parent = email_login.parentElement.parentElement;
                const small = parent.querySelector('small');
                small.className = 'error';
                small.innerText = "Adresse e-mail incorrecte.";
                return;
            }else if(result.error == "Votre compte est désactivé") {
                const parent = email_login.parentElement.parentElement;
                const small = parent.querySelector('small');
                small.className = 'error';
                small.innerText = "Votre compte est désactivé";
                return; 
            }else if(result.error == "Mot de passe incorrect") {
                const parent = email_login.parentElement.parentElement;
                const small = parent.querySelector('small');
                small.className = 'error';
                small.innerText = "Mot de passe incorrect";
                return;
            }else if(result.message == "Authentication successful!") {
                window.location.replace("/users/home");
            }
        }}); 
}

if (btn)
btn.addEventListener('click', e => {
  e.preventDefault();
  checkInputs();
});
