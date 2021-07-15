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