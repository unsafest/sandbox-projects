const showDialog = document.getElementById("showDialog");
const newBookDialog = document.getElementById("newBookDialog");
const cancel = document.getElementById("cancel");

const book1 = new Book("book1", "author1", 52, true); 
const book2 = new Book("book2", "author2", 52, false);
const book3 = new Book("book3", "author3", 52, true);
const book4 = new Book("book4", "author4", 52, false);
const book5 = new Book("book5", "author5", 52, true);

const myLibrary = [book1, book2, book3, book4, book5];

console.log(book1.info());

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

function render() {
    const bookGrid = document.querySelector(".book-grid");
    bookGrid.innerHTML = myLibrary.map((book, index) => 
        `<div class="book">
            <table>
                <tr>
                    <td>${book.title}</td>
                    <td>by ${book.author}</td>
                    <td>${book.pages} pages</td>
                    <td>${book.read ? 'Read' : 'Not read yet'}</td>
                    <button onclick="deleteBook(${index})"🗑️</button>
                </tr>
            </table>
        </div>`
    ).join("");
}