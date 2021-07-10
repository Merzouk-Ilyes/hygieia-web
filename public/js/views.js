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

// const eye = document.querySelector('#eye');
// const eye2 = document.querySelector('#eye2');
// const password = document.querySelector('#password');
// const confirmer = document.querySelector('#confirmer');
// eye.addEventListener('click', (e) =>{
//     // toggle the type attribute
//     const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
//     password.setAttribute('type', type);
//     // toggle the eye slash icon
//     if(type==='password'){
//         eye.classList.remove('fi-rr-eye-crossed');
//         eye.classList.toggle('fi-rr-eye');
//     }else{
//         eye.classList.remove('fi-rr-eye');
//         eye.classList.toggle('fi-rr-eye-crossed');

//     }

// });
// eye2.addEventListener('click', (e) =>{
//     // toggle the type attribute
//     const type = confirmer.getAttribute('type') === 'password' ? 'text' : 'password';
//     confirmer.setAttribute('type', type);
//     // toggle the eye slash icon
//     if(type==='password'){
//         eye2.classList.remove('fi-rr-eye-crossed');
//         eye2.classList.toggle('fi-rr-eye');
//     }else{
//         eye2.classList.remove('fi-rr-eye');
//         eye2.classList.toggle('fi-rr-eye-crossed');

//     }

// });
