// packages
const express=require('express');
const router=express.Router();

// my modules
const models=require('../models');
const Page=models.Page;
const User=models.User;

// dir root
router.get('/',function (req,res,next) {
    res.redirect('/wiki')
});

// urlpath root
router.get('/wiki',function(req,res,next){
    Page.findAll({})
    .then(function (pageData) {
        if (pageData === null) {
            res.send('No page found with this title');
        }else{
            // res.send(pageData);
            res.render('index', {page: pageData});
        }
    })
    .catch(next);
    // res.render('index');
});

//browse to localhost:3000/wiki/add
router.get('/wiki/add',function (req,res,next) {
    res.render('addpage');
});

// POST for /wiki/add
router.post('/wiki',function (req,res,next) {
    console.log('POST body',req.body);
    console.log('POST params',req.params);
    console.log('POST query',req.query);

    // { authorName: 'test',
    //     authorEmail: [ 'test', 'test' ],
    //     title: 'test',
    //     pageContent: 'test' }
    // res.render('index');

    // do your post in here

    // MY SOLUTION
    // Page.build({
    //     title:req.body.title,
    //     urlTitle:'mystring',
    //     content:req.body.pageContent,
    //     status:'open'
    // })
    // .save()
    // .then(function (postData) {
    //     // console.log(postData);
    //     // res.json(postData);
    //     res.redirect('/wiki/'+postData.urlTitle);
    //     // res.redirect(savedPage.route); // route virtual FTW
    // });


    // var user=User.build({
    //     name:req.body.authorName,
    //     email:req.body.authorEmail
    // });
    
    

    // page.save()
    // .then(function (postData) {
    //     // res.json(postData);
    //     res.redirect('/wiki/'+postData.urlTitle);
    //     // res.redirect(savedPage.route); // route virtual FTW
    // });


    // HINT Solution
    User.findOrCreate({
        where: {
            name: req.body.authorName,
            email: req.body.authorEmail
        }
    })
    .then(function (values) {
        // console.log("my values",values);
        var user = values[0];
        // console.log('USER',user);
        var page = Page.build({
            title: req.body.title,
            content: req.body.pageContent
        });

        return page.save().then(function (page) {
            return page.setAuthor(user) //this method exists because of BelongsTo
        });

    })
    .then(function (page) {
        // res.send('test');
        res.redirect('/wiki/'+page.urlTitle);
    })
    .catch(next);


});

// browse to localhost:3000/wiki/users
// had to put this before the below

// get list of users
router.get('/wiki/users/',function (req,res,next) {
    User.findAll({})
    .then(function (usersList) {
        // console.log(usersList);
        // res.send(usersList);
        res.render('users',{users:usersList});
    });

});

// get single user
router.get('/wiki/users/:id',function (req,res,next) {
    User.findAll({where: {id: req.params.id}})
    .then(function (userData) {
        // res.send(userData);
        res.render('single',{user:userData});
    });

    // res.send('/users ID');
});

//browse to /wiki/one_page
router.get('/wiki/:urlTitle',function (req,res,next) {
    // res.send(req.params.urlTitle);
    Page.findOne({where:{urlTitle:req.params.urlTitle},
        include:[
            {model:User, as:'author'}
        ]
    })
    .then(function (pageData) {
        if (pageData === null) {
            res.send('No page found with this title');
        }else{
            // res.send(pageData);
            // console.log(pageData);
            res.render('wikipage', {page: pageData});
        }
    })
    .catch(next);
}); 

module.exports=router;