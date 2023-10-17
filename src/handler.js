const { nanoid } = require('nanoid');
const books = require('./books');

// GET
const getAllBooks = (request, h) => {
  
  let allBooks;
  
  const isReading = Number(request.query.reading);
  const isFinished = Number(request.query.finished);
  const bookNameQuery = request.query.name;

  if (isReading === 0) {
    allBooks = books
      .filter(book => book.reading === false)
      .map(book => {
        return {
          id: book.bookId,
          name: book.name,
          publisher: book.publisher
        };
      });
  } else if (isReading === 1) {
    allBooks = books
      .filter(book => book.reading === true)
      .map(book => {
        return {
          id: book.bookId,
          name: book.name,
          publisher: book.publisher
        };
      });
  } else if (isFinished === 0) {
    allBooks = books
      .filter(book => book.finished === false)
      .map(book => {
        return {
          id: book.bookId,
          name: book.name,
          publisher: book.publisher
        };
      });
  } else if (isFinished === 1) {
    allBooks = books
      .filter(book => book.finished === true)
      .map(book => {
        return {
          id: book.bookId,
          name: book.name,
          publisher: book.publisher
        };
      });
  } else if (bookNameQuery) {
    allBooks = books
      .filter(book => {
        const lowerCaseName = book.name.toLowerCase();
        const lowerCaseQuery = bookNameQuery.toLowerCase();

        return lowerCaseName.includes(lowerCaseQuery);
      })
      .map(book => {
        return {
          id: book.bookId,
          name: book.name,
          publisher: book.publisher
        };
      });
  } else {
    allBooks = books.map(book => {
      return {
        id: book.bookId,
        name: book.name,
        publisher: book.publisher
      };
    });
  };

  const response = h
    .response({
      status: "success",
      data: {
        books: allBooks
      }
    })
    .code(200);

  return response;

};

const getBookById = (request, h) => {

  const { bookId } = request.params;

  const book = books
    .filter(book => book.bookId === bookId)
    .map(book => {
      return {
        id: book.bookId,
        ...book
      };
    })[0];
  const isSuccess = books.filter(book => book.bookId === bookId).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      data: { book }
    });

    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan"
    });

    response.code(404);
    return response;
  };

};

// POST
const addNewBook = (request, h) => {

  const body = request.payload;

  if (!body.name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku"
    });

    response.code(400);
    return response;
  } else if (body.readPage > body.pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    })

    response.code(400);
    return response;
  };

  const bookData = {
    bookId: nanoid(16),
    ...body,
    finished: body.readPage === body.pageCount ? true : false,
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  books.push(bookData);

  const response = h
    .response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: { bookId: bookData.bookId }
    })
    .code(201);

  return response;

};

// UPDATE
const updateBook = (request, h) => {

  const { bookId } = request.params;
  const body = request.payload;

  const index = books.findIndex(book => book.bookId === bookId);
  const findBookId = books.filter(book => book.bookId === bookId).length > 0;

  if (!findBookId) {
    return h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan"
    }).code(404);
  } else if (!body.name) {
    return h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku"
    }).code(400);
  } else if (body.readPage > body.pageCount) {
    return h.response({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
    }).code(400);
  };

  if (index !== -1) {
    books[index] = {
      ...books[index],
      ...body,
      finished: body.readPage === body.pageCount ? true : false,
      updatedAt: new Date().toISOString()
    };
  };

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui"
  });

  response.code(200);
  return response;

};

// DELETE
const deleteBook = (request, h) => {

  const { bookId } = request.params;

  const index = books.findIndex(book => book.bookId === bookId);
  const findBookId = books.filter(book => book.bookId === bookId).length > 0;

  if (!findBookId) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan"
    });

    response.code(404)
    return response;
  };

  books.splice(index, 1);

  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus"
  });

  response.code(200);
  return response;

};


module.exports = {
  getAllBooks,
  getBookById,
  addNewBook,
  updateBook,
  deleteBook
};