
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
  if (document.body.scrollTop < 10)
    document.getElementById("circle").style.opacity = 0;
  else document.getElementById("circle").style.opacity = 0.3;
});



//Form validation
const nom = document.getElementById("nom");
const prenom = document.getElementById("prenom");
const email = document.getElementById("email");
const mdp = document.getElementById("mdp");
const confirmerMdp = document.getElementById("confirmerMdp");
const numero = document.getElementById("numero");
const role = document.getElementById("roleInput");
const sexe = document.getElementById("sexe");
const date = document.getElementById("date");
const lieu = document.getElementById("lieu");
const ajouterBtn = document.getElementById("ajouterBtn");
ajouterBtn.addEventListener("click" , (e) => {
  e.preventDefault()
  checkInputs()
})
function checkInputs() {
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@esi-sba.dz/;
  if (nom.value.length < 4) {
    const parent = nom.parentElement;
    const small = parent.querySelector("small");
    small.className = "";
    small.innerText = "Nom doit être >= 4";
    return;
  } else {
    const parent = nom.parentElement;
    const small = parent.querySelector("small");
    small.className = "noterror";
    small.innerText = null;
  }
  if (prenom.value.length < 4) {
    const parent = prenom.parentElement;
    const small = parent.querySelector("small");
    small.className = "";
    small.innerText = "Prénom doit être >= 4";
    return;
  } else {
    const parent = prenom.parentElement;
    const small = parent.querySelector("small");
    small.className = "noterror";
    small.innerText = null;
  }
  if (date.value.length ==0 || date.value == null) {
    const parent = date.parentElement;
    const small = parent.querySelector("small");
    small.className = "";
    small.innerText = "Date de naissance n'éxiste pas" ;
    return;
  } else {
    const parent = date.parentElement;
    const small = parent.querySelector("small");
    small.className = "noterror";
    small.innerText = null;
  }
  if (numero.value.length < 9) {
    const parent = numero.parentElement;
    const small = parent.querySelector("small");
    small.className = "";
    small.innerText = "Numéro incorrecte.";
    return;
  } else {
    const parent = numero.parentElement;
    const small = parent.querySelector("small");
    small.className = "noterror";
    small.innerText = null;
  }
  
  if (!email.value.match(validRegex)) {
    const parent = email.parentElement;
    const small = parent.querySelector("small");
    small.className = "";
    small.innerText = "Adresse e-mail incorrecte.";
    return;
  } else {
    const parent = email.parentElement;
    const small = parent.querySelector("small");
    small.className = "noterror";
    small.innerText = null;
  }
  if (mdp.value.length < 6) {
    const parent = mdp.parentElement;
    const small = parent.querySelector("small");
    small.className = "";
    small.innerText = "Mot de passe doit être >= 6.";
    return;
  } else {
    const parent = mdp.parentElement;
    const small = parent.querySelector("small");
    small.className = "noterror";
    small.innerText = null;
  } if(mdp.value !== confirmerMdp.value){
    const parent = confirmerMdp.parentElement;
    const small = parent.querySelector("small");
    small.className = "";
    small.innerText = "Mots de passe pas égaux";
    return;

  }else {
    const parent = confirmerMdp.parentElement;
    const small = parent.querySelector("small");
    small.className = "noterror";
    small.innerText = null;
  } 
  $.ajax({
    method: "POST",
    url: "/users/admin/add",
    data: {
      "email": email.value,
      "password": mdp.value,
      "firstname":nom.value,
      "lastname":prenom.value,
      "birthday":date.value,
      "birthplace":lieu.value,
      "sexe":sexe.value,
      "role":role.value,
      "phone":numero.value,
    },
    success: function (result) {
      console.log(result);
      if (result.error == "Email already exists ! ") {
        const parent = email.parentElement;
        const small = parent.querySelector("small");
        small.className = "";
        small.innerText = "Adresse e-mail exist déja !";
        return;
      } 
      
      document.getElementById('alertId').classList.add('showAlert');

      setTimeout(function(){
      document.getElementById('alertId').classList.remove('showAlert');
      }, 15000);
      document.location.reload()

    },
  });
}

//Form up date validation
const nomup = document.getElementById("nomup");
const prenomup = document.getElementById("prenomup");
const numeroup = document.getElementById("numeroup");
const roleInputup = document.getElementById("roleInputup");
const sexeup = document.getElementById("sexeup");
const dateup = document.getElementById("dateup");
const lieuup = document.getElementById("lieuup");
const emailup = document.getElementById("emailup");

const popupupdate = document.querySelector(".popupupdate");
function showPopup(email){
  var data = {
    email :email,
  }
  $.ajax({
    method: "POST",
    url: "/users/admin/update",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function(user){
      nomup.value=user.firstname;
      prenomup.value=user.lastname;
      numeroup.value=user.phonenumber;
      roleInputup.value=user.role;
      sexeup.value=user.sexe;
      dateup.value=user.birthday;
      lieuup.value=user.birthplace;
      emailup.value=user.email;
      popupupdate.classList.add("open");
     
    },
  });
 
}
function hidePopupupdate() {
  popupupdate.classList.remove("open");
}


function updatedatabtn(){
  checkInputsup()
}
function checkInputsup() {


  if (nomup.value.length < 4) {
    const parent = nomup.parentElement;
    const small = parent.querySelector("small");
    small.className = "";
    small.innerText = "Nom doit être >= 4";
    return;
  } else {
    const parent = nomup.parentElement;
    const small = parent.querySelector("small");
    small.className = "noterror";
    small.innerText = null;
  }
  if (prenomup.value.length < 4) {
    const parent = prenomup.parentElement;
    const small = parent.querySelector("small");
    small.className = "";
    small.innerText = "Prénom doit être >= 4";
    return;
  } else {
    const parent = prenomup.parentElement;
    const small = parent.querySelector("small");
    small.className = "noterror";
    small.innerText = null;
  }
  if (dateup.value.length ==0 || dateup.value == null) {
    const parent = dateup.parentElement;
    const small = parent.querySelector("small");
    small.className = "";
    small.innerText = "Date de naissance n'éxiste pas" ;
    return;
  } else {
    const parent = dateup.parentElement;
    const small = parent.querySelector("small");
    small.className = "noterror";
    small.innerText = null;
  }
  if (numeroup.value.length < 9) {
    const parent = numeroup.parentElement;
    const small = parent.querySelector("small");
    small.className = "";
    small.innerText = "Numéro incorrecte.";
    return;
  } else {
    const parent = numeroup.parentElement;
    const small = parent.querySelector("small");
    small.className = "noterror";
    small.innerText = null;
  };
  console.log(
  "prenom " +  prenomup.value, 
    "nom " + nomup.value
  );
  $.ajax({
    method: "POST",
    url: "/users/admin/modifier",
    data: {
      "firstname":prenomup.value,
      "lastname":nomup.value,
      "birthday":dateup.value,
      "birthplace":lieuup.value,
      "sexe":sexeup.value,
      "role":roleInputup.value,
      "phone":numeroup.value,
      "email":emailup.value,
    },
    success: function (update) {
      document.getElementById('alertup').classList.add('showAlert');

      setTimeout(function(){
      document.getElementById('alertup').classList.remove('showAlert');
      }, 15000);
   

    },
  }); 
}





