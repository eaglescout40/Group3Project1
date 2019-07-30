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
                [
                    {
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
                    }
                ]

    
        },    
        {
            name:'PQR',  
            address:'456 street, Chicago, IL',
            email:'a@b.com',
            petPreference : {
                type:'cat',breed:'Tabby',gender:'female',color:'Orange',altered:'Yes'
            }
        }
    ];

//   log('after creating array');
//   log('name: '+usersObjArray[0].name)
  
function addRow(pUsersObjArray){
    //log('in addRow');
    // open a loop on the objects array
    for(var i=0;i<pUsersObjArray.length;i++){
        //log('current index : '+i);
        //log('address: '+pUsersObjArray[i].address);
        // add a row to the database
        database.ref('/UserID-'+i).set(
            pUsersObjArray[i]
        );
        //log('after database set');
    }
};

// Add search history to the user
// database.ref(pUserID + '/searchHistory/' + cnt).set(searchHistoryObj);

// temporary call to addHistory
// addHistory('UserID-0');
// addHistory('UserID-1');

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
            };
        }
    });
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
    })
    
    .then(function (response) {
        log('in ajax call');
        log('in refereshToken response : ', response);
        accessToken = response.access_token;
        console.log("accessToken after set from refreshToken: ", accessToken);
        search(searchPetObj);

    })
    
    .catch(function (err) {
        //some kind of console.log that tells us more about the error
    });
};

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






// On click function to pull city names based on state
    log('in search')
    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })
    
    .then(function (response) {
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
        
    })
    
    .catch(function (err) {
        console.log("ERROR! ", err);
        // call refreshtoken if the token is expired or asked for the first time
        if (err.responseJSON.status === 401 && !refreshTokenAttempted) {
            refreshToken();
        }
    });
}

search(searchPetObj);

// On click function to pull city names based on state
$(document).on("click", "#dropdown-state", function(){

    // Ajax pull for json file
    $.ajax({
        type: "GET",
        url:"./assets/media/csvjson.json",
        })
        .then((resp)=>{
            console.log(resp);

            // Delete child elements of city dropdown
            $("#dropdown-city").empty();

            // Add placeholder to city dropdown
            $("#dropdown-city").append("<option>Choose...</option>");

            // capture value of state value
            var stateVal = $("#dropdown-state").val();
            console.log(stateVal);

            $.each(resp, function(index, value) {
                if( resp[index].state_id === stateVal ){

                    // Set variables to create new options for city
                    var cityDropdown = $("#dropdown-city");
                    var newCityOption = $("<option>");
                    
                    // Append new options for city for each city in the state
                    cityDropdown.append(newCityOption.text(resp[index].city).attr({
                        value: resp[index].state_id,
                    }))
                }
            })
        });
});

