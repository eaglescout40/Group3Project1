//check to see every input box has value
//$(".frmErrors").text();
$("button.btn-info").on("click", function(e) {
    e.preventDefault();
    var animal = $("#animal-type-select")
      .val()
      .trim();
    //var animalBreed = $("#animal-breed")
    //.val()
    //.trim();
    var state = $("#dropdown-state")
      .val()
      .trim();
    var city = $("#dropdown-city")
      .val()
      .trim();
    var zip = $("#input-zipcode")
      .val()
      .trim();
  
    if (animal === "...") {
       $(".frmErrors")
         .text("Please select a type of animal")
         .fadeIn().fadeOut(5000);
       //.show();
     } else {
         (state === "Choose..." && city === "Choose..." && zip === " " ); {
             $(".frmErrors")
               .text("Please select at least one location criterion (state, city, zip)")
               .fadeIn().fadeOut(5000);

     }
 }
     // if (state === "Choose..." && city === "Choose..." && zip === " " && animalBreed === "...") {
     //    $(".frmErrors")
     //      .text("The form is not complete")
     //      .fadeIn().fadeOut(5000);
     //    //console.log(state);
     //    //console.log('hi')
     //  }
    
    if(zip != " " ) {

      if(zip != " " ) {
           
        if (NaN(zip) === true) {
          //return 'Not a Number!';
          $(".frmErrors")
          .text('Not a Number!')
          .fadeIn().fadeOut(5000);
        }
      }
     }  


         
  });