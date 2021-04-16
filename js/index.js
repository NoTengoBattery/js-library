function BookFactory() {
  this.build = () => {
    const that = {};
    const setNotEmpty = (prop, value) => {
      if (value) { that[prop] = value; return true; }
      return false;
    };
    const setPositive = (prop, value) => {
      if (typeof value === 'number' && value >= 0) { that[prop] = value; return true; }
      return false;
    };
    const setBool = (prop, value) => { that[prop] = !!value; return true; };
    const setterAndGetter = (prop, setter) => {
      const propBuilder = {};
      propBuilder[`set${prop}`] = (value) => setter(prop, value);
      propBuilder[`get${prop}`] = () => that[prop];
      return propBuilder;
    };
    return {
      ...setterAndGetter('Title', setNotEmpty),
      ...setterAndGetter('Author', setNotEmpty),
      ...setterAndGetter('Year', setPositive),
      ...setterAndGetter('Pages', setPositive),
      ...setterAndGetter('Read', setBool),
    };
  };
}

const Library = (
  function library() {
    const bookFactory = new BookFactory();
    const that = { books: [] };
    return {
      addBook: (title, author, year, pages) => {
        const { books } = that;
        const bookBuilder = bookFactory.build();
        let valid = true;
        valid &&= bookBuilder.setTitle(title);
        valid &&= bookBuilder.setAuthor(author);
        valid &&= bookBuilder.setYear(year);
        valid &&= bookBuilder.setPages(pages);
        if (valid) { books.push(bookBuilder); }
        return valid;
      },
      getBook: (index) => {
        const { books } = that;
        return books[index];
      },
      forEachBook: (iter) => { that.books.forEach(iter); },
      deleteBook: (book) => { that.books.splice(book, 1); },
    };
  }()
);

Library.addBook('Hello world', 'The world', 1970, 1000);
Library.addBook('Goobye world', 'The world', 2038, 1000);


function showForm() {
  const f = document.getElementById('bookForm');
  if ((f.style.display || 'none') === 'none') {
    f.style.display = 'block';
  } else {
    f.style.display = 'none';
  }
}

function showBooks(library) {
  function createCell(parent, text) {
    const cell = document.createElement('td');
    cell.innerHTML = text;
    parent.appendChild(cell);
  }
  document.querySelector('#bookShelfContent').innerHTML = '';
  library.forEachBook((book, index) => {
    const bookDOM = document.createElement('tr');
    bookDOM.dataset.index = index;
    createCell(bookDOM, book.getTitle());
    createCell(bookDOM, book.getAuthor());
    createCell(bookDOM, book.getYear());
    createCell(bookDOM, book.getPages());
    createCell(bookDOM, book.getRead() ? 'yes' : 'no');
    createCell(bookDOM, '<a class="toggle-read" href="#">O</a>');
    createCell(bookDOM, '<a class="delete" href="#">X</a>');
    document.querySelector('#bookShelfContent').appendChild(bookDOM);
  });
}

function deleteBooks(el) {
  if (el.classList.contains('delete')) {
    const currentRow = el.parentElement.parentElement;
    const currentIndex = Number(currentRow.dataset.index);
    Library.deleteBook(currentIndex);
  }
}

function toggleRead(el) {
  if (el.classList.contains('toggle-read')) {
    const currentRow = el.parentElement.parentElement;
    const currentIndex = Number(currentRow.dataset.index);
    const book = Library.getBook(currentIndex);
    book.setRead(!book.getRead());
  }
}

function showAlert(message) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(message));
  const container = document.querySelector('.container');
  const form = document.querySelector('#bookForm');
  container.insertBefore(div, form);
  setTimeout(() => div.remove(), 3000);
}

function addBookHandler() {
  const title = document.querySelector('#inputTitle').value;
  const author = document.querySelector('#inputAuthor').value;
  const year = document.querySelector('#inputYear').value;
  const pages = document.querySelector('#inputPages').value;

  if (title && author && year && pages) {
    const book = new Book(title, author, year, pages);

    addBookToLibrary(book);
    showBooks(myLibrary);
  } else {
    showAlert('Please fill all the fields');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showBooks(Library);
  document
    .querySelector('#inputButton')
    .addEventListener('click', addBookHandler);
  document.getElementById('showInputsBtn').addEventListener('click', showForm);

  document.querySelector('#bookShelfContent').addEventListener('click', (e) => {
    deleteBooks(e.target);
    toggleRead(e.target);
    showBooks(Library);
  });
});
