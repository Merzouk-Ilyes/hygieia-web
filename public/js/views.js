const eye = document.querySelector('#eye');
const eye2=document.querySelector('#eye2')
const password = document.querySelector('#password');
const confirmpassword = document.querySelector('#confirmpassword');

eye.addEventListener('click', (e) =>{
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    if(type==='password'){
        eye.classList.remove('fi-rr-eye-crossed');
        eye.classList.toggle('fi-rs-eye');
    }else{
        eye.classList.remove('fi-rs-eye');
        eye.classList.toggle('fi-rr-eye-crossed');  
    }
});

eye2.addEventListener('click', (e) =>{
    // toggle the type attribute
    const type = confirmpassword.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmpassword.setAttribute('type', type);
    // toggle the eye slash icon
    if(type==='password'){
        eye2.classList.remove('fi-rr-eye-crossed');
        eye2.classList.toggle('fi-rs-eye');
    }else{
        eye2.classList.remove('fi-rs-eye');
        eye2.classList.toggle('fi-rr-eye-crossed');  
    }
});

function Validate() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmpassword").value;
    if (password != confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }
    return true;
}

function forgetAlert(){
    alert("Votre email est correct !! ");
    window.open('//mail.google.com'); 
}
