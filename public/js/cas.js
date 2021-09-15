function openNav(id) {
  if (id != 23) document.getElementById(id).style.width = "60vw";
}

function closeNav(id) {
  if (id != 23) document.getElementById(id).style.width = "0";
}
function myFunction(check, text) {
  var checkBox = document.getElementById(check);
  var text = document.getElementById(text);
  console.log(checkBox.checked);

  if (checkBox.checked == true) {
    text.style.display = "block";
  } else {
    text.style.display = "none";
    console.log(checkBox.checked);
  }
}
function myFunction2(check, text, text2) {
  var checkBox = document.getElementById(check);
  var elm1 = document.getElementById(text);
  var elm2 = document.getElementById(text2);
  console.log(checkBox.value);

  if (checkBox.checked == true) {
    elm1.style.display = "block";
    elm2.style.display = "none";
  } else {
    elm1.style.display = "none";
    elm2.style.display = "block";
  }
}

function switchCas(check, text, text2, text3, n) {
  var checkBox = document.getElementById(check);
  var elm1 = document.getElementById(text);
  var elm2 = document.getElementById(text2);
  var elm3 = document.getElementById(text3);

  if (n == 0) {
    elm1.style.display = "none";
    elm2.style.display = "none";
    elm3.style.display = "block";
  } else if (n == 2) {
    if (checkBox.checked == true) {
      elm1.style.display = "block";
      elm2.style.display = "none";
      elm3.style.display = "none";
    } else {
      elm1.style.display = "none";
      elm2.style.display = "block";
      elm3.style.display = "none";
    }
  } else {
    if (checkBox.checked == true) {
      elm1.style.display = "block";
      elm2.style.display = "none";
      elm3.style.display = "block";
    } else {
      elm1.style.display = "none";
      elm2.style.display = "block";
    }
  }
}

function onAddRow(id, tbd, list) {
  const tbodyEl = document.getElementById(tbd);

  const addeddate = document.getElementById(id).value;
  tbodyEl.innerHTML += `
    <tr>
      <td>${addeddate}</td>
      <td><button  onclick="del(this,'${list}')" type="button" class="deleteBtn">Delete</button></td>
    </tr>
    `;
}

function del(r, list) {
  var i = r.parentNode.parentNode.rowIndex;
  document.getElementById(list).deleteRow(i);
}


function addCas0(dates,list) {
  

  var dates = document.getElementById(dates);
  var myTab = document.getElementById(list);

  for (i = 0; i < myTab.rows.length; i++) {
    var objCells = myTab.rows.item(i).cells;

    for (var j = 0; j < 1; j++) {
      dates.value = dates.value + "/" + objCells.item(j).innerHTML;
    }

  }
  console.log("dates: " ,dates)
}


