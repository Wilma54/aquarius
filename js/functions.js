/*
==================================
==== Element functions ===========
==================================
*/

// Creates a badge with some text (used for tags)
function badgeCreater(tag) {
  const li = document.createElement('li');
  const badge = document.createElement('a');
  const badgeText = document.createElement('span');
  li.classList.add('tag-list-item');
  badge.classList.add('badge');
  badgeText.classList.add('badge__text');
  badgeText.innerHTML = tag.label;

  if (DOM.currentTags.includes(tag.label)) {
    badge.classList.add('active');
    badge.appendChild(badgeText);
  } else {
    badge.appendChild(badgeText);
  }

  if (tag.amount > 1) {
    const badgeAmount = document.createElement('span');
    badgeAmount.classList.add('tag-amount');
    badgeAmount.innerHTML = tag.amount;
    badge.appendChild(badgeAmount);
  }
  li.appendChild(badge);
  li.setAttribute('draggable', true);
  li.onclick = () => {
    if (DOM.currentTags.includes(tag.label)) {
      let index = DOM.currentTags.indexOf(tag.label);
      DOM.currentTags.splice(index, 1);
      if (DOM.currentTags.length === 0) {
        DOM.update();
      } else {
        DOM.show(tags());
      }
    } else {
      DOM.currentTags.push(tag.label);
      DOM.show(tags());
    }
  }
  li.ondragstart = () => {
    DOM.tagToBeRemoved = tag.label;
    removeTagBtn.classList.add('active');
  }

  li.ondragend = () => {
    removeTagBtn.classList.remove('active');
  }
  return li;
}

// Create a badge to be displayed on the note itself
function noteBadge(label) {
  const li = document.createElement('li');
  li.classList.add('tag-list-item');
  li.setAttribute('draggable', true);
  if (DOM.currentTags.includes(label)) {
    li.innerHTML = `<a class="badge active"><span class="badge__text">${label}</span></a>`;
  } else {
    li.innerHTML = `<a class="badge"><span class="badge__text">${label}</span></a>`;
  }
  li.ondragstart = (e) => {
    let noteId = e.target.parentNode.parentNode.id;
    DOM.noteId = noteId;
    DOM.tagToBeRemoved = label;
    removeTagBtn.classList.add('active');
  }

  li.ondragend = () => {
    removeTagBtn.classList.remove('active');
  }
  return li;
}

// Function that takes an object and creates a <li> with contents
function createElement(note) {
  const li = document.createElement('li');
  const wrapperDiv = document.createElement('div');
  const mainDiv = document.createElement('div');
  const h4 = document.createElement('h4');
  const p = document.createElement('p');
  const date = document.createElement('p');
  const span = document.createElement('span');
  const firstdate = document.createElement('p');
  const firstspan = document.createElement('span');
  const btnDiv = document.createElement('div');
  const removeBtn = document.createElement('i');
  const favBtn = document.createElement('i');
  const restoreBtn = document.createElement('i');

  li.setAttribute('draggable', true);

  li.ondragstart = (e) => {
    let targetClassList = [].slice.call(e.target.classList);
    DOM.noteId = note.id;
    const icon = deletedNotesBtn.children[0].children[0];
    if (targetClassList.includes('note')) {
      if (deletedNotesBtn.querySelector('.active') != null) {
        icon.classList.remove('fa-trash');
        icon.classList.add('fa-skull');
      } else {
        icon.classList.remove('fa-trash');
        icon.classList.add('fa-box-open');
      }
    }
  }

  li.ondragend = () => {
    const icon = deletedNotesBtn.children[0].children[0];
    icon.classList.remove('fa-box-open');
    icon.classList.add('fa-trash');
    if (deletedNotesBtn.querySelector('.active') != null) {
      icon.classList.remove('fa-skull');
      icon.classList.add('fa-trash');
    } else {
      icon.classList.remove('fa-box-open');
      icon.classList.add('fa-trash');
    }

  }

  if (note.deleted === true) {
    restoreBtn.classList.add('fas', 'fa-undo');
    restoreBtn.onclick = () => {
      note.restore();
      DOM.update();
      database.storeNotes();
      console.log(`note: Restored note with id: ${note.id}`)
    }
    btnDiv.appendChild(restoreBtn);
  } else {
    if (note.favourite === true) {
      favBtn.classList.add('fas', 'fa-star', 'active-fav');
    } else {
      favBtn.classList.add('far', 'fa-star');
    }
    favBtn.id = 'fav-btn';

    favBtn.onclick = (e) => {
      note.setFavourite();
      DOM.update();
      database.storeNotes();
    }
    btnDiv.appendChild(favBtn);
  }
  removeBtn.classList.add('fas', 'fa-times');
  removeBtn.id = 'remove-btn';
  removeBtn.onclick = function(e) {
    note.remove();
    DOM.update();
    database.storeNotes();
  }

  // Take information from obj and pass it in as innerHTML
  h4.innerHTML = note.title;
  date.innerHTML = "Updated: ";
  span.innerHTML = note.lastModified
  firstdate.innerHTML = "Created: ";
  firstspan.innerHTML = note.created;

  // Append all elements in correct order
  mainDiv.appendChild(h4);
  mainDiv.appendChild(p);
  date.appendChild(span);
  mainDiv.appendChild(date);
  firstdate.appendChild(firstspan);
  mainDiv.appendChild(firstdate);

  btnDiv.appendChild(removeBtn);

  wrapperDiv.classList.add('note-item-wrapper');

  // Adds the class and id to <li>
  li.classList.add('note');
  li.id = note.id;

  if (database.currentNote === note.id) {
    li.classList.add('active');
  }

  // Append all elements to <li> in correct order
  wrapperDiv.appendChild(mainDiv);
  wrapperDiv.appendChild(btnDiv);
  li.appendChild(wrapperDiv);

  // If tags exsist
  if (note.tags.length > 0) {
    // append them in UL element
    let tagElements = [];
    const tags = document.createElement('ul');
    tags.classList.add('note-tags');
    note.tags.forEach(tag => tagElements.push(noteBadge(tag)));
    appendListToElement(tagElements, tags);
    li.appendChild(tags);
  }
  return li;
}

