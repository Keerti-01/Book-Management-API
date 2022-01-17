const bookModel = require('./database/books');
const authorModel = require('./database/authors');
const publicationModel = require('./database/publication');

//import mongoose module
const mongoose = require('mongoose');
//set up default mongoose connection
var mongoDB = "mongodb+srv://keerti01:keertiDB@cluster0.wuthi.mongodb.net/Book-Management?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=> console.log("Connection Established"));

const express = require("express");
const app = express();
app.use(express.json());

//-----------------------------------------------GET API--------------------------------------------------------

app.get("/",(req,res) => {
    return res.json("Welcome, to the Backend of Book Management API");
})

//GET all books
/**
 * route                /books
 * description          get all books
 * access               public
 * parameter            none
 * methods              get
 */
app.get("/books",async (req,res) => {
    const getAllBooks = await bookModel.find(); //anything in green colour means that returns a promise
    return res.json(getAllBooks); //return because we want program to end after getting all the books
    //res.send(getAllBooks) same thing no difference //but json is the best exchange medium
});

//GET specific book based on ISBN
/**
 * route                /book-isbn/:isbn
 * description          get specific book based on ISBN
 * access               public
 * parameter            isbn
 * methods              get
 */
app.get("/book-isbn/:isbn",async (req,res) => {  
    
    const {isbn} = req.params;  //destructuring or const isbn = req.params.isbn;
    
    const getSpecificBook = await bookModel.findOne({ISBN : isbn});
    
    if(getSpecificBook===null){
        return res.json({"error" : `No book found for the ISBN of ${isbn}`});
    }

    return res.json(getSpecificBook);

});

//GET a list ofbooks based on category
/**
 * route                /book-category/:category
 * description          get a list of books based on category
 * access               public
 * parameter            category
 * methods              get
 */
app.get("/book-category/:category",async (req,res) => {
    const {category} = req.params;
     
    const getCategoryBooks = await bookModel.find({category : category});

    if(getCategoryBooks.length===0){
        return res.json({"error" : `No books found for the category of ${category}`});
    }

    return res.json(getCategoryBooks);
});

//AUTHORS GET API

/**
 * route                /authors
 * description          get all authors
 * access               public
 * parameter            none
 * methods              get
 */

app.get("/authors",async (req,res) => {
    const getAllAuthors = await authorModel.find();
    return res.json(getAllAuthors);
});

//GET specific author
/**
 * route                /authors-id/:id
 * description          get specific author
 * access               public
 * parameter            id
 * methods              get
 */
app.get("/authors-id/:id", async (req,res) => {
    let {id} = req.params;   //here it is id as string but in our databse is a number and id should be let not const
    id = Number(id);         //or else we can write == instead of ===

    const getSpecificAuthor = await authorModel.findOne({id:id});

    if(getSpecificAuthor===null){
        return res.json({"error":`No author found for id ${id}`});
    }

    return res.json(getSpecificAuthor);
});

//GET the author for isbn
/**
 * route                /authors-isbn/:isbn
 * description          get author for isbn
 * access               public
 * parameter            isbn
 * methods              get
 */
app.get("/authors-isbn/:isbn",async (req,res) => {
    const {isbn} = req.params;

    const getAuthorBook = await authorModel.find({ISBN:isbn});

    if(getAuthorBook.length === 0){
        return res.json({"error":`No author found for the book isbn ${isbn}`});
    }
    return res.json(getAuthorBook);
});

//GET PUBLICATION API
//GET all publication
/**
 * route                /publications
 * description          get all publications
 * access               public
 * parameter            none
 * methods              get
 */
app.get("/publications",async (req,res) => {
    const getAllPublications = await publicationModel.find();

    if(getAllPublications===null){
        return res.json({"error":`No publication found for id ${id}`});
    }
    return res.json(getAllPublications);
});

//GET specific publication
/**
 * route                /publications-id/:id
 * description          get specific publication
 * access               public
 * parameter            id
 * methods              get
 */
app.get("/publications-id/:id",async(req,res) => {
    let {id} = req.params; //id should be anumber
    id = Number(id);
    
    const getSpecificPublication = await publicationModel.findOne({id:id});

    return res.json(getSpecificPublication);
});

//GET publications based on book isbn
/**
 * route                /publications-isbn/:isbn
 * description          get  publications based on book isbn
 * access               public
 * parameter            isbn
 * methods              get
 */
app.get("/publications-isbn/:isbn",async(req,res) => {
    const {isbn} = req.params;

    const getPublicationBook = await publicationModel.find({ISBN:isbn});
    if(getPublicationBook.length===0){
        return res.json({"error":`No publication found for the book isbn ${isbn}`});
    }
    return res.json(getPublicationBook);
});

//---------------------------------------POST API-----------------------------------------------------------

//POST a book
/**
 * route                /addbook
 * description          post a book
 * access               public
 * parameter            none
 * methods              post
 */
app.post("/addbook", async (req,res) => {
    
    const addNewBook = await bookModel.create(req.body);
    
    return res.json({
        books : addNewBook,
        message: "Book was added!!!"
    });
});

//POST a author
/**
 * route                /addauthor
 * description          post a author
 * access               public
 * parameter            none
 * methods              post
 */
