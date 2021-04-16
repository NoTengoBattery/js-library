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

const book1 = Book;
book1.setTitle('Hello world');
book1.setAuthor('The world');
book1.setYear(1970);
book1.setPages(1000);
const book2 = Book;
book1.setTitle('Goobye world');
book1.setAuthor('The world');
book1.setYear(2038);
book1.setPages(1000);

const myLibrary = [book1, book2];

function addBookToLibrary(book) {
  myLibrary.push(book);
}

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
  library.forEach((book, index) => {
    const bookDOM = document.createElement('tr');
    bookDOM.dataset.index = index;
    createCell(bookDOM, book.title);
    createCell(bookDOM, book.author);
    createCell(bookDOM, book.year);
    createCell(bookDOM, book.pages);
    createCell(bookDOM, book.read ? 'yes' : 'no');
    createCell(bookDOM, '<a class="toggle-read" href="#">O</a>');
    createCell(bookDOM, '<a class="delete" href="#">X</a>');
    document.querySelector('#bookShelfContent').appendChild(bookDOM);
  });
}

function deleteBooks(el) {
  if (el.classList.contains('delete')) {
    const currentRow = el.parentElement.parentElement;
    const currentIndex = Number(currentRow.dataset.index);
    myLibrary.splice(currentIndex, 1);
  }
}

function toggleRead(el) {
  if (el.classList.contains('toggle-read')) {
    const currentRow = el.parentElement.parentElement;
    const currentIndex = Number(currentRow.dataset.index);
    const book = myLibrary[currentIndex];
    book.read = !book.read;
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
  showBooks(myLibrary);
  document
    .querySelector('#inputButton')
    .addEventListener('click', addBookHandler);
  document.getElementById('showInputsBtn').addEventListener('click', showForm);

  document.querySelector('#bookShelfContent').addEventListener('click', (e) => {
    deleteBooks(e.target);
    toggleRead(e.target);
    showBooks(myLibrary);
  });
});
