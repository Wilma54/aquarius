const notesOutput = document.querySelector('#notes-output');
const saveBtn = document.querySelector("#save-btn");
const newBtn = document.querySelector("#new-btn");
const notesDiv = document.querySelector('#notes');
const welcome = document.querySelector('#welcome-lightbox');
const notesArray = [];
let favArray = [];
let domArray = [];
let currentNote = '';

const mainMenu = document.querySelector('#main-menu');
const menuItems = [].slice.call(mainMenu.children);

var Font = Quill.import('formats/font');
Font.whitelist = ['sans-serif', 'sofia', 'roboto', 'lobster'];
Quill.register(Font, true);

var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{
    'list': 'ordered'
  }, {
    'list': 'bullet'
  }],
  [{
    'indent': '-1'
  }, {
    'indent': '+1'
  }],
  [{
    'header': [1, 2, 3, 4, 5, 6, false]
  }],
  [{
    'color': []
  }, {
    'background': []
  }],
  [{
    'font': ['sans-serif', 'sofia', 'roboto', 'lobster']
  }],
  [{
    'align': []
  }],
  ['image'],
  ['tag']
];

// Initialize Quill editor
var quill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow'
});

// Function that creates a new date in YYYY-MM-DD format
function getDate(type) {
  let d = new Date();

  if (type === 'full') {
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
  } else if (type === 'date') {
    let date = [d.getFullYear(), d.getMonth(), d.getDate()];

    if (date[0][2] <= 9) {
      date[0][2] = '0' + date[0][2];
    }
    if (date[0][1] <= 9) {
      date[0][1] = '0' + date[0][1];
    }

    return date.join('-');
  } else {
    console.error('No or incorrect function call. Check arguments.');
  }
}

function noteConstructor(content) {
  let note = {
    id: guid(),
    lastModified: getDate('full'),
    created: getDate('date'),
    favourite: false,
    deleted: false,
    title: noteTitle(),
    tags: [],
    content: content,
  };
  return note;
}

function newNote() {
  currentNote = '';
  quill.setContents('');
}

// Function that takes in note id and display the note in editor
function getNote(id) {
  document.getElementsByClassName("ql-editor")[0].focus();
  let content = JSON.parse(localStorage.getItem('note'));
  let note = content.find(e => e.id === id);
  quill.setContents(note.content);
  console.log('getNote(): Open note: ' + note.id);
}

function findNote(id) {
  if (id.length > 0) {
    return notesArray.find(note => note.id === id);
  } else {
    console.error('findNote(): No current ID');
  }
}

// Function that takes the current note's ID and saves it
function saveNote(id) {
  if (notesArray.find(n => n.id === id)) {
    updateNote(id);
    clearDom('#notes-output');
    showNotes(buildDom(notesArray));
  } else {
    const note = noteConstructor(quill.getContents());
    currentNote = note.id;
    notesArray.unshift(note);
    localStorage.setItem('note', JSON.stringify(notesArray));
    clearDom('#notes-output');
    showNotes(buildDom(notesArray));

    console.log('saveNote(): No current, creating new note...');
    console.log('saveNote(): Creates new note with ID: ' + note.id);
  }
}

