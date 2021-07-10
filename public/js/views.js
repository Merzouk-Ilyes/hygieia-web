
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
// SEARCH ALGO
function myFunction() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("form1");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
    // td = tr[i].getElementsByTagName("td")[3];
    // if (td) {
    //   txtValue = td.textContent || td.innerText;
    //   if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //     tr[i].style.display = "";
    //   } else {
    //     tr[i].style.display = "none";
    //   }
    // }
  }
}

function myFunction2() {
  // Declare variables

  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("category");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  // Loop through all table rows, and hide those who don't match the search query
  input2 = document.getElementById("form1");
  input2.value = "";
  if (filter === "TOUS") {
    for (i = 0; i < tr.length; i++) {
      tr[i].style.display = "";
    }
    return;
  }
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[4];
    
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
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

// POPUP
const show = document.querySelector(".add");
const popup = document.querySelector(".popup");
show.addEventListener("click", () => {
  popup.classList.add("open");
});
function hidePopup() {
  popup.classList.remove("open");
}

document.querySelector(".container2").addEventListener("scroll", function (e) {
  console.log(document.body.scrollTop);
  if (document.body.scrollTop < 10)
    document.getElementById("circle").style.opacity = 0;
  else document.getElementById("circle").style.opacity = 0.3;
});



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
