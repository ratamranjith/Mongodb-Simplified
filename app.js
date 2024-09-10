const express = require('express')
const bodyparser = require('body-parser')
const exhbs = require('express-handlebars')
const { dbo, ObjectId } = require('./db');
const app = express()

app.engine('hbs', exhbs.engine({ layoutsDir: 'views/', defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(bodyparser.urlencoded({
    extended: false
}))

app.get('/', async (req, res) => {
    let message = "";
    let edit_book_id, edit_book;
    console.log(req.query.status);

    let database = await dbo();
    const collection = database.collection('books');
    const cursor = collection.find({});

    if (req.query.edit_book_id && ObjectId.isValid(req.query.edit_book_id)) {
        edit_book_id = req.query.edit_book_id;
        edit_book = await collection.findOne({ _id: new ObjectId(edit_book_id) });
    }

    if (req.query.delete_book_id && ObjectId.isValid(req.query.delete_book_id)) {
        delete_book_id = req.query.delete_book_id;
        delete_book = await collection.deleteOne({ _id: new ObjectId(delete_book_id) });
        return res.redirect('/?status=3');
    }

    switch (req.query.status) {
        case '1':
            message = "Books added successfully";
            break;
        case '2':
            message = "Books updated successfully";
            break;
        case '3':
            message = "Books Deleted successfully";
            break;
    }


    let books = await cursor.toArray();
    console.log(books);
    res.render('main', { message, books, edit_book, edit_book_id });

})

app.post('/addBook', async (req, res) => {

    let database = await dbo();
    const collection = database.collection('books');
    let book = {
        "title": req.body.title,
        "author": req.body.author,
        "year": req.body.year
    }
    await collection.insertOne(book);
    return res.redirect('/?status=1')


})

app.post('/update_book/:edit_book_id', async (req, res) => {

    let database = await dbo();
    const collection = database.collection('books');
    let edit_book_id = req.params.edit_book_id;

    let book = {
        "title": req.body.title,
        "author": req.body.author,
        "year": req.body.year
    }
    await collection.updateOne({ _id: new ObjectId(edit_book_id) }, { $set: book });
    return res.redirect('/?status=2')
})

app.post('/delete_book/:delete_book_id', async (req, res) => {

    let database = await dbo();
    const collection = database.collection('books');
    let edit_book_id = req.params.edit_book_id;

    let book = {
        "title": req.body.title,
        "author": req.body.author,
        "year": req.body.year
    }
    await collection.deleteOne({ _id: new ObjectId(edit_book_id) }, { $set: book });
    return res.redirect('/?status=3')
})



app.listen(4000, () => {
    console.log('Listening to Ports');

})