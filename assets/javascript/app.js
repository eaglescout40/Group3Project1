//check to see every input box has value
//$(".frmErrors").text();
$("button.btn-info").on("click", function(e) {
    e.preventDefault();
    var animal = $("#animal-type-select")
      .val()
      .trim();
    var animalBreed = $("#animal-breed")
    .val()
    .trim();
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
        .text("The form is not complete")
        .show();
      //.show();
    }
    if (state === "Choose..." || city === "Choose..." || zip === " " ||animalBreed === "...") {
      $(".frmErrors")
        .text("The form is not complete")
        .fadeIn().fadeOut(5000);
      //console.log(state);
      //console.log('hi')
    }
    
    //    else if ((zip === "Choose...") ) {
    //     //console.log('hi')
    //      $(".frmErrors")
    //       .text("The form is not complete")
    //       .show().fadeIn();
    //   }
  });