const btnAddIntoxication = document.getElementById('btn-intoxication'); 
const inputNameIntoxication = document.getElementById('name-intoxication'); 
const inputDegreeIntoxication = document.getElementById('degree-intoxication'); 
const btn_modifier_info = document.getElementById('modifier-info');
const nombre_de_cigarette = document.getElementById("nombre-de-cigarette"); 
const nombre_de_boite =document.getElementById("nombre-de-boite"); 
const nombre_de_boite2 =document.getElementById("nombre-de-boite2"); 
const age_de_prise = document.getElementById('age-de-prise');
const duration = document.getElementById('duration');
const a_fumer =  document.getElementById('a-fumer'); 
const aa_fumer =  document.getElementById('ancien-fumeur');
const a_chiquer =  document.getElementById('a-chiquer'); 
const a_alcool = document.getElementById('a-alcool');
const a_prise = document.getElementById('a-prise');
const addaffection = document.getElementById('btn-add-affection'); 
const nameaffection = document.getElementById('name-affection'); 
const dateaffection = document.getElementById('degre-affection'); 
const nameMaladie = document.getElementById('name-maladie');
const dateMaladie = document.getElementById('date-maladie');
const nameDrug = document.getElementById('name-drug'); 
const typeDrug  = document.getElementById('type-drug');
const item1 = document.getElementById('item1'); 
const item2 = document.getElementById('item2'); 
const item3 = document.getElementById('item3'); 
const item4 = document.getElementById('item4');
item1.onclick = function() {
  

    item1.className = "i-item-active" ; 
    item2.className = "i-item" ; 
    item3.className = "i-item" ; 
    item4.className = "i-item" ; 
    window.location.hash = "place1";

}
item2.onclick = function() {
    item1.className = "i-item" ; 
    item2.className = "i-item-active" ; 
    item3.className = "i-item" ; 
    item4.className = "i-item" ; 
    window.location.hash = "place2";
}
item3.onclick = function() {
    item1.className = "i-item" ; 
    item2.className = "i-item" ; 
    item3.className = "i-item-active" ; 
    item4.className = "i-item" ; 
    window.location.hash = "place3";

}
item4.onclick = function() {
    item1.className = "i-item" ; 
    item2.className = "i-item" ; 
    item3.className = "i-item" ; 
    item4.className = "i-item-active" ; 
    window.location.hash = "place4";

} 
function addAffection() {
    if(nameaffection.value.length == 0) {
        showMsg( "Vous devez choisir l'affection congénitale",false)
        return; 
    }
   if(dateaffection.value.length  == 0) {
      showMsg(" Vous devez entrer la date de fin de l'affection congénitale",false)
       // show error message 
       return; 
   }
  
    $.ajax({
        method: 'POST',
        url: '/users/medecin/addAffection',
        data: {
            "IdPatient" : patient.IdPatient,
            "name_ccondition" : nameaffection.value,
            "ended"  : dateaffection.value, 
        },
        success: function (result) { 
   
            if(result =="done") {
                // Insert a row at the end of table
                var tbodyRef = document.getElementById('myTable2').getElementsByTagName('tbody')[0];

var newRow = tbodyRef.insertRow();

// Insert a cell at the end of the row
var newCell1 = newRow.insertCell();
var newCell2 = newRow.insertCell();
var newCell3 = newRow.insertCell();
var newCell4 = newRow.insertCell();
// Append a text node to the cell
var newText = document.createTextNode(document.getElementById("myTable2").rows.length-1);

newCell1.appendChild(newText);
newText = document.createTextNode(nameaffection.value);
newCell2.appendChild(newText);
newText = document.createTextNode(dateaffection.value);
newCell3.appendChild(newText);
let btn = document.createElement("button");
btn.innerHTML = "Supprimer";
btn.type = "button";
btn.className = "btn btn-danger";
btn.id = "btn-delete-affection";
btn.value = nameaffection.value; 
newCell4.appendChild(btn);
showMsg("Affection congénitale ajoutée avec sucées",true)
             // show success message 
            }else {
                if(result == "exist") {
                    showMsg("Affection congénitale éxiste déja",false); 
                }
             // show error message 
            }
        }});

}





