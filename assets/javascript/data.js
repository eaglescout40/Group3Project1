// This file will add, modify or delete data from the project database.
// Create a new database connection
// Create a function to accept new user input
// // input validation function
// // Store data into the database
// // // Encrypt the user password
// // // // function to encrypt the password  

var log = console.log;

log('start');

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
  
  
  var database=firebase.database();

  var usersObjArray= 
  [
  {
    name:'ABC',  
    address:'123 street, Cumming, GA',
    email:'a@b.com',
    petPreference : {
        type:'dog',breed:'boxer',gender:'female',color:'brown',altered:'Yes'
      },
    "searchCriterion-1":{
        searchCriterionPet:{
            type:'dog',breed:'boxer',gender:'female',color:'brown',altered:'Yes'
        },
        searchCriterionLocation:{
            zip:'30001',city:'Atlanta',state:'GA'
        }
    },
    "searchCriterion-2":{
        searchCriterionPet:{
            type:'dog',breed:'boxer',gender:'female',color:'black',altered:'Yes'
        },
        searchCriterionLocation:{
            zip:'30022',city:'Johns Creek',state:'GA'
        }
    }
    
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
  }

  addRow(usersObjArray);

database.ref().on("child_added",function(data){
    log(data.val());
})