// Dog breed array
var breedArray = ['Blue Lacy',
    'Queensland Heeler',
    'Rhod Ridgeback',
    'Retriever',
    'Chinese Sharpei',
    'Black Mouth Cur',
    'Catahoula',
    'Staffordshire',
    'Affenpinscher',
    'Afghan Hound',
    'Airedale Terrier',
    'Akita',
    'Australian Kelpie',
    'Alaskan Malamute',
    'English Bulldog',
    'American Bulldog',
    'American English Coonhound',
    'American Eskimo Dog (Miniature)',
    'American Eskimo Dog (Standard)',
    'American Eskimo Dog (Toy)',
    'American Foxhound',
    'American Hairless Terrier',
    'American Staffordshire Terrier',
    'American Water Spaniel',
    'Anatolian Shepherd Dog',
    'Australian Cattle Dog',
    'Australian Shepherd',
    'Australian Terrier',
    'Basenji',
    'Basset Hound',
    'Beagle',
    'Bearded Collie',
    'Beauceron',
    'Bedlington Terrier',
    'Belgian Malinois',
    'Belgian Sheepdog',
    'Belgian Tervuren',
    'Bergamasco',
    'Berger Picard',
    'Bernese Mountain Dog',
    'Bichon Fris_',
    'Black and Tan Coonhound',
    'Black Russian Terrier',
    'Bloodhound',
    'Bluetick Coonhound',
    'Boerboel',
    'Border Collie',
    'Border Terrier',
    'Borzoi',
    'Boston Terrier',
    'Bouvier des Flandres',
    'Boxer','Boykin Spaniel',
    'Briard','Brittany',
    'Brussels Griffon',
    'Bull Terrier',
    'Bull Terrier (Miniature)',
    'Bulldog','Bullmastiff',
    'Cairn Terrier',
    'Canaan Dog',
    'Cane Corso',
    'Cardigan Welsh Corgi',
    'Cavalier King Charles Spaniel',
    'Cesky Terrier',
    'Chesapeake Bay Retriever',
    'Chihuahua',
    'Chinese Crested Dog',
    'Chinese Shar Pei',
    'Chinook',
    'Chow Chow',
    "Cirneco dell'Etna",
    'Clumber Spaniel',
    'Cocker Spaniel',
    'Collie',
    'Coton de Tulear',
    'Curly-Coated Retriever',
    'Dachshund','Dalmatian',
    'Dandie Dinmont Terrier',
    'Doberman Pinsch',
    'Doberman Pinscher',
    'Dogue De Bordeaux',
    'English Cocker Spaniel',
    'English Foxhound',
    'English Setter',
    'English Springer Spaniel',
    'English Toy Spaniel',
    'Entlebucher Mountain Dog',
    'Field Spaniel',
    'Finnish Lapphund',
    'Finnish Spitz',
    'Flat-Coated Retriever',
    'French Bulldog',
    'German Pinscher',
    'German Shepherd',
    'German Shorthaired Pointer',
    'German Wirehaired Pointer',
    'Giant Schnauzer',
    'Glen of Imaal Terrier',
    'Golden Retriever',
    'Gordon Setter',
    'Great Dane',
    'Great Pyrenees',
    'Greater Swiss Mountain Dog',
    'Greyhound',
    'Harrier','Havanese',
    'Ibizan Hound',
    'Icelandic Sheepdog',
    'Irish Red and White Setter',
    'Irish Setter',
    'Irish Terrier',
    'Irish Water Spaniel',
    'Irish Wolfhound',
    'Italian Greyhound',
    'Japanese Chin',
    'Keeshond',
    'Kerry Blue Terrier',
    'Komondor',
    'Kuvasz',
    'Labrador Retriever',
    'Lagotto Romagnolo',
    'Lakeland Terrier',
    'Leonberger',
    'Lhasa Apso',
    'L_wchen',
    'Maltese',
    'Manchester Terrier',
    'Mastiff',
    'Miniature American Shepherd',
    'Miniature Bull Terrier',
    'Miniature Pinscher',
    'Miniature Schnauzer',
    'Neapolitan Mastiff',
    'Newfoundland',
    'Norfolk Terrier',
    'Norwegian Buhund',
    'Norwegian Elkhound',
    'Norwegian Lundehund',
    'Norwich Terrier',
    'Nova Scotia Duck Tolling Retriever',
    'Old English Sheepdog',
    'Otterhound',
    'Papillon',
    'Parson Russell Terrier',
    'Pekingese',
    'Pembroke Welsh Corgi',
    'Petit Basset Griffon Vend_en',
    'Pharaoh Hound',
    'Plott',
    'Pointer',
    'Polish Lowland Sheepdog',
    'Pomeranian',
    'Standard Poodle',
    'Miniature Poodle',
    'Toy Poodle',
    'Portuguese Podengo Pequeno',
    'Portuguese Water Dog',
    'Pug',
    'Puli',
    'Pyrenean Shepherd',
    'Rat Terrier',
    'Redbone Coonhound',
    'Rhodesian Ridgeback',
    'Rottweiler','Russell Terrier',
    'St. Bernard',
    'Saluki',
    'Samoyed',
    'Schipperke',
    'Scottish Deerhound',
    'Scottish Terrier',
    'Sealyham Terrier',
    'Shetland Sheepdog',
    'Shiba Inu',
    'Shih Tzu',
    'Siberian Husky',
    'Silky Terrier',
    'Skye Terrier',
    'Sloughi',
    'Smooth Fox Terrier',
    'Soft-Coated Wheaten Terrier',
    'Spanish Water Dog',
    'Spinone Italiano',
    'Staffordshire Bull Terrier',
    'Standard Schnauzer',
    'Sussex Spaniel',
    'Swedish Vallhund',
    'Tibetan Mastiff',
    'Tibetan Spaniel',
    'Tibetan Terrier',
    'Toy Fox Terrier',
    'Treeing Walker Coonhound',
    'Vizsla',
    'Weimaraner',
    'Welsh Springer Spaniel',
    'Welsh Terrier',
    'West Highland White Terrier',
    'Whippet',
    'Wire Fox Terrier',
    'Wirehaired Pointing Griffon',
    'Wirehaired Vizsla',
    'Xoloitzcuintli',
    'Yorkshire Terrier'
];