app.post("/addauthor",async (req,res) => {

    const addNewAuthor = await authorModel.create(req.body);
    return res.json({
        authors: addNewAuthor,
        message: "author added successfully!!"
    });
});

//POST a publication
/**
 * route                /addpublication
 * description          post a publication
 * access               public
 * parameter            none
 * methods              post
 */
app.post("/addpublication",async(req,res) => {

    const addNewPublication = await publicationModel.create(req.body);
    return res.json({
        publications: addNewPublication,
        message: "Publication added successfully!!!"
    });
});

//-------------------------------------------------PUT API------------------------------------------------------

//PUT update book details
/**
 * route                /book-update/:isbn
 * description          update book details
 * access               public
 * parameter            isbn
 * methods              put
 */
app.put("/book-update/:isbn",async (req,res) => {
    const {isbn} = req.params;
    
    //const updateBook = await bookModel.updateOne(req.body);

    const updateBook = await bookModel.findOneAndUpdate({ISBN:isbn},req.body,{new: true});

    return res.json({
        bookUpdate: updateBook,
        message: "Book updated successfully!!!"
    }); //we can see updated book details with the help of mongodb
});

//PUT update author details
/**
 * route                /author-update/:id
 * description          update author details
 * access               public
 * parameter            id
 * methods              put
 */
app.put("/author-update/:id",async (req,res) => {
    let {id} = req.params;  //id should be taken as a number and it should be let
    id = Number(id);

    const updateAuthor = await authorModel.findOneAndUpdate({id:id},req.body,{new: true});
   
    return res.json({
        authorUpdate: updateAuthor,
        message: "author updated successfully!!!"
    });
});

//PUT update publication details
/**
 * route                /publication-update/:id
 * description          update publication details
 * access               public
 * parameter            id
 * methods              put
 */
app.put("/publication-update/:id",async (req,res) => {
    let {id} = req.params;
    id = Number(id);
   
    const updatePublication = await publicationModel.findOneAndUpdate({id:id},req.body,{new: true});
    return res.json({
        publicationUpdate: updatePublication,
        message: "Publication details have been successfully updated!!!"
    });
});

//-------------------------------------------------DELETE API------------------------------------------------------

//DELETE a book
/**
 * route                /book-delete/:isbn
 * description          delete book details
 * access               public
 * parameter            isbn
 * methods              delete
 */
app.delete("/book-delete/:isbn",async (req,res) => {
    const {isbn} = req.params;

    const deleteBook = await bookModel.deleteOne({ISBN:isbn});
    return res.json({
        bookDeleted: deleteBook,
        message: "Book deleted successfully!!!"
    });
});

//DELETE one author from particular book
/**
 * route                /book-author-delete/:isbn/:id
 * description          delete one author from particular book
 * access               public
 * parameter            isbn , id
 * methods              delete
 */
app.delete("/book-author-delete/:isbn/:id",async (req,res) =>{
    let {isbn,id} = req.params;
    //id = Number(id);
    
    let getBook = await bookModel.findOne({ISBN:isbn});
    if(getBook===null){
        return res.json({"error":`No book found for isbn ${isbn}`});
    }
    else{
        getBook.authors.remove(id);
        const deleteAuthorFromBook = await bookModel.findOneAndUpdate({ISBN:isbn},getBook,{new: true});
        return res.json({
            delete : deleteAuthorFromBook,
            message: `author deleted successulyy from book id ${isbn}`
        });
    }
});

//DELETE a author
/**
 * route                /author-delete/:id
 * description          delete author details
 * access               public
 * parameter            id
 * methods              delete
 */
app.delete("/author-delete/:id",async (req,res) =>{
    let {id} = req.params;
    id = Number(id);

    const deleteAuthor = await authorModel.deleteOne({id:id});

    return res.json({
        authorDeleted: deleteAuthor,
        message: "author deleted successfully!!!"
    });
});

//DELETE a publication
/**
 * route                /publication-delete/:id
 * description          delete publication details
 * access               public
 * parameter            id
 * methods              delete
 */
app.delete("/publication-delete/:id",async (req,res) =>{
    let {id} = req.params;
    id = Number(id);

    const deletePublication = await publicationModel.deleteOne({id:id});
    return res.json({
        deletePub: deletePublication,
        message: "Publication deleted successfully!!!"
    });
});

//DELETE a book from publication
/**
 * route                /publication-delete-book/:id/:isbn
 * description          delete a book from publication
 * access               public
 * parameter            isbn , id
 * methods              delete
 */
app.delete("/publication-delete-book/:id/:isbn",async (req,res) => {
    let {id,isbn} = req.params;
    //id = Number(id);
    const getPub = await publicationModel.findOne({id:id});
    if(getPub===null){
        return res.json({"error":`No publication found for the id ${id}`});
    }
    else{
        getPub.books.remove(isbn);
        const deleteBookFromPublication = await publicationModel.findOneAndUpdate({id:id},getPub,{new: true});
        return res.json({
            deleteBook: deleteBookFromPublication,
            message: "book deleted from publication"
        });
    }
});



app.listen(8000,() => {
    console.log("local host :8000")
});