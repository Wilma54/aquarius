/*
==================================
==== Element functions ===========
==================================
*/

// Creates a badge with some text (used for tags)
function badgeCreater(text) {
  const li = document.createElement('li');
  li.classList.add('tag-list-item');
  li.innerHTML = `<a class="badge"><span class="badge__text">${text}</span></a>`;
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
  const btnDiv = document.createElement('div');
  const removeBtn = document.createElement('i');
  const favBtn = document.createElement('i');

  if (note.favourite === true) {
    favBtn.classList.add('fas', 'fa-star', 'active-fav');
  } else {
    favBtn.classList.add('far', 'fa-star');
  }
  favBtn.id = 'fav-btn';

  favBtn.onclick = (e) => {
    note.setFavourite();
    DOM.clear();
    DOM.update();

  }

  removeBtn.classList.add('fas', 'fa-times');
  removeBtn.id = 'remove-btn';
  removeBtn.onclick = function (e) {
    note.remove();
    DOM.clear();
    DOM.update();
    database.storeNotes();
  }

  // Take information from obj and pass it in as innerHTML
  h4.innerHTML = note.title;
  date.innerHTML = "Updated: ";
  span.innerHTML = note.lastModified;

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
  li.id = note.id;

  // Append all elements to <li> in correct order
  wrapperDiv.appendChild(mainDiv);
  wrapperDiv.appendChild(btnDiv);
  li.appendChild(wrapperDiv);

  // If tags exsist
  if (note.tags.length > 0) {
    // append them in UL element
    let tagElements = [];
    const tags = document.createElement('ul');
    note.tags.forEach(tag => tagElements.push(badgeCreater(tag)));
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
==== Utility functions ==============
==================================
*/
function appendListToElement(arr, element) {
  arr.forEach(item => element.appendChild(item));
}