btn_modifier_info.onclick = function(){

   

window.close();
  
    if(nombre_de_cigarette.value.length == 0) {
        showMsg(" Vous devez enter le nombre de cigarette",false)
        return; 
    }
    if( nombre_de_boite.value.length == 0) {
        showMsg(" Vous devez enter le nombre de boites",false)
        return; 
    }
    if( nombre_de_boite2.value.length == 0) {
        showMsg(" Vous devez enter le nombre de boites",false)
        return; 
    }
    if(age_de_prise.value.length == 0) {
        showMsg(" Vous devez enter l'age de prise",false)
        return; 
    }
    if(duration.value.length == 0) {
        showMsg(" Vous devez enter la période",false)
        return; 
    }
    $.ajax({
        method: 'POST',
        url: '/users/medecin/updatePersonalHistory',
        data: {
            'Idpersonalhistory' : patient.Idpersonalhistory,
            'Smoke': a_fumer.checked,
            'Cigarette': nombre_de_cigarette.value,
            'Chiquer': a_chiquer.checked,
            'Boxchique': nombre_de_boite.value,
            'Boxtoken': nombre_de_boite2.value,
            'Ageoftoken': age_de_prise.value,
            'Smoked': aa_fumer.checked,
            'duration': duration.value,
            'alcohol': a_alcool.checked,
            'token' : a_prise.checked , 
        },
        success: function (result) { 

            if(result =="done") {
                
showMsg(" Modification sauvgardé avec succées",true); 
// supprimer le row 

             // show success message 
            }else {
            
             // show error message 
            }
    
        }});

}
const msg = document.getElementById("msg");
const icon = document.getElementById("icon-msg");  

const popupupdate = document.querySelector(".popupupdate");
const patient = JSON.parse(parsed_data);
var buttons = document.getElementsByTagName("button"); //returns a nodelist
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function() {
    
    buttonsControl(this, i);
  }, false);
}

function buttonsControl(button, i) {
    console.log(button.value);
    if(button.id == "btn-delete-examen"){
        const myArr = button.value.split(",");
        $.ajax({
            method: 'POST',
            url: '/users/medecin/deleteExamFile',
            data: {    
      "med": myArr[1], 
      "pat":myArr[0] , 
      "exdate":myArr[2], 
            },
            success: function (result) { 
                console.log("wow");
             console.log(result);
                
                
    showMsg(result.msg,result.err); 
    // supprimer le row 
    window.location.reload();
                 // show success message 
                
        
            }});
    }
if(button.id === "btn-intoxication" ) {
    addIntoxication();
}else {
    if(button.id == "btn-add-affection") {
        addAffection(); 
        return; 
    }
    if(button.id == "btn-add-maladie") {
        addMaladie(); 
        return;
    }
    if(button.id == 'btn-add-drug') {
        addAllergy(); 
        return; 
    }
if(button.id === "btn-delete-intoxication"){

    $.ajax({
        method: 'POST',
        url: '/users/medecin/deleteIntoxication',
        data: {
            "Idpersonalhistory" : patient.Idpersonalhistory,
            "name_intoxication"  : button.value, 
        },
        success: function (result) { 
          console.log(result,"delete intoxication");
            if(result =="done") {
                
showMsg(" intoxication supprimer avec succés",true); 
// supprimer le row 
window.location.reload();
             // show success message 
            }else {
             // show error message 
            }
        }});
}
if(button.id == 'btn-delete-affection') {
    $.ajax({
        method: 'POST',
        url: '/users/medecin/deleteAffection',
        data: {
            "IdPatient" : patient.IdPatient,
            "name_ccondition" : button.value,
        },
        success: function (result) { 
         console.log(result);
            if(result =="done") {
                
showMsg("affection congénitale supprimer avec succés",true); 
// supprimer le row 
window.location.reload();
             // show success message 
            }else {
            
             // show error message 
            }
    
        }});
}
if(button.id == "btn-delete-containgeneralillness") {
    $.ajax({
        method: 'POST',
        url: '/users/medecin/deleteMaladie',
        data: {
            "IdPatient" : patient.IdPatient,
            "name_GIllness" : button.value,
        },
        success: function (result) { 
            console.log("wow");
         console.log(result);
            if(result =="done") {
            
showMsg("affection congénitale supprimer avec succés",true); 
// supprimer le row 
window.location.reload();
             // show success message 
            }else {
            
             // show error message 
            }
    
        }});
}
if(button.id == "btn-delete-allergie") {
    $.ajax({
        method: 'POST',
        url: '/users/medecin/deleteAllergie',
        data: {
            "IdPatient" : patient.IdPatient,
            "name_drug" : button.value,
        },
        success: function (result) { 
            console.log("wow");
         console.log(result);
            if(result =="done") {
showMsg("Allergie supprimer avec succés",true); 
// supprimer le row 
window.location.reload();
             // show success message 
            } else {
             // show error message 
            }
    
        }});
}
}
}
 function addIntoxication() {
  if(inputNameIntoxication.value.length == 0) {

      showMsg( " Vous devez choisir l'intoxication",false);
      return; 
  }
 if(inputDegreeIntoxication.value.length  == 0) {
    showMsg(" Vous devez entrer le degré de l'intoxication",false);
       // show error message 
     return; 
 }
    $.ajax({
        method: 'POST',
        url: '/users/medecin/addIntoxication',
        data: {
            "IdPatient" : patient.IdPatient,
            "name_intoxication"  : inputNameIntoxication.value , 
            "degree_intoxication" : inputDegreeIntoxication.value, 
        },
        success: function (result) { 
            if(result =="done") {
                // Insert a row at the end of table
                var tbodyRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];

var newRow = tbodyRef.insertRow();

// Insert a cell at the end of the row
var newCell1 = newRow.insertCell();
var newCell2 = newRow.insertCell();
var newCell3 = newRow.insertCell();
var newCell4 = newRow.insertCell();
// Append a text node to the cell
var newText = document.createTextNode(document.getElementById("myTable").rows.length-1);

newCell1.appendChild(newText);
newText = document.createTextNode(inputNameIntoxication.value);
newCell2.appendChild(newText);
newText = document.createTextNode(inputDegreeIntoxication.value);
newCell3.appendChild(newText);
let btn = document.createElement("button");

btn.innerHTML = "Supprimer";
btn.type = "button";
btn.className = "btn btn-danger";
btn.id = "btn-delete-intoxication";
btn.value = inputNameIntoxication.value ; 

newCell4.appendChild(btn);
showMsg(" Intoxication ajoutée avec sucées",true)
                inputNameIntoxication.value = "" ; 
                inputDegreeIntoxication.value = ""; 
             // show success message 
            }else {
                if(result == "exist") {
                    showMsg("Intoxication existe déja",false); 
                }
             // show error message 
            }
        }});
 
}

