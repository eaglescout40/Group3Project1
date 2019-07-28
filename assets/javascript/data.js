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

//log('start');
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
firebase.initializeApp(firebaseConfig);
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
function addRow(pUsersObjArray) {
    // open a loop on the objects array
    for (var i = 0; i < pUsersObjArray.length; i++) {
        // add a row to the database
        database.ref('/UserID-' + i).set(
            pUsersObjArray[i]
        );
    }
}
// temporary call to create initial data
addRow(usersObjArray);
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
// temporary call to addHistory
addHistory('UserID-0');
addHistory('UserID-1');
//function to populate search-history element for the userID provided 
function populateSearchHistory(pUserID) {
    log('in populateSearchHistory userID : ' + pUserID);
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
    log('in refreshToken');
    $.ajax({
        url: `https://api.petfinder.com/v2/oauth2/token`,
        method: "POST",
        data: {
            "grant_type": "client_credentials",
            "client_id": "yzqDLCfr7QRSBvCjfZglD8857s37RlkBOYBOgfurRqSksECjcb",
            "client_secret": "dBIHXQItrvUgQcqFNhxtg5juvsDfreot1EB3mvqY"
        }
    }).then(function (response) {
        log('in ajax call');
        log('in refereshToken response : ', response);
        accessToken = response.access_token;
        console.log("accessToken after set from refreshToken: ", accessToken);
        search(searchPetObj);

    }).catch(function (err) {
        //some kind of console.log that tells us more about the error
    });
}

var searchPetObj = {
    type: 'dog',
    breed: 'boxer',
    color: 'brown',
    gender: 'female',
    location: {
        city: 'Atlanta',
        state: 'GA',
        zip: '30001'
    }
};
function search(searchPetObj) {
    log(searchPetObj);
    //  refreshToken();
    // set up a a query variable
    var queryURL = "https://cors-anywhere.herokuapp.com/https://api.petfinder.com/v2/animals";
    // add parameteres to the queryURL
    queryURL = queryURL + '?';
    // Add type of animal
    queryURL = queryURL + 'type=' + searchPetObj.type;
    // // Add breed
     queryURL = queryURL + '&breeds.primary=' + searchPetObj.breed;
    // // Add location
    // //// Add city
    // queryURL = queryURL + '&contact.address.city=' + searchPetObj.location.city;
    // //// Add state
    // queryURL = queryURL + '&contact.address.state=' + searchPetObj.location.state;
    // //// Add zipcode
    // queryURL = queryURL + '&contact.address.postcode=' + searchPetObj.location.zip;

    log('in search')
    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }).then(function (response) {
        log('in ajax - search');
        log(response);
        // loop through animals array to add more filters 
        $(response).each(function(animal){
            // Check the breed
            // if(animal.breeds.primary === searchPetObj.breed){
            //     // Check gender
            //     if(animals.gender==='female'){
            //         // Check if the primary color is not null
            //         if(animal.colors.primary!=''){
                        log('selected animal');
            //         }
            //     }
            // }
        })
        
    }).catch(function (err) {
        console.log("ERROR! ", err);
        // call refreshtoken if the token is expired or asked for the first time
        if (err.responseJSON.status === 401 && !refreshTokenAttempted) {
            refreshToken();
        }
    });
}

search(searchPetObj);
