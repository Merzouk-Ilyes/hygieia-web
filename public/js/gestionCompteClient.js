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
    console.log(document.body.scrollTop);
    if (document.body.scrollTop < 10)
      document.getElementById("circle").style.opacity = 0;
    else document.getElementById("circle").style.opacity = 0.3;
  });