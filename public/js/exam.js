 
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