// Function that takes ID and change the corresponding note's content, title and date
function updateNote(id) {
  const note = findNote(id);
  note.title = noteTitle();
  note.lastModified = getDate('full');
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
function showNotes(func) {
  func.forEach(el => notesOutput.appendChild(el));
}

// Function that build the new domArray with notes
function buildDom(array) {
  domArray = [];
  array.forEach(el => domArray.push(createElement(el)));
  return domArray;
}

// Function that takes an object and creates a <li> with contents
function createElement(obj) {
  const li = document.createElement('li');
  const mainDiv = document.createElement('div');
  const h4 = document.createElement('h4');
  const p = document.createElement('p');
  const date = document.createElement('p');
  const span = document.createElement('span');
  const btnDiv = document.createElement('div');
  const removeBtn = document.createElement('i');
  const favBtn = document.createElement('i');

  if (obj.favourite === true) {
    favBtn.classList.add('fas', 'fa-star', 'active-fav');
  } else {
    favBtn.classList.add('far', 'fa-star');
  }
  favBtn.id = 'fav-btn';

  favBtn.onclick = (e) => {
    if (obj.favourite === false) {
      obj.favourite = true;
      localStorage.setItem('note', JSON.stringify(notesArray));
      clearDom('#notes-output');
      showNotes(buildDom(notesArray));

    } else if (obj.favourite === true) {
      obj.favourite = false;
      localStorage.setItem('note', JSON.stringify(notesArray));
      clearDom('#notes-output');
      showNotes(buildDom(notesArray));
    } else {
      console.error('fav-btn(): Something went wrong.');
    }
  }

  removeBtn.classList.add('fas', 'fa-times');
  removeBtn.id = 'remove-btn';
  removeBtn.onclick = function (e) {
    let note = e.target.parentNode.parentNode.id;
    let noteIndex = notesArray.map(n => n.id).indexOf(note);
    notesArray.splice(noteIndex, 1);
    clearDom('#notes-output');
    showNotes(buildDom(notesArray));
    localStorage.setItem('note', JSON.stringify(notesArray));
  }

  // Take information from obj and pass it in as innerHTML
  h4.innerHTML = obj.title;
  date.innerHTML = "Updated: ";
  span.innerHTML = obj.lastModified;

  // Append all elements in correct order
  mainDiv.appendChild(h4);
  mainDiv.appendChild(p);
  date.appendChild(span);
  mainDiv.appendChild(date);

  btnDiv.appendChild(favBtn);
  btnDiv.appendChild(removeBtn);

  // Adds the class and id to <li>
  li.classList.add('note');
  li.id = obj.id;

  // Append all elements to <li> in correct order
  li.appendChild(mainDiv);
  li.appendChild(btnDiv);
  return li;
}

// Function that removes the selected element's children
function clearDom() {
  const children = notesOutput.children;
  if (children.length > 0) {
    while (notesOutput.firstChild) {
      notesOutput.removeChild(notesOutput.firstChild);
    }
  } else {
    console.log('clearDom(): No notes in DOM');
  }
}

function start() {
  let storage = JSON.parse(localStorage.getItem('note'));
  if (storage !== null) {
    welcome.style.display = 'none';
    storage.forEach(el => notesArray.push(el));
    clearDom('#notes-output');
    showNotes(buildDom(notesArray));
    getNote(notesArray[0].id);
  } else {
    console.log('start(): No notes in memory.');
  }
  clearActive(menuItems);
  setActive(getMenuItem('notes'), 'Notes');
}

// Event Listeners
// Click event for the notes in sidebar
notesOutput.addEventListener('click', (e) => {
  const targetId = e.target.id;
  if (e.target.tagName.toLowerCase() === "li") {
    showMenu(false);
    getNote(targetId);
    currentNote = targetId;
  }
});

function printNote() {
  window.print();
}

function favPush() {
  notesArray.forEach(note => {
    if (note.favourite === true) {
      favArray.push(note);
    }
  })
}

function getMenuItem(item) {
  for (let i = 0; i < menuItems.length; i++) {
    if (menuItems[i].getAttribute('data-menu-item') === item) {
      return menuItems[i];
    }
  }
}

function setActive(item, label) {
  item.firstChild.classList.add('active');
  notes.firstElementChild.innerHTML = label;
}

function clearActive(arr) {
  arr.forEach(el => el.firstChild.classList.remove('active'));
}

function showFavourites() {
  favArray = [];
  favPush();
  clearDom('#notesOutput');
  showNotes(buildDom(favArray));
  clearActive(menuItems);
  setActive(getMenuItem('favourites'), 'Favourites');
}

function showAllNotes() {
  favArray = [];
  clearDom('#notesOutput');
  showNotes(buildDom(notesArray));
  clearActive(menuItems);
  setActive(getMenuItem('notes'), 'Notes');
}

document.getElementById('search-input').addEventListener('keyup', (event) => {
  let searchArray = [];
  notesArray.filter(note => {
    let noteContent = note.content.ops[0].insert.toLowerCase();
    if (noteContent.includes(event.target.value.toLowerCase())) {
      searchArray.push(note);
      clearDom('#notesOutput');
      showNotes(buildDom(searchArray));
    } else {
      return;
    }
  })
});

document.getElementById('ql-picker-options-3').addEventListener('click', (event) => {
  quill.formatText(0, quill.getText().length, 'font', event.target.getAttribute("data-value"));
});

document.addEventListener('DOMContentLoaded', () => {
  const tag = document.querySelector('.ql-tag');
  const tagbtn = document.createElement('i');
  tagbtn.classList.add('fas', 'fa-tag');
  tag.appendChild(tagbtn);
  tag.addEventListener('click', (e) => {
    // Ask for tagg
    let tag = prompt('Add a tag');
    if (currentNote === '') {
      // push tagg to obj.tag array
      saveNote(currentNote);
      const note = findNote(currentNote);
      note.tags.push(tag);
      saveNote(currentNote);
    } else {
      const note = findNote(currentNote);
      note.tags.push(tag);
      saveNote(currentNote);
    }
  });
  tag.addEventListener('blur', () => {
    document.querySelector('.ql-editor').focus();
  });
  start();
})



function tagColor() {
  let randomNum = Math.floor(Math.random() * 360) + 1;
  let randomColor = "hsla(" + randomNum + ",58%,55%,1)";
  console.log(randomColor)
  return randomColor;
};


function tagBadgeCreater(tag) {
  const li = document.createElement("LI");
  const span = document.createElement("SPAN");
  const a = document.createElement("A");
  const i = document.createElement("I");
  const textnode = document.createTextNode(tag);

  li.classList.add('tag-list-item');
  a.classList.add('badge');
  i.classList.add('fas', 'fa-tag');

  li.appendChild(a);
  a.appendChild(i);
  a.appendChild(span);
  span.appendChild(textnode);
  a.style.background = tagColor();
  notesDiv.querySelector(".tag-list").appendChild(li);

}