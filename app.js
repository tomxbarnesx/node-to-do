var express = require('express');
var session = require('cookie-session'); // Loads the piece of middleware for sessions
var bodyParser = require('body-parser'); // Loads the piece of middleware for managing the settings
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json()); 

app.use(express.static('public'));

app.use(session({
    secret: 'todotopsecret',
    maxAge: 24 * 60 * 60 * 1000
}));

/* If there is no to do list in the session, 
we create an empty one in the form of an array before continuing */
app.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    next();
});

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('todo.ejs', {todolist: req.session.todolist});
});

app.post('/add/', urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
        req.session.todolist.push(req.body.newtodo);
    }
    res.redirect('/');
})

app.get('/show/:id', function(req, res){
    res.setHeader('Content-Type', 'text/html');
    res.render('show.ejs', {id: req.params.id, todolist: req.session.todolist});
})

// app.post('/edit/:id', urlencodedParser, function(req, res){
//     if (req.body.edittodo != ''){
//         req.session.todolist.splice(req.params.id, 1);
//         req.session.todolist.push(req.body.edittodo);
//     }
//     res.redirect('/');
//     // res.render('edit.ejs', {todolist: req.session.todolist});
// })

app.get('/delete/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/');
})

app.post('')

app.listen(8080);