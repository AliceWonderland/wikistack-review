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
    console.log('test',req.body);
    console.log('test',req.params);
    console.log('test',req.query);

    // { authorName: 'test',
    //     authorEmail: [ 'test', 'test' ],
    //     title: 'test',
    //     pageContent: 'test' }
    // res.render('index');

    // do your post in here
    var page=Page.build({
        title:req.body.title,
        urlTitle:'mystring',
        content:req.body.pageContent,
        status:'open'
    });

    page.save()
    .then(function (postData) {
        // res.json(postData);
        res.redirect('/wiki/'+postData.urlTitle);
        // res.redirect(savedPage.route); // route virtual FTW
    });

});

//browse to /wiki/one_page
router.get('/wiki/:urlTitle',function (req,res,next) {
    // res.send(req.params.urlTitle);
    Page.findOne({where:{urlTitle:req.params.urlTitle}})
    .then(function (pageData) {
        if (pageData === null) {
            res.send('No page found with this title');
        }else{
            // res.send(pageData);
            res.render('wikipage', {page: pageData});
        }
    })
    .catch(next);
}); 

// browse to localhost:3000/wiki/users
router.get('/users',function (req,res,next) {
    res.send('/users');
});




module.exports=router;