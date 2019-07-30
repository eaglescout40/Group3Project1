// This file will add, modify or delete data from the project database.
// Create a new database connection
// Create a function to accept new user input
// // input validation function
// // Store data into the database
// // // Encrypt the user password
// // // // function to encrypt the password  

var log = console.log;

var client_id = "yzqDLCfr7QRSBvCjfZglD8857s37RlkBOYBOgfurRqSksECjcb"; //Apikey
var client_secret = "JDx7nY5jRhNXP0UPmG7YbwE2OSqlOvSrB0urVCab"; //Secret 

//placeholder for TOKEN, obtained from  'refreshToken' function;
var accessToken = "";
var refreshTokenAttempted = false;

var foundPet = false;
var noOfResults = 0;

// Create a firebase object
var firebaseConfig = {
    apiKey: "AIzaSyBXZSA7zp8NKte4tg9zlQTCafnd8M4KUvI",
    authDomain: "group3project1-2019-07.firebaseapp.com",
    databaseURL: "https://group3project1-2019-07.firebaseio.com",
    projectId: "group3project1-2019-07",
    storageBucket: "",
    messagingSenderId: "169074872966",
    appId: "1:169074872966:web:3cfd0a22c82878cc"

};
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
// create a database ref variable
var database = firebase.database();
// temporary code to create initial data
var usersObjArray =
    [
        {
            name: 'ABC',
            address: '123 street, Cumming, GA',
            email: 'a@b.com',
            petPreference: {
                type: 'dog', breed: 'boxer', gender: 'female', color: 'brown', altered: 'Yes'
            },
            searchHistory:
                [{
                    type: 'dog',
                    breed: 'boxer',
                    gender: 'female',
                    color: 'brown',
                    altered: 'Yes',
                    location: {
                        zip: '30001',
                        city: 'Atlanta',
                        state: 'GA'
                    }
                },
                {
                    type: 'cat',
                    breed: 'domestic',
                    gender: 'female',
                    color: 'orange',
                    altered: 'Yes',
                    location: {
                        zip: '30001',
                        city: 'Atlanta',
                        state: 'GA'
                    }
                }]


        },
        {
            name: 'PQR',
            address: '456 street, Chicago, IL',
            email: 'a@b.com',
            petPreference: {
                type: 'cat', breed: 'Tabby', gender: 'female', color: 'Orange', altered: 'Yes'
            }
        }

    ];

//   log('after creating array');
//   log('name: '+usersObjArray[0].name)

function addRow(pUsersObjArray) {
    //log('in addRow');
    // open a loop on the objects array
    for (var i = 0; i < pUsersObjArray.length; i++) {
        //log('current index : '+i);
        //log('address: '+pUsersObjArray[i].address);
        // add a row to the database
        database.ref('/UserID-' + i).set(
            pUsersObjArray[i]
        );
        //log('after database set');
    }

    // Add search history to the user
    database.ref(pUserID + '/searchHistory/' + cnt).set(searchHistoryObj);
};

// ----- Added from old branch
// temporary searchHistory object    
var searchHistoryObj = {
    type: 'cat',
    breed: 'bombay cat',
    gender: 'male',
    color: 'black',
    altered: 'Yes',
    location: {
        zip: '30022',
        city: 'Alpharetta',
        state: 'GA'
    }
};
// Function to add a search history
function addHistory(pUserID) {
    var cnt = 0;
    database.ref('/' + pUserID + '/searchHistory/').on("value", function (data) {
        //loop and find the next element of array to use
        if (data.val() != undefined) {
            var child = data.val()[cnt];
            if (child != undefined) {
                while (child != undefined) {
                    cnt++
                    child = data.val()[cnt];
                }
            }
        }
    });
    // Add search history to the user
    database.ref(pUserID + '/searchHistory/' + cnt).set(searchHistoryObj);
}
// --- end of old branch

// temporary call to addHistory
addHistory('UserID-0');
addHistory('UserID-1');
//function to populate search-history element for the userID provided 
function populateSearchHistory(pUserID) {
    //log('in populateSearchHistory userID : ' + pUserID);
    database.ref('/' + pUserID + '/searchHistory/').on("value", function (data) {
        // get all the child elements
        var cnt = 0;
        if (data.val() != undefined) {
            var child = data.val()[cnt];
            // loop to find all the search history
            var child = data.val()[cnt];
            while (child != undefined) {
                var altered;
                if (child.altered === 'Yes') {
                    altered = 'altered-Yes';
                } else {
                    altered = 'altered-No';
                }
                var searchText = child.breed + ' ' + child.gender + ' ' + child.color + ' ' + child.type + ' ' + altered + ' in ' + child.location.state + ' ' + child.location.city + ' ' + child.location.zip;
                var newATag = $('<a></a>');
                newATag.href = searchText;
                newATag.text(searchText);
                // Add the search history to the page
                $('#search-history').prepend(newATag);
                cnt++
                child = data.val()[cnt];
            }
        }
    })
};
// temporary call to populateSearchHistory 
populateSearchHistory('UserID-0');
populateSearchHistory('UserID-1');

// Get information from petfinder api
// //Get access token function

