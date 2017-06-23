// packages
const express=require('express');
const router=express.Router();

// my modules
const models=require('../models');
const Page=models.Page;
const User=models.User;

// root path
router.get('/',function (req,res,next) {
    res.redirect('/wiki')

});

router.get('/wiki',function(req,res,next){
    res.render('index');
});
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
    .then(res.redirect('/'));

});
router.get('/wiki/add',function (req,res,next) {
    res.render('addpage');
});
router.get('/users',function (req,res,next) {
    res.send('/users');
});

module.exports=router;