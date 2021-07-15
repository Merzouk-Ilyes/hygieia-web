function myFunction() {
    // Declare variables
var input, filter, table, tr, td, i, txtValue;
input = document.getElementById("myInput");
filter = input.value.toUpperCase();
input2 = document.getElementById("category");
filter2 = input2.value.toUpperCase();
console.log(filter);
table = document.getElementById("table");
tr = table.getElementsByTagName("tr");
// Loop through all table rows, and hide those who don't match the search query
for (i = 0; i < tr.length; i++) {
  td = tr[i].getElementsByTagName("td")[1];
  td2 =  tr[i].getElementsByTagName("td")[5];
  if (td) {
    txtValue = td.textContent || td.innerText;
    txtValue2 = td2.textContent || td2.innerText ; 
    if (txtValue.toUpperCase().indexOf(filter) > -1 && ( txtValue2.toUpperCase() === filter2 
     || filter2 === "TOUS"
    )) {
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
console.log(filter);
table = document.getElementById("table");
tr = table.getElementsByTagName("tr");
// Loop through all table rows, and hide those who don't match the search query
input2 = document.getElementById("myInput");
input2.value="";
if(filter ==="TOUS") {
  for (i = 0; i < tr.length; i++) {
    tr[i].style.display = "";
}
return;
}
for (i = 0; i < tr.length; i++) {
  td = tr[i].getElementsByTagName("td")[5];
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