function refreshToken() {
    refreshTokenAttempted = true;
    //log('in refreshToken');
    $.ajax({
        url: `https://api.petfinder.com/v2/oauth2/token`,
        method: "POST",
        data: {
            "grant_type": "client_credentials",
            "client_id": "yzqDLCfr7QRSBvCjfZglD8857s37RlkBOYBOgfurRqSksECjcb",
            "client_secret": "dBIHXQItrvUgQcqFNhxtg5juvsDfreot1EB3mvqY"
        }
    }).then(function (response) {
        //log('in ajax call');
        //log('in refereshToken response : ', response);
        accessToken = response.access_token;
        //log("accessToken after set from refreshToken: ", accessToken);
        search(searchPetObj);

    }).catch(function (err) {
        //some kind of console.log that tells us more about the error
    });
}

var searchPetObj = {
    type: 'cat',
    breed: '',
    color: '',
    gender: 'male',
    location: {
        city: '',
        state: 'KS',
        zip: ''
    }
};
// This function will check the user entries against the result set obtained in the ajax call
function isConditionTrue(userParam,resultVal){
    log('userParam',userParam.toUpperCase());
    log('resultVal',resultVal.toUpperCase());
    if(userParam!=''){
        if(userParam.toUpperCase()===resultVal.toUpperCase()){
            userParam='';
            resultVal='';
            return true;
        }
    }else{
        log('userParam is null')    
        userParam='';
            resultVal='';
            return true;
    }
    userParam='';
            resultVal='';
            return false; 
} // end of isConditionTrue

function search(searchPetObj) {
    log('searchPetObj ', searchPetObj);

    // set up a a query variable
    var queryURL = "https://cors-anywhere.herokuapp.com/https://api.petfinder.com/v2/animals";
    // add parameteres to the queryURL
    queryURL = queryURL + '?';
    // Add type of animal
    queryURL = queryURL + 'type=' + searchPetObj.type;

    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }).then(function (response) {
        log('in ajax - search');
        //log('in search ajax animals ',result);
        // loop through animals array to add more filters 
        var result = response.animals;
        log('result:', result);
        $(result).each(function (index) {
            //log('Breed ', result[index].breeds.primary.toUpperCase());
            //log('parameter breed ', searchPetObj.breed.toUpperCase());
            foundPet = false;
            // Check the breed
            if(isConditionTrue(searchPetObj.breed , result[index].breeds.primary)){
                log('now check the color');
                log('sending',searchPetObj.color, ' and ',result[index].colors.primary);
                if(isConditionTrue(searchPetObj.color , result[index].colors.primary)){
                    log('now check the gender');
                    if(isConditionTrue(searchPetObj.gender , result[index].gender)){
                        log('check location');
                        log('Check state');
                        if(isConditionTrue(searchPetObj.location.state , result[index].contact.address.state)){
                            log('Check city');
                            if(isConditionTrue(searchPetObj.location.city , result[index].contact.address.city)){
                                //check zip
                                if(isConditionTrue(searchPetObj.location.zip , result[index].contact.address.postcode)){
                                    log('found the dog');
                                    foundPet = true;
                                    noOfResults++;
                                    // add image to a card
                                    var divCol3 = $('<div class = "col-sm-3" ></div>');
                                    var divCard = $('<div class = "card"></div>');
                                    var divCardBody = $('<div class="card-body"></div>');
                                    var divH5 = $('<h5 class="card-title">' + result[index].name + '</h5>');
                                    divH5.css('width','100%','text-align','center');
                                    var petImage = $("<img></img>");
                                    petImage.attr('src', result[index].photos[0].small);
                                    petImage.css('width','100%');
                                    var aTag = $('<a href="' + result[index].url + '" class="btn btn-primary">More about me</a>');
                                    aTag.css('width','100%','text-align','center');
                                    divCardBody.append(divH5);
                                    divCardBody.append(petImage);
                                    divCardBody.append(aTag);
                                    divCard.append(divCardBody);
                                    divCol3.append(divCard);
                                    $('.petImageHolder').append(divCol3);
                                }
                            }
                        }
                    }
                }
            }
        })
        if (!foundPet) {
            log('did not find the pet');
            log('noOfResults',noOfResults);
            
            if(noOfResults<6 && noOfResults>=0){
                log('Recursive search');
                //search(searchPetObj);
            }
            
        }

    }).catch(function (err) {
        //console.log("ERROR! ", err);
        // call refreshtoken if the token is expired or asked for the first time
        if (err.responseJSON.status === 401 && !refreshTokenAttempted) {
            refreshToken();
        }
    });
}

search(searchPetObj);
// On click function to pull city names based on state
$(document).on("click", "#dropdown-state", function () {

    // Ajax pull for json file
    $.ajax({
        type: "GET",
        url: "./assets/media/csvjson.json",
    }).then((resp) => {
        console.log(resp);

        // Delete child elements of city dropdown
        $("#dropdown-city").empty();

        // Add placeholder to city dropdown
        $("#dropdown-city").append("<option>Choose...</option>");

        // capture value of state value
        var stateVal = $("#dropdown-state").val();
        console.log(stateVal);

        $.each(resp, function (index, value) {
            if (resp[index].state_id === stateVal) {

                // Set variables to create new options for city
                var cityDropdown = $("#dropdown-city");
                var newCityOption = $("<option>");

                // Append new options for city for each city in the state
                cityDropdown.append(newCityOption.text(resp[index].city).attr({
                    value: resp[index].state_id,
                }))
            }
        })
    })
});    