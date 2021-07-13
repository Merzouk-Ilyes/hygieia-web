const btn = document.getElementById('btn'); 
const form = document.getElementById('form').action ; 

btn.addEventListener('click', (e) => { 
    e.preventDefault();
    onClickBtn(); 
});
var password = document.getElementById("password");
var confirmPassword = document.getElementById("confirmpassword");
function onClickBtn() {



    if( password.value.length < 8 ) {
        const parent = password.parentElement.parentElement;
        const small = parent.querySelector('small');
        small.className = 'error';
        small.innerText = "La taille du mot de passe doit être au minimum 8 charachteres";
        return;

    }else {
        const parent = password.parentElement.parentElement;
        const small = parent.querySelector('small');
        small.className = 'noterror';
        small.innerText = null ;
    }
     if (password.value != confirmPassword.value) {
     const parent = confirmPassword.parentElement.parentElement ; 
     const small = parent.querySelector('small');
        small.className = 'error';
        small.innerText = "Le mot de passe doit être le méme";
        return ; 
    }else {
        const parent = confirmPassword.parentElement.parentElement ; 
     const small = parent.querySelector('small');
        small.className = 'noterror';
        small.innerText = null;
      
    }
    $.ajax({
        method: 'POST',
        url: form,
        data: {
            "password" : password.value , 
      
        },
        success: function (result) { 
                   const parent = password.parentElement.parentElement;
                const small = parent.querySelector('small');
                small.className = 'error';
                small.innerText = result.error == null ? result.message : result.error ;  
              if(result.message) {
                setTimeout(() => {
                    window.location.replace("/users/login");
                },3000);
              }
        }}); 

}

  

const eye = document.getElementById('eye'); 
const eye2 = document.getElementById('eye2'); 
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
eye2.addEventListener('click', (e) => {
    // toggle the type attribute
    const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPassword.setAttribute('type', type);
    // toggle the eye slash icon
    if( type==='password' ) {
        eye2.classList.remove('fi-rr-eye-crossed');
        eye2.classList.toggle('fi-rr-eye');
    } else { 
        eye2.classList.remove('fi-rr-eye');
        eye2.classList.toggle('fi-rr-eye-crossed');  
    }
});