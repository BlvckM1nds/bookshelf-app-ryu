const { getAllBooks, addNewBook, getBookById, updateBook, deleteBook } = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/books', 
    handler: getAllBooks
  },
  {
    method: 'GET',
    path: '/books/{bookId}', 
    handler: getBookById
  },
  {
    method: 'POST',
    path: '/books',
    handler: addNewBook
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBook
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBook
  }
];

module.exports = routes;