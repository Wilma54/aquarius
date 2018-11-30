const notesOutput = document.querySelector('#notes-output');
const saveBtn = document.querySelector("#save-btn");
const newBtn = document.querySelector("#new-btn");
const notesDiv = document.querySelector('#notes');
const welcome = document.querySelector('#welcome-lightbox');
const tagList = notesDiv.querySelector('.tag-list');
const notesArray = [];
let tagsArray = [];
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
  const wrapperDiv = document.createElement('div');
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
    if (noteIndex === -1) {
      noteIndex = 0;
    }
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

  wrapperDiv.classList.add('note-item-wrapper');

  // Adds the class and id to <li>
  li.classList.add('note');
  li.id = obj.id;

  // Append all elements to <li> in correct order
  wrapperDiv.appendChild(mainDiv);
  wrapperDiv.appendChild(btnDiv);
  li.appendChild(wrapperDiv);
  // If tags exsist
  if (obj.tags.length > 0) {
    // append them in UL element
    console.log(obj.tags);
    let objTags = [];
    const tags = document.createElement('ul');
    tags.classList.add('note-tags');
    for (let i = 0; i < obj.tags.length; i++) {
      objTags.push(tagsArray.find(tag => tag.name === obj.tags[i]));
    }
    console.log(objTags);
    appendListToElement(objTags, tags);
    li.appendChild(tags);
  }
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
  if (storage === null) {
    console.log('start(): No notes in memory (new user)');
  } else if (storage.length === 0) {
    console.log('start(): No notes in memory (exsisting user)');
    welcome.style.display = 'none';
  } else {
    welcome.style.display = 'none';
    getTags();
    storage.forEach(el => notesArray.push(el));
    clearDom('#notes-output');
    showNotes(buildDom(notesArray));
    getNote(notesArray[0].id);
    currentNote = notesArray[0].id;
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
    let newTag = prompt('Add a tag').toLowerCase();
    if (currentNote === '') {
      // push tagg to obj.tag array
      saveNote(currentNote);
      const note = findNote(currentNote);
      note.tags.push(newTag);
      addNewTag(newTag);
      saveNote(currentNote);
    } else if (findNote(currentNote).tags.find(tag => tag.toLowerCase() === newTag)) {
      return alert('You already have the tag: ' + newTag + ' added to this note.');
    } else {
      const note = findNote(currentNote);
      note.tags.push(newTag);
      addNewTag(newTag);
      saveNote(currentNote);
    }
  });
  tag.addEventListener('blur', () => {
    document.querySelector('.ql-editor').focus();
  });
  start();
})



function badgeColor() {
  let randomNum = Math.floor(Math.random() * 360) + 1;
  let randomColor = "hsla(" + randomNum + ",58%,55%,1)";
  console.log(randomColor)
  return randomColor;
};

// takes tag object and returns a li element
function tagBadgeCreater(name, color, amount) {
  // create all elements
  const li = document.createElement("li");
  const span = document.createElement("span");
  const a = document.createElement("a");
  const i = document.createElement("i");
  const textnode = document.createTextNode(name);

  // add classes
  li.classList.add('tag-list-item');
  a.classList.add('badge');
  a.href = '#';
  i.classList.add('fas', 'fa-tag');

  // append and return li element
  li.appendChild(a);
  a.appendChild(i);
  a.appendChild(span);
  span.appendChild(textnode);
  if (amount > 1) {
    const span1 = document.createElement('span');
    const am = document.createTextNode(amount);
    span1.appendChild(am);
    span1.classList.add('tag-amount');
    a.appendChild(span1);
  }
  a.style.background = color;
  return li;
}

// Loop through all tags
function appendListToElement(arr, element) {
  element.innerHTML = '';
  arr.forEach(tag => {
    // Create badge for each tag and append to .tag-list
    element.appendChild(tagBadgeCreater(tag.name, tag.color, tag.amount));
  })
}

function saveTags() {
  const json = JSON.stringify(tagsArray);
  localStorage.setItem('tags', json);
}

function getTags() {
  const parse = JSON.parse(localStorage.getItem('tags'));
  if (parse != null) {
    parse.forEach(tag => tagsArray.unshift(tag));
    appendListToElement(tagsArray, tagList);
  }
}

// add new tag to tag array
function addNewTag(tagName) {
  // if tag exsist in array, add 1 to amount property 
  if (tagsArray.find(tag => tag.name.toLowerCase() === tagName.toLowerCase())) {
    console.log('addTag(): ' + tagName + ' Exsist in array. Adding 1 to amount');
    let tagFound = tagsArray.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());
    tagFound.amount = tagFound.amount + 1;

  } else { //else push tag to array
    const tagobj = {
      name: tagName,
      color: badgeColor(),
      amount: 1
    }
    tagsArray.unshift(tagobj);
    console.log('addTag(): Added tag ' + tagName + ' to tagsArray');
  }
  saveTags();
  appendListToElement(tagsArray, tagList);
}



/* ===  TO DO   ====================================================================
  *** - Thoughts that left me friday the 30th of November - 1:13AM

  *== [] - When creating a new tag, it should be saved as an object within the note
  *== [] - When reloaded, the notes should be looped through to get the tags
  *== [?] - Should the tags be in it's own array?
  *== [] - If so, write a function that creates a new array of tag objects out of the names in the note.tags array. 
  *== [?] - Is it good to randomize the colors of tags?
  *== [] - If so, is it okay to generate a new color each time user refresh? (or tagsArray)
*/