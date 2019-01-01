
// Get input from user
var fruitInput;
var totalInput;

// Keep list of DOM elements for clearing later when reloading
var listItems = [];
var database;

function setup() {

  var config = {
// OMITTED 
  };
  firebase.initializeApp(config);
  database = firebase.database();

  // Input fields
  fruitInput = select('#fruit');
  totalInput = select('#total');
  dogInput = select('#dog');

  // Submit button
  var submit = select('#submit');
  submit.mousePressed(sendToFirebase);

  // Start loading the data
  loadFirebase();
}

function loadFirebase() {
  var ref = database.ref("maps");
  ref.on("value", gotData, errData);
}

function errData(error) {
  console.log("Something went wrong.");
  console.log(error);
}

// The data comes back as an object
function gotData(data) {
  var maps = data.val();
  // Grab all the keys to iterate over the object
  var keys = Object.keys(maps);

  // clear previous HTML list
  clearList();

  // Make an HTML list
  var list = createElement('ol');
  list.parent('data');

  // Loop through array
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var fruit = maps[key];
    var li = createElement('li', fruit.fruit + ': ' + fruit.total + ", key: " + key);
    li.parent(list);
    listItems.push(li);
  }
}

// Clear everything
function clearList() {
  for (var i = 0; i < listItems.length; i++) {
    listItems[i].remove();
  }
}

// This is a function for sending data
function sendToFirebase() {
  var maps = database.ref('maps');

  // Make an object with data in it
  var data = {
    fruit: fruitInput.value(),
    total: totalInput.value()
  }

  var fruit = maps.push(data, finished);
  console.log("Firebase generated key: " + fruit.key);

  // Reload the data for the page
  function finished(err) {
    if (err) {
      console.log("ooops, something went wrong.");
      console.log(err);
    } else {
      console.log('Data saved successfully');
    }
  }
}
