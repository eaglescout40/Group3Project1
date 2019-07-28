$.ajax({
    url: "../media/uscities1.5.csv",
    type: "GET"
}).then((response)=>{
    console.log(response);
})