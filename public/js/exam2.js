item1.onclick = function() {
  

    item1.className = "i-item-active" ; 
    item2.className = "i-item" ; 
    item3.className = "i-item" ; 
    item4.className = "i-item" ; 
    item5.className = "i-item" ; 
    item6.className = "i-item" ; 

    window.scrollTo(0, 0);

}
item2.onclick = function() {
    item1.className = "i-item" ; 
    item2.className = "i-item-active" ; 
    item3.className = "i-item" ; 
    item4.className = "i-item" ; 
    item5.className = "i-item" ; 
    item6.className = "i-item" ; 

    window.scrollTo(0,document.getElementById('Ordonnance').offsetTop -150);
    // document.getElementById('Ordonnance').scrollIntoView({
    //     behavior: 'smooth'
    //   });
    



}
item3.onclick = function() {
    item1.className = "i-item" ; 
    item2.className = "i-item" ; 
    item3.className = "i-item-active" ; 
    item4.className = "i-item" ; 
    item5.className = "i-item" ; 
    item6.className = "i-item" ; 

    window.scrollTo(0,document.getElementById('Ordonnance2').offsetTop -150);

    


}
item4.onclick = function() {
    item1.className = "i-item" ; 
    item2.className = "i-item" ; 
    item3.className = "i-item" ; 
    item4.className = "i-item-active" ; 
    item5.className = "i-item" ; 
    item6.className = "i-item" ; 

    window.scrollTo(0,document.getElementById('Ordonnance3').offsetTop -150);

    


}
item5.onclick = function() {
    item1.className = "i-item" ; 
    item2.className = "i-item" ; 
    item3.className = "i-item" ; 
    item4.className = "i-item" ; 
    item5.className = "i-item-active" ; 
    item6.className = "i-item" ; 
    
    window.scrollTo(0,document.getElementById('Ordonnance4').offsetTop -150);

    


}
item6.onclick = function() {
    item1.className = "i-item" ; 
    item2.className = "i-item" ; 
    item3.className = "i-item" ; 
    item4.className = "i-item" ; 
    item5.className = "i-item" ; 
    item6.className = "i-item-active" ; 
    

    window.scrollTo(0,document.getElementById('Ordonnance5').offsetTop -150);

}

//---------------------------------------------Examen Complemantaire--------------------------------------------

//Ordonance
const ordananceatt = document.querySelector(".hideordonance");
function ordanance(){
    ordananceatt.classList.add("open");   
}
function hideOrdonance() {
    ordananceatt.classList.remove("open");
}

//OrdonanceUpdate
const ordananceattup = document.querySelector(".hideordonanceup");
function ordananceup(){
    const tbodyRef = document.getElementById('listup').getElementsByTagName('tbody')[0];

    $.ajax({
        method: "POST",
        url: "/users/medecin/dataSicknote",
        data : {
            "num_sick" : num_sick.value,
        },
        success: function (data) {
         window.open('./Ordonnance2021-09-10.pdf');
        
            for (var i = 0; i < data.taille; i++) {

                var newRow = tbodyRef.insertRow();
            
                // Insert a cell at the end of the row
                var newCellmed = newRow.insertCell();
                newCellmed.style.border='0px';
                newCellmed.style.width='300px';
                newCellmed.classList.add("padleft");
                var newCellposo = newRow.insertCell();
                newCellposo.style.border='0px';
                newCellposo.style.width='150px';
                var newCelltrait = newRow.insertCell();
                newCelltrait.style.border='0px';
                newCelltrait.style.width='150px';
                var newCellbtn = newRow.insertCell();
                newCellbtn.style.border='0px';
                // Append a text node to the cell
                var newTextmed = document.createTextNode(data.name_drug[i]);
                var newTextposo = document.createTextNode(data.posologie[i]);
                var newTexttrait = document.createTextNode(data.duration[i]);
                var btn = document.createElement("img");
                btn.onclick = function () {
                    var i = this.parentNode.parentNode.rowIndex;
                    document.getElementById("listup").deleteRow(i);
                }
                btn.classList.add("delete");
                newCellmed.appendChild(newTextmed);
                newCellposo.appendChild(newTextposo);
                newCelltrait.appendChild(newTexttrait);
                newCellbtn.appendChild(btn);
            }
            ordananceattup.classList.add("open");  
        },
    });    
}
function hideOrdonanceup() {
    ordananceattup.classList.remove("open");
}

//OrdonanceDelete
function ordanancedelete(){
    $.ajax({
        method: "POST",
        url: "/users/medecin/deleteSicknote",
        data : {
            "num_sick" : num_sick.value,
        },
        success: function (result) {
            document.location.reload() ; 
            showMsg("Ordonnance bien supprimer",!result.err);       
        },
    });  
}