/*
==================================
==== Menu functions ==============
==================================
*/

// Show menu true/false
function showMenu(bool) {
  if (bool === true) {
    sidebar.classList.add('expanded');
    lightBox.classList.add('show-lightbox');
  } else if (bool === false) {
    sidebar.classList.remove('expanded');
    lightBox.classList.remove('show-lightbox');
    notes.scrollTop = 0;
  } else {
    console.error('Function has no argument or argument is not boolean.');
  };
};

// Set an menu item to active and change label
function setActive(item, label) {
  document.querySelector(`[data-menu-item="${item}"]`).firstChild.classList.add('active');
  notes.firstElementChild.innerHTML = label;
}

// Clear active menu items
function clearActive(arr) {
  arr.forEach(el => el.firstChild.classList.remove('active'));
}

// Opens in note menu
function toolMenuOpen() {
  toolsBTN.children[0].classList.toggle('open-menu1');
  toolsBTN.children[1].classList.toggle('open-menu2');
  toolsBTN.children[0].classList.toggle('close-menu1');
  toolsBTN.children[1].classList.toggle('close-menu2');
  tools.classList.toggle('tools-expanded');
};

/*
==================================
==== Note functions ==============
==================================
*/

function dragDelete() {
  if (findNote(DOM.noteId).deleted) {
    findNote(DOM.noteId).remove();
  } else {
    findNote(DOM.noteId).remove()
    DOM.update();
    database.storeNotes();
  }
}

// Create new note object for constructor
function newNote(content) {
  let obj = {
    id: guid(),
    lastModified: getDate('full'),
    created: getDate('date'),
    favourite: false,
    deleted: false,
    title: noteTitle(),
    tags: [],
    template: 'default',
    content: content
  }
  return obj
}

// Export for storing
function exportNotes(arr) {
  let temp = [];
  arr.forEach(note => {
    let obj = {
      id: note.id,
      lastModified: note.lastModified,
      created: note.created,
      favourite: note.favourite,
      deleted: note.deleted,
      title: note.title,
      tags: note.tags,
      template: note.template,
      content: note.content,
    }
    temp.push(obj);
  });
  return temp;
}

// Import from storage
function importNotes(arr) {
  let temp = [];
  arr.forEach(note => {
    temp.push(new Note(note));
  })
  return temp;
}

// Get note title
function noteTitle() {
  let title = quill.getContents().ops[0].insert;
  return title;
}

// Print note
function printNote() {
  window.print();
}

// Returns date
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

// Makes random ID for notes
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// Returns a note with specific id
function findNote(id) {
  if (id.length > 0) {
    return database.notes.find(note => note.id === id);
  } else {
    console.error('findNote(): No current ID');
  }
}

// Moves an item in an array
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
// ref: https://www.w3resource.com/javascript-exercises/javascript-array-exercise-38.php

/*
==================================
==== Tags functions ==============
==================================
*/

// Creates and return a tag object
function newTagObject(label) {
  let obj = {
    label: label,
    amount: 1,
  }
  return obj;
}

// Loops through all notes and returns array with all their tags (objects)
function getTags(arr) {
  let temp = [];
  arr.forEach(note => {
    if (note.deleted === true) {
      return;
    } else {
      note.tags.forEach(tag => {
        let tempIndex = temp.findIndex(tempTag => tempTag.label === tag);
        if (tempIndex < 0) {
          temp.push(newTagObject(tag));
        } else {
          temp[tempIndex].amount++;
        }
      });
    }
  });
  return temp;
}

// Removes a Tag, Condition is checking if a note ID are present in DOM.noteId

function removeTag() {
  console.log(DOM.noteId);
  // If true, the tag form the specific note is removed
  if (DOM.noteId) {
    database.notes.forEach(note => {
      if (note.id === DOM.noteId) {
        note.tags.forEach(tag => tag === DOM.tagToBeRemoved ? note.removeTag(DOM.tagToBeRemoved) : false);
      };
    });
    DOM.tagToBeRemoved = '';
    DOM.noteId = false;
    DOM.update();

  } else { // If false, the note is removed completely
    database.notes.forEach(note => {
      note.tags.forEach(tag => tag === DOM.tagToBeRemoved ? note.removeTag(DOM.tagToBeRemoved) : false);
    });
    DOM.tagToBeRemoved = '';
    DOM.noteId = false;
    DOM.update();
  }
  database.storeNotes();
}

// Function to allow an item to be dropped on the item that has function
function allowDrop(event) {
  event.preventDefault();
}

/*
==================================
==== Utility functions ===========
==================================
*/

// Takes an array and append each item to a specific element
function appendListToElement(arr, element) {
  arr.forEach(item => element.appendChild(item));
}