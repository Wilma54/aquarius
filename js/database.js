// Database object
const database = {
    notes: [],
    tags: [],
    currentNote: '',
    noteList: document.querySelector('#notes-output'),
    init: () => {
        let storageNotes = JSON.parse(localStorage.getItem('notes'));
        let storageTags = JSON.parse(localStorage.getItem('tags'));
        if (storageNotes === null) {
            console.log('database.Init(): No notes in memory (new user)');
        } else if (storageNotes.length === 0) {
            console.log('database.Init(): No notes in memory (exsisting user)');
            welcomeLightbox.style.display = 'none';
        } else {
            console.log('database.Init(): Loading exsisting notes from memory')
            welcomeLightbox.style.display = 'none';
            database.tags = storageTags;
            database.notes = importNotes(storageNotes);
            DOM.show(database.filter(allNotes));
        }
    },

    nukeNote: (id) => {
        let index = database.notes.indexOf(note => note.id === id);
        database.notes.splice(index, 1);
        DOM.update();
    },

    openNote: (id) => {
        let note = database.notes.find(note => note.id === id);
        if (note === undefined) {
            console.log(`Could not find note with ID: ${id}`);
            return;
        } else {
            console.log(`Got note with id: ${id}`);
            quill.setContents(note.content);
            document.getElementsByClassName("ql-editor")[0].focus();
            return note;
        }
    },

    filter: (func = (note) => note) => {
        DOM.clear();
        return database.notes.filter(func);
    },

    newNote: () => {
        database.saveNote(database.currentNote);
        database.currentNote = '';
        quill.setContents('');
        document.querySelector('.ql-editor').focus();
    },

    saveNote: (id) => {
        if (database.notes.find(n => n.id === id)) {
            database.updateNote(id);
            DOM.show(database.filter(allNotes));
        } else {
            const note = new Note(newNote(quill.getContents()));
            database.currentNote = note.id;
            database.notes.unshift(note);
            database.storeNotes();
            DOM.show(database.filter(allNotes));
            console.log('database.saveNote(): No current, creating new note...');
            console.log('database.saveNote(): Creates new note with ID: ' + note.id);
        }
    },

    updateNote: (id) => {
        const note = findNote(id);
        note.title = noteTitle();
        note.lastModified = getDate('full');
        note.content = quill.getContents();
        move(database.notes, database.notes.indexOf(note), 0);
        database.storeNotes();
        console.log('database.updateNote(): ' + note.title);
    },

    storeNotes: () => {
        localStorage.setItem('notes', JSON.stringify(exportNotes(database.notes)));
        localStorage.setItem('tags', JSON.stringify(database.tags));
    }

}

const DOM = {
    current: 'all',
    currentTag: '',
    notesList: document.querySelector('#notes-output'),

    show: (arr = update()) => {
        arr.forEach(note => DOM.notesList.appendChild(createElement(note)));
        console.log(database.tags)
        database.tags.forEach(tag => tagList.appendChild(badgeCreater(tag)));
    },

    clear: () => {
        if (DOM.notesList.children.length > 0) {
            while (DOM.notesList.firstChild) {
                DOM.notesList.removeChild(DOM.notesList.firstChild);
            }
            console.log('DOM.clear(): Cleared DOM')
        } else {
            console.log('DOM.clear(): No notes in DOM');
        }
        if (tagList.children.length > 0) {
            while (tagList.firstChild) {
                tagList.removeChild(tagList.firstChild);
            }
            console.log('DOM.clear(): Cleared all tags')
        }
    },

    update: () => {
        switch (DOM.current) {
            case 'all':
                DOM.show(database.filter(allNotes));
                break;
            case 'deleted':
                DOM.show(database.filter(deleted));
                break;
            case 'favourite':
                DOM.show(database.filter(favourite));
                break;
            case 'tag':
                DOM.show(database.filter(tag(DOM.currentTag)));
            default:
                DOM.show(database.filter());
        }
    }
}

// Filters
const favourite = (note) => {
    DOM.current = 'favourite';
    clearActive(menuItems);
    setActive('favourites', 'Favourites');
    return note.favourite === true && note.deleted === false;
};

const deleted = (note) => {
    DOM.current = 'deleted';
    clearActive(menuItems);
    setActive('deleted', 'Deleted Notes');
    return note.deleted === true;
};

const allNotes = (note) => {
    DOM.current = 'all';
    clearActive(menuItems);
    setActive('notes', 'All Notes');
    return note.deleted === false;
};

const tags = (tagName) => {
    DOM.current = 'tag';
    DOM.currentTag = tagName;
    return (note) => note.tags.find(tag => tag === tagName);
};

function newCreate(noteObject) {
    console.log(noteObject);
    const li = document.createElement('li');
    li.classList.add('note');
    li.innerHTML =
        `<div class="note-item-wrapper">
        <div>
          <h4 class="note__title">${noteObject.title}</h4>
          <p class="note__summary"></p>
          <p class="note__date">Updated: <span class="note__date__updated">${noteObject.lastModified}</span></p>
        </div>
        <div>
          <i class="far fa-star" id="fav-btn" onclick="${noteObject.setFavourite()}"></i>
          <i class="fas fa-times" id="remove-btn" onclick="${noteObject.remove()}"></i>
        </div>
      </div>`;
    return li;
}