//OrdonanceImprime
function ordananceimprime(){

    $.ajax({
        method: "POST",
        url: "/users/medecin/imprimeSicknote",
        data : {
            "num_sick" : num_sick.value,
        },
        success: function (result) {
          

        },
    });  
}

//Bilan
const bilanatt = document.querySelector(".hidebilan");
function bilan(){
    bilanatt.classList.add("open");
}
function hideBilan() {
    bilanatt.classList.remove("open");
}

//Bilan update
const bilanattup = document.querySelector(".hidebilanup");
function bilanup(){
    const consultexamup = document.getElementById("consultexamup");
    const conclusioonup = document.getElementById("conclusioonup");
    var tbodyRef = document.getElementById('listbilanup').getElementsByTagName('tbody')[0];
    $.ajax({
        method: "POST",
        url: "/users/medecin/dataBilan",
        data: {
            "num_ch" : num_ch.value,
        },
        success: function (data) {
            
            consultexamup.value = data.consultation ; 
            conclusioonup.value = data.conclusion ; 

            for(var i=0 ; i< data.taille ; i++){
                var newRowor = tbodyRef.insertRow();
    
                // Insert a cell at the end of the row
                var newCell1 = newRowor.insertCell();
                newCell1.style.border='0px';
                newCell1.style.width='310px';
                newCell1.classList.add("padleft");
                var newCell2 = newRowor.insertCell();
                newCell2.style.border='0px';
                newCell2.style.width='320px';
                var newCell3 = newRowor.insertCell();
                newCell3.style.border='0px';
                // Append a text node to the cell
                var newText1 = document.createTextNode(data.name_exam[i]);
                var newText2 = document.createTextNode(data.result[i]);
                var btnbilan = document.createElement("img");
                btnbilan.onclick = function () {
                    var i = this.parentNode.parentNode.rowIndex;
                    document.getElementById("listbilanup").deleteRow(i);
                }
                btnbilan.classList.add("delete");
                newCell1.appendChild(newText1);
                newCell2.appendChild(newText2);
                newCell3.appendChild(btnbilan);
        
            }
            bilanattup.classList.add("open"); 
        },
    }); 
}
function hideBilanup() {
    bilanattup.classList.remove("open");
}

//Bilan Delete
function bilandelete(){
    $.ajax({
        method: "POST",
        url: "/users/medecin/deleteBilan",
        data: {
            "num_ch" : num_ch.value,
        },
        success: function (result) {
            document.location.reload() ; 
            showMsg("Bilan bien supprimer",!result.err);       
        },
    });  
}

//Bilan Imprime
function bilanImprime(){
    $.ajax({
        method: "POST",
        url: "/users/medecin/imprimeBilan",
        data : {
            "num_ch" : num_ch.value,
        },
        success: function (result) {
            
        },
    });
}

//Orientation
const orientationatt = document.querySelector(".hideorientation");
function orienta(){
    orientationatt.classList.add("open");
}
function hideOrientation() {
    orientationatt.classList.remove("open");
}

//Orientation update
const orientationattup = document.querySelector(".hideorientationup");
function orientaup(){
    const antcup = document.getElementById("antcup");
    const consultup = document.getElementById("consultup");
    const num_or = document.getElementById("num_or");
    var tbodyRefor = document.getElementById('listorup').getElementsByTagName('tbody')[0];

    $.ajax({
        method: "POST",
        url: "/users/medecin/dataOrientation",
        data: {
            "num_or":num_or.value,
        },
        success: function (data) {

            antcup.value = data.antecedent ; 
            consultup.value = data.signe ; 

            for(var i=0 ; i<data.taille ; i++){
            var newRowor = tbodyRefor.insertRow();
    
            // Insert a cell at the end of the row
            var newCellexamcomp = newRowor.insertCell();
            newCellexamcomp.style.border='0px';
            newCellexamcomp.style.width='580px';
            newCellexamcomp.classList.add("padleft");
            var newCellbtnor = newRowor.insertCell();
            newCellbtnor.style.border='0px';
            // Append a text node to the cell
            var newTextexamcomp = document.createTextNode(data.name_exam[i]);
            var btnor = document.createElement("img");
            btnor.onclick = function () {
                var i = this.parentNode.parentNode.rowIndex;
                document.getElementById("listorup").deleteRow(i);
            }
            btnor.classList.add("delete");
            newCellexamcomp.appendChild(newTextexamcomp);
            newCellbtnor.appendChild(btnor);
        }

            orientationattup.classList.add("open"); 
        },
    });  
}
function hideOrientationup() {
    orientationattup.classList.remove("open");
}