var catArray = [
    "Abyssinian"
    ,"American Bobtail"
    ,"American Curl"
    ,"American Shorthair"
    ,"American Wirehair"
    ,"Balinese"
    ,"Bengal"
    ,"Birman"
    ,"Bombay"
    ,"British Shorthair"
    ,"Burmese"
    ,"Burmilla"
    ,"Chartreux"
    ,"Colorpoint Shorthair"
    ,"Cornish Rex"
    ,"Devon Rex"
    ,"Egyptian Mau"
    ,"European Burmese"
    ,"Exotic"
    ,"Havana Brown"
    ,"Japanese Bobtail"
    ,"Khao Manee"
    ,"Korat"
    ,"LaPerm"
    ,"Lykoi"
    ,"Maine Coon Cat"
    ,"Manx"
    ,"Norwegian Forest Cat"
    ,"Ocicat"
    ,"Oriental"
    ,"Persian"
    ,"Ragamuffin"
    ,"Ragdoll"
    ,"Russian Blue"
    ,"Scottish Fold"
    ,"Selkirk Rex"
    ,"Siamese"
    ,"Siberian"
    ,"Singapura"
    ,"Somali"
    ,"Sphynx"
    ,"Tonkinese"
    ,"Toybob"
    ,"Turkish Angora"
    ,"Turkish Van"
]

// Right dog breed array to options of animal breed dropdown when dog is selected in animal type
$(document).on("click", "#animal-type-select", function(){
    // Get input of animal type
    var selectedAnimalType = $("#animal-type-select").val();

    console.log(selectedAnimalType);

    // Delete child elements of breed dropdown
    $("#animal-breed").empty();

    // Add placeholder to breed dropdown
    $("#animal-breed").append("<option>Choose...</option>");

    if( selectedAnimalType === "dog" ){

        log(selectedAnimalType)

        $.each(breedArray, function(index, value) {

            // Set variables to create new options for city
            var breedDropdown = $("#animal-breed");
            var newBreedOption = $("<option>");
            
            // Append new options for city for each city in the state
            breedDropdown.append(newBreedOption.text(breedArray.sort()[index]));
        })

    } else if( selectedAnimalType === "cat" ) {

        log(selectedAnimalType)

        $.each(catArray, function(index, value) {

            // Set variables to create new options for city
            var breedDropdown = $("#animal-breed");
            var newBreedOption = $("<option>");
            
            // Append new options for city for each city in the state
            breedDropdown.append(newBreedOption.text(catArray.sort()[index]));
        })

    }
});


// Modal activation code
$('#signin-modal').on('shown.bs.modal', function () {
    $('#signin-button').trigger('focus')
})