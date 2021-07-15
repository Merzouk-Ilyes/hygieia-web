const btn = document.getElementById('btn');
const email = document.getElementById('email');

if (btn)
btn.addEventListener('click', e => {
    console.log(email.value);
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@esi-sba.dz/;
    // email incorrect ; 
        if (!email.value.match(validRegex)) {
            const parent = email.parentElement.parentElement; 
        const small = parent.querySelector('small');
        small.className = 'error';
        small.innerText = "Adresse e-mail incorrecte.";
        return ; 
        }else {
            const parent = email.parentElement.parentElement;
            const small = parent.querySelector('small');
            small.className = 'noterror';
            small.innerText = null;
         
        }
        $.ajax({
            method: 'POST',
            url: '/users/forget',
            data: {
                "email": email.value,
          
            },
            success: function (result) { 
                console.log(result);
                       const parent = email.parentElement.parentElement;
                    const small = parent.querySelector('small');
                    small.className = 'error';
                    small.innerText = result.error == null ? result.message : result.error ;  
                  if(result.message) {
                    setTimeout(() => {
                        window.location.replace("/users/login");
                    },5000);
                   
                  }
            }}); 
    
});