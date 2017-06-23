//packages
const express=require('express');
const app=express(); //new instance of express
const volleyball=require('volleyball');
const bodyParser=require('body-parser');
const nunjucks=require('nunjucks');

// my modules
const routes=require('./routes');
const db=require('./models');

// SETUP
// setup logger
app.use(volleyball);

// setup body parser
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded

// setup static folder for resources like styles
app.use(express.static('public'));

// setup nunjucks
app.set('view engine', 'html'); //lets you drop .html extension
app.engine('html', nunjucks.render);
nunjucks.configure('views', { noCache: true }); //look in folder views

// setup routes
app.use('/',routes);
// app.use('/wiki', routes); //change root folder

// setup errorhandler
app.use(function (err,req,res,next) {
    //error handler
    next();
});

// start server w db sync
db.User.sync({}) //must use this notation if passing an obj of module.exports
.then(function () {
    return db.Page.sync({});
})
.then(function(){
    app.listen('3000',function(req,res,next){
        console.log("Listening on port 3000...");
    });
})
.catch(console.error);

// models.db.sync({force: true}) //drops tables and recreates

// db.sync()
// .then(function () {
//     app.listen('3000',function(req,res,next){
//         console.log("Listening on port 3000...");
//     });
// });

// app.listen('3000',function(req,res,next){
//     console.log("Listening on port 3000...");
// });
