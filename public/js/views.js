const eye = document.querySelector('#eye');
const password = document.querySelector('#password');

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