function showMsg(str,err) {
    if(err == true) {
        icon.className = "fas fa-check"
    }else {
        icon.className = "fas fa-exclamation" 
    }
    msg.innerHTML = str ;
                $('.alert').addClass("show");
                $('.alert').removeClass("hide");
                $('.alert').addClass("showAlert");
                setTimeout(function(){
                  $('.alert').removeClass("show");
                  $('.alert').addClass("hide");
                },5000);

}

function addIntoxication() {
    if(inputNameIntoxication.value.length == 0) {
  
        showMsg( " Vous devez choisir l'intoxication",false);
    }
   if(inputDegreeIntoxication.value.length  == 0) {
      showMsg(" Vous devez entrer le degré de l'intoxication",false);
         // show error message 
       return; 
   }
      $.ajax({
          method: 'POST',
          url: '/users/medecin/addIntoxication',
          data: {
              "IdPatient" : patient.IdPatient,
              "name_intoxication"  : inputNameIntoxication.value , 
              "degree_intoxication" : inputDegreeIntoxication.value, 
          },
          success: function (result) { 
              if(result =="done") {
                showMsg("Intoxication ajoutée avec sucées",true)
               
      
          
                
                  // Insert a row at the end of table
                  var tbodyRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
  
  var newRow = tbodyRef.insertRow();
  
  // Insert a cell at the end of the row
  var newCell1 = newRow.insertCell();
  var newCell2 = newRow.insertCell();
  var newCell3 = newRow.insertCell();
  var newCell4 = newRow.insertCell();
  // Append a text node to the cell
  var newText = document.createTextNode(document.getElementById("myTable").rows.length-1);
  
  newCell1.appendChild(newText);
  newText = document.createTextNode(inputNameIntoxication.value);
  newCell2.appendChild(newText);
  newText = document.createTextNode(inputDegreeIntoxication.value);
  newCell3.appendChild(newText);
  let btn = document.createElement("button");
  
  btn.innerHTML = "Supprimer";
  btn.type = "button";
  btn.className = "btn btn-danger";
  btn.id = "btn-delete-intoxication";
  btn.value = inputNameIntoxication.value ; 
  
  newCell4.appendChild(btn);
  
                  inputNameIntoxication.value = "" ; 
                  inputDegreeIntoxication.value = ""; 
               // show success message 
              }else {
                  if(result == "exist") {
                      showMsg("Intoxication existe déja",false); 
                  }
               // show error message 
              }
          }});
   
  }

  function addMaladie() {
    if(nameMaladie.value.length == 0) {
        showMsg( " Vous devez choisir la maladie",false);
        return; 
    }
   if(dateMaladie.value.length  == 0) {
      showMsg(" Vous devez entrer la date de la maladie",false);
         // show error message 
       return; 
   }
      $.ajax({
          method: 'POST',
          url: '/users/medecin/addMaladie',
          data: {
              "IdPatient" : patient.IdPatient,
              "name_GIllness"  : nameMaladie.value , 
              "dateillness" : dateMaladie.value, 
          },
          success: function (result) { 
              if(result =="done") {
                showMsg("Maladie ajoutée avec sucées",true)
                window.location.reload();
return;
                  // Insert a row at the end of table
                  var tbodyRef = document.getElementById('myTable3').getElementsByTagName('tbody')[0];
  
  var newRow = tbodyRef.insertRow();
  
  // Insert a cell at the end of the row
  var newCell1 = newRow.insertCell();
  var newCell2 = newRow.insertCell();
  var newCell3 = newRow.insertCell();
  var newCell4 = newRow.insertCell();
  // Append a text node to the cell
  var newText = document.createTextNode(document.getElementById("myTable3").rows.length-1);
  
  newCell1.appendChild(newText);
  newText = document.createTextNode(nameMaladie.value);
  newCell2.appendChild(newText);
  newText = document.createTextNode(dateMaladie.value);
  newCell3.appendChild(newText);
  let btn = document.createElement("button");
  
  btn.innerHTML = "Supprimer";
  btn.type = "button";
  btn.className = "btn btn-danger";
  btn.id = "btn-delete-intoxication";
  btn.value = inputNameIntoxication.value ; 
  
  newCell4.appendChild(btn);
  showMsg("Maladie ajoutée avec sucées",true)
                  inputNameIntoxication.value = "" ; 
                  inputDegreeIntoxication.value = ""; 
               // show success message 
              }else {
                  if(result == "exist") {
                      showMsg("Maladie existe déja",false); 
                  }
               // show error message 
              }
          }});
   
  }
  function addAllergy() {
    if(nameDrug.value.length == 0) {
        showMsg("Vous devez choisir l'allergie",false);
        return; 
    }
   if(typeDrug.value.length  == 0) {
      showMsg(" Vous devez entrer le type de l'alergie",false);
         // show error message 
       return; 
   }
      $.ajax({
          method: 'POST',
          url: '/users/medecin/addAllergy',
          data: {
              "IdPatient" : patient.IdPatient,
              "name_drug"  : nameDrug.value , 
              "type" : typeDrug.value, 
          },
          success: function (result) { 
              if(result =="done") {
                  // Insert a row at the end of table
                  var tbodyRef = document.getElementById('myTable4').getElementsByTagName('tbody')[0];
  
  var newRow = tbodyRef.insertRow();
  
  // Insert a cell at the end of the row
  var newCell1 = newRow.insertCell();
  var newCell2 = newRow.insertCell();
  var newCell3 = newRow.insertCell();
  var newCell4 = newRow.insertCell();
  // Append a text node to the cell
  var newText = document.createTextNode(document.getElementById("myTable4").rows.length-1);
  
  newCell1.appendChild(newText);
  newText = document.createTextNode(nameDrug.value);
  newCell2.appendChild(newText);
  newText = document.createTextNode(typeDrug.value);
  newCell3.appendChild(newText);
  let btn = document.createElement("button");
  
  btn.innerHTML = "Supprimer";
  btn.type = "button";
  btn.className = "btn btn-danger";
  btn.id = "btn-delete-intoxication";
  btn.value = inputNameIntoxication.value ; 
  
  
  newCell4.appendChild(btn);
  showMsg("Allergie ajoutée avec sucées",true)
                  inputNameIntoxication.value = "" ; 
                  inputDegreeIntoxication.value = ""; 
               // show success message 
              }else {
                  if(result == "exist") {
                      showMsg("Intoxication existe déja",false); 
                  }
               // show error message 
              }
          }});

  }