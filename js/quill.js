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