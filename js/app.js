const notesOutput = document.querySelector('#notes-output');
const notesArray = [];
let domArray = [];
let currentNote = '';

// Initialize Quill editor
var quill = new Quill('#editor', {
  theme: 'snow'
});

// Function that creates a new date in YYYY-MM-DD format
// Time can be added in future
function getDate() {
  let d = new Date();
  let date = [
    [d.getFullYear(), d.getMonth(), d.getDate()],
    [d.getHours(), d.getMinutes()]
  ];

  if (date[0][2] <= 9) {
    date[0][2] = '0' + date[0][2];
  }
  if (date[0][1] <= 9) {
    date[0][1] = '0' + date[0][1];
  }

  if (date[1][0] <= 9) {
    date[1][0] = '0' + date[1][0];
  }
  if (date[1][1] <= 9) {
    date[1][1] = '0' + date[1][1];
  }

  return date[0].join('-') + ' ' + '@' + ' ' + date[1].join(':');
}

function noteConstructor(content) {
  let note = {
    id: guid(),
    dateTime: getDate(),
    favorite: false,
    deleted: false,
    title: noteTitle(),
    tags: [],
    content: content,
  };
  return note;
}

// Old functions that got replaced by saveNote()

// function storeNote() {
//   if (currentNote.length > 5) {
//     let storage = JSON.parse(localStorage('note'));
//     storage.get
//   }
//   let note = noteConstructor(quill.getContents());
//   currentNote = note.id;
//   notesArray.push(note);
//   localStorage.setItem('note', JSON.stringify(notesArray));
//   console.log(localStorage);
//   showNotes(createNoteElements());
// }


function newNote() {
  currentNote = '';
  quill.setContents('');
  showNotes(buildDom());
}

// Function that takes in note id and display the note in editor
function getNote(id) {
  let storage = localStorage.getItem('note');
  let content = JSON.parse(storage);
  content.forEach(e => {
    if (e.id === id) {
      quill.setContents(e.content);
      console.log('getNote(): Open note: ' + e.id);
    }
  }, false);
}

// Function that takes the current note's ID and saves it
function saveNote(id) {
  // Checks if note is in memory
  if (notesArray.find(n => n.id === id.toString())) {
    // If true: runt update function and save new note in memory
    updateNote(id);
    // Build and show the new updated DOM
    showNotes(buildDom());
  } else {
    // If false: create a new note with contents of the editor
    const note = noteConstructor(quill.getContents());
    // Get the ID and set it as currentNote
    currentNote = note.id;
    // Place the new note first in the array
    notesArray.unshift(note);
    // Save note into memory
    localStorage.setItem('note', JSON.stringify(notesArray));
    // Build and show the new updated DOM
    showNotes(buildDom());

    console.log('saveNote(): No current, creating new note...');
    console.log('saveNote(): Creates new note with ID: ' + note.id);
  }
};

function findID(id) {
  if (id.length > 0) {
    return notesArray.find(note => note.id === id);
  } else {
    console.error('findID(): No current ID');
  }
}

function removeNote(id) {
  const noteID = id;
  notesArray[notesArray.indexOf(n => n.id === noteID)].pop();
}

// Function that takes ID and change the corresponding note's content, title and date
function updateNote(id) {
  // UNDER CONSTRUCTION
  const note = findID(id);
  note.title = noteTitle();
  note.dateTime = getDate();
  note.content = quill.getContents();
  move(notesArray, notesArray.indexOf(note), 0);
  localStorage.setItem('note', JSON.stringify(notesArray));
  console.log('updateNote(): ' + note.title);
}

// Code from link that moves item from one spot to another https://www.w3resource.com/javascript-exercises/javascript-array-exercise-38.php
function move(arr, old_index, new_index) {
  while (old_index < 0) {
    old_index += arr.length;
  }
  while (new_index < 0) {
    new_index += arr.length;
  }
  if (new_index >= arr.length) {
    var k = new_index - arr.length;
    while ((k--) + 1) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
}

// Get the note title from editor's first line
function noteTitle() {
  let title = quill.getContents().ops[0].insert;
  return title;
}

// Randomize a hash of 5 sections to use for ID on notes
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// Takes the buildDom function and appends all notes to the DOM
function showNotes() {
  // Appends all items to the DOM in #notes-output
  buildDom().forEach(el => notesOutput.appendChild(el));
}

// Function that build the new domArray with notes
function buildDom() {
  // Clear the dom tree so no old ones are left
  clearDom('#notes-output')

  // Reset current domArray
  domArray = [];

  // Loop through them and push each item to new array
  notesArray.forEach(el => domArray.push(createElement(el)));
  // Return array
  return domArray;
}

// Function that takes an object and creates a <li> with contents
function createElement(obj) {
  // Defines all element variable and create corresponding elements
  const li = document.createElement('li');
  const h4 = document.createElement('h4');
  const p = document.createElement('p');
  const date = document.createElement('p');
  const span = document.createElement('span');

  // Take information from obj and pass it in as innerHTML
  h4.innerHTML = obj.title;
  date.innerHTML = "Updated: ";
  span.innerHTML = obj.dateTime;

  // Append all elements to <li> in correct order
  li.appendChild(h4);
  li.appendChild(p);
  date.appendChild(span);
  li.appendChild(date);

  // Adds the class and id to <li>
  li.classList.add('note');
  li.id = obj.id;

  // Return finished <li>
  return li;
}



// Function that removes the selected element's children
function clearDom() {
  // Select element.children and put it in a variable
  const children = notesOutput.children;

  // Check if element has children
  if (children.length > 0) {
    // If true: remove all children
    while (notesOutput.firstChild) {
      notesOutput.removeChild(notesOutput.firstChild);
    }
  } else {
    // If false: nothing happens, (console.log)
    console.log('clearDom(): No notes in DOM');
  }
}

function start() {
  let storage = JSON.parse(localStorage.getItem('note'));
  if (storage !== null) {
    storage.forEach(el => notesArray.push(el));
    showNotes(buildDom());
  } else {
    console.log('start(): No notes in memory.');
  }
}


// Event Listeners

// Click event for the notes in sidebar
notesOutput.addEventListener('click', (e) => {
  // Get the clicked note's ID
  const targetId = e.target.id;
  // Update editor with selected note's ID
  getNote(targetId);
  // Close menu
  showMenu(false);
  // Set local variable to equal new current note's ID
  currentNote = targetId;
});