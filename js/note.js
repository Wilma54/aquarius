class Note {
    constructor(obj) {
        this.id = obj.id;
        this.lastModified = obj.lastModified;
        this.created = obj.created;
        this.favourite = obj.favourite;
        this.deleted = obj.deleted;
        this.title = obj.title;
        this.tags = obj.tags;
        this.template = obj.template;
        this.content = obj.content;
    }

    remove() {
        if (this.deleted === false) {
            this.deleted = true;
        } else if (this.deleted === true && DOM.current === 'deleted') {
            let input;
            do {
                input = prompt(`Do you really wanna remove "${this.title}" completely? y/n`).toLowerCase();
                if (input === 'y') {
                    console.log(this.id);
                    database.nukeNote(this.id);
                    break;
                }
                if (input === 'n') {
                    alert('Okey, no deletion made');
                    break;
                }
            } while (input === 'y' || input === 'n')
        }
    }

    setFavourite() {
        if (this.favourite === false) {
            this.favourite = true;
        } else {
            this.favourite = false;
        }
    }

    addTag(tag) {
        if (this.tags.includes(tag)) {
            console.error(`Found tag: ${tag} in note taglist. Can't add.`);
        } else {
            this.tags.push(tag);
            console.log(`Added tag: "${tag}" to note: (${this.title})`)
        }
    }

    removeTag(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
    }
}