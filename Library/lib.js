const showDialog = document.getElementById("showDialog");
const newBookDialog = document.getElementById("newBookDialog");
const cancel = document.getElementById("cancel");

const book1 = new Book("Me before you", "Jojo Moyes", 494, false); 
const book2 = new Book("The night manager", "John le Carre", 483, false);
const book3 = new Book("This is it", "Alan Watts", 158, true);
const book4 = new Book("What every body is saying", "Joe Navarro", 250, true);
const book5 = new Book("The art of war", "Sun Tzu", 100, false);

const myLibrary = [book1, book2, book3, book4, book5];

console.log(book1.info());

window.onload = function() {
    render();
}

showDialog.addEventListener("click", () => {
    newBookDialog.showModal();
});

cancel.addEventListener("click", () => {
    newBookDialog.close();
});    


function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = Boolean(read);
    this.info = function() {
        return `${title} by ${author}, ${pages} pages, ${read ? "read" : "not read yet"}`
    }
}

window.addBookToLibrary = function(event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = document.getElementById("pages").value;
    const read = document.getElementById("read").checked;
    const book = new Book(title, author, pages, read);
    myLibrary.push(book);
    newBookDialog.close();
    render();
}

function deleteBook(index) {
    myLibrary.splice(index, 1);
    render();
}

Book.prototype.toggleReadStatus = function() {
    this.read = !this.read;
}

window.toggleReadStatus = function(index) {
    myLibrary[index].toggleReadStatus();
    render();
}


function render() {
    const bookGrid = document.querySelector(".book-grid");
    bookGrid.innerHTML = myLibrary.map((book, index) => 
        `<div class="book">
            <p>${book.title}</p>
            <p>by ${book.author}</p>
            <p>${book.pages} pages</p>
            <p><input type="checkbox" id="read" name="read" ${book.read ? "checked" : ""} 
                onclick="toggleReadStatus(${index})">${book.read ? "Read" : "Not read yet"}</p>
            <button onclick="deleteBook(${index})">🗑️</button>
        </div>`
    ).join("");
}