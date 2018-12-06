document.addEventListener('DOMContentLoaded', () => {
    database.init();

    // Create the button for adding tags in toolbar
    tagbtn.classList.add('fas', 'fa-tag');
    tag.appendChild(tagbtn);

    tag.addEventListener('blur', () => {
        document.querySelector('.ql-editor').focus();
    });

    tag.addEventListener('click', (e) => {
        // Ask for tagg
        let newTag = prompt('Add a tag').toLowerCase();
        if (database.currentNote === '') {
            database.saveNote(database.currentNote);
            findNote(database.currentNote).addTag(newTag);
            database.saveNote(database.currentNote);
            DOM.show(database.filter(allNotes));
        } else {
            findNote(database.currentNote).addTag(newTag);
            database.saveNote(database.currentNote);
            DOM.show(database.filter(allNotes));
        }
        // if (database.currentNote === '') {
        //     // Create new note and save it
        //     database.saveNote(database.currentNote);
        //     // push tagg to obj.tag array
        //     const note = findNote(database.currentNote);
        //     note.addTag(newTag);
        // } else if (findNote(database.currentNote).tags.find(tag => tag.toLowerCase() === newTag)) {
        //     return alert('You already have the tag: ' + newTag + ' added to this note.');
        // } else {
        //     const note = findNote(database.currentNote);
        //     note.addTag(newTag);
        //     database.saveNote(database.currentNote);
        // };
    });

    document.getElementById('search-input').addEventListener('keyup', (event) => {
        let searchArray = [];
        database.notes.filter(note => {
            let noteContent = note.content.ops[0].insert.toLowerCase();
            if (noteContent.includes(event.target.value.toLowerCase())) {
                searchArray.push(note);
                DOM.clear();
                DOM.show(searchArray);
            } else {
                return;
            };
        });
    });

    document.getElementById('ql-picker-options-3').addEventListener('click', (event) => {
        quill.formatText(0, quill.getText().length, 'font', event.target.getAttribute("data-value"));
    });

    menuBTN.addEventListener('click', () => {
        showMenu(true);
    });

    menuBTNClose.addEventListener('click', () => {
        showMenu(false);
    });

    lightBox.addEventListener('click', () => {
        showMenu(false);
    });

    // Click event for the notes in sidebar
    notesOutput.addEventListener('click', (e) => {
        const targetId = e.target.id;
        if (e.target.tagName.toLowerCase() === "li") {
            showMenu(false);
            database.openNote(targetId);
            database.currentNote = targetId;
        };
    });
});

// REFACTOR THIS: WELCOME SLIDES
window.addEventListener('DOMContentLoaded', () => {
    let welcomeState = 0;
    welcomeBtn.addEventListener('click', () => {
        if (welcomeState === 0) {
            welcome.children[0].classList.add('welcome__background-state-2-changed');

            welcomeLogos[0].classList.toggle('welcome__header__logo--show');
            welcomeLogos[1].classList.toggle('welcome__header__logo--show');

            bgLayer1.classList.add('welcome__background-layer--fade-in');
            bgLayer2.classList.add('welcome__background-layer--fade-in');

            welcomeSlides[0].classList.add('slide--fade-out');
            welcomeSlides[0].classList.remove('slide--view');
            welcomeSlides[1].classList.add('slide--view');

            bubbles[0].classList.remove('active');
            bubbles[1].classList.add('active');

            welcomeState = 1;
        } else if (welcomeState === 1) {
            welcomeSlides[1].classList.add('slide--fade-out');
            welcomeSlides[1].classList.remove('slide--view');
            welcomeSlides[2].classList.add('slide--view');
            bubbles[1].classList.remove('active');
            bubbles[2].classList.add('active');
            welcomeBtn.innerText = 'Get started!';
            bgLayer1Path.style.fill = "#8b3ad2"
            bgLayer2Path.style.fill = '#8b3ad2';
            welcomeState = 2;
        } else if (welcomeState === 2) {
            welcomeSlides[2].classList.add('slide--fade-out');
            welcomeSlides[2].classList.remove('slide--view');

            welcome.classList.add('welcome--close');
            welcomeLightbox.classList.add('close');
            setTimeout(() => {
                welcome.style.display = 'none';
                welcomeLightbox.style.display = 'none';
            }, 300)
            welcomeState = 3;
        }
    })
});