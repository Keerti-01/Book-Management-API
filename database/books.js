const mongoose = require('mongoose');

//create book schema
const bookSchema = mongoose.Schema({
    ISBN: String,
    title: String,
    authors: [Number],   //array of numbers
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: [String],  //arrray of strings
    publication: Number 
});

const bookModel = mongoose.model("books",bookSchema);

module.exports = bookModel;