//Orientation Imprime
function orientaimprime(){
    $.ajax({
        method: "POST",
        url: "/users/medecin/imprimeOrientation",
        data : {
            "num_or":num_or.value,
        },
        success: function (result) {
            
        },
    });
}

//Orientation Delete
function orientadelete(){
    $.ajax({
        method: "POST",
        url: "/users/medecin/deleteOrientation",
        data: {
            "num_or":num_or.value,
        },
        success: function (result) {
            document.location.reload() ; 
            showMsg("Orientation bien supprimer",!result.err);        
        },
    }); 
}

//Evacuation
const evacuationatt = document.querySelector(".hideevacuation");
function evacuation(){
    evacuationatt.classList.add("open");
}
function hideEvacuation() {
    evacuationatt.classList.remove("open");
}

//Evacuation update
const evacuationattup = document.querySelector(".hideevacuationup");
function evacuationup(){
    const causeevup = document.getElementById("causeevup");
    const wilup = document.getElementById("wilup");
    const hopitalup = document.getElementById("hopitalup");
    const dureup = document.getElementById("dureup");

    $.ajax({
        method: "POST",
        url: "/users/medecin/dataEvacuation",
        data: {
            "num_ev" : num_ev.value,
        },
        success: function (data) {
            causeevup.value = data.cause_evacuation ; 
            wilup.value = data.place_evacuation ;
            hopitalup.value = data.hospital ; 
            dureup.value = data.duration_evacuation ; 
            
            evacuationattup.classList.add("open");
        },
    }); 
}
function hideEvacuationup() {
    evacuationattup.classList.remove("open");
}

//Evacuation Imprime
function evacuationimprime(){
    $.ajax({
        method: "POST",
        url: "/users/medecin/imprimeEvacuation",
        data : {
            "num_ev" : num_ev.value,
        },
        success: function (result) {
            
        },
    });
}

//Evacuation Delete
function evacuationdelete(){
    $.ajax({
        method: "POST",
        url: "/users/medecin/deleteEvacuation",
        data: {
            "num_ev" : num_ev.value,
        },
        success: function (result) {
            document.location.reload() ; 
            showMsg("Evacuation bien supprimer",!result.err);         
        },
    }); 
}

//Certificat
const certificatatt = document.querySelector(".hidecertificat");
function certificat(){
    const reposdiv = document.getElementById('reposdiv');

    reposdiv.classList.add("open");

    certificatatt.classList.add("open");
}
function hideCertificat() {
    certificatatt.classList.remove("open");
}

//Certificat update
const certificatattup = document.querySelector(".hidecertificatup");
function certificatup(){
    const reposdiv = document.getElementById('reposdivup');
    const pratiquediv = document.getElementById('pratiquedivup');

    const typerup = document.getElementById("typeup");
    const nbjourup = document.getElementById("nbjourup");
    const debutup = document.getElementById("debutup");
    const finup = document.getElementById("finup");
    const causeup = document.getElementById("causeup");
    const desup = document.getElementById("desup");

    const num_pre = document.getElementById("num_pre");

    $.ajax({
        method: "POST",
        url: "/users/medecin/dataCertificat",
        data: {
            "num_pre" : num_pre.value,
        },
        success: function (data) {

            desup.value = data.destination_rest ;
            typerup.value = data.type_prescription ;

            if(data.type_prescription === 'repos'){
                nbjourup.value = data.nb_day ; 
                debutup.value = data.date_start_rest ; 
                finup.value = data.date_end_rest ;

                reposdiv.classList.add("open");
            }

            if(data.type_prescription === 'pratique'){
                causeup.value = data.cause_practice ;

                pratiquediv.classList.add("open");
            }

           certificatattup.classList.add("open");
        },
    }); 
    
}
function hideCertificatup() {
    certificatattup.classList.remove("open");
}

//Certificat Imprime
function certificatimprime(){
    $.ajax({
        method: "POST",
        url: "/users/medecin/imprimeCertificat",
        data : {
            "num_pre" : num_pre.value,
        },
        success: function (result) {
            
        },
    });
}

//Certificat Delete
function certificatdelete(){
    
    $.ajax({
        method: "POST",
        url: "/users/medecin/deleteCertificat",
        data: {
            "num_pre" : num_pre.value,
        },
        success: function (result) {
            document.location.reload() ; 
            showMsg("Certificat bien supprimer",!result.err);        
        },
    }); 

}