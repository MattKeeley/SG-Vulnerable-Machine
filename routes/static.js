var express = require('express');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
var router = express.Router();
const Ticket = mongoose.model("Tickets");
const User = mongoose.model("Users");


router.get('/', function(req,res, next){
    // INIT this should be in a diff docker container but whatevs
    User.findOne({email:"admin@seatgeek.com"
    }, function (err,user) {
        if (err) return next({message: "Something broke."});
        if (!user) {
            let date = new Date();
            let gen_passwd = (Math.random() + 1).toString(36).substring(2);
            console.log("Admin password: " + gen_passwd)
            let new_admin = new User({
                email: "admin@seatgeek.com",
                name: "Matt Keeley",
                password: bcrypt.hashSync(gen_passwd, 10),
                is_admin: true,
                created_at: date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear()
            });
            new_admin.save(function (err) {
                if (err) return next(err)
                console.log('generated basic table')
            })
            let new_ticket1 = new Ticket({
                date: "Sep 4, 2022",
                venue: "The Fruit Yard",
                location: "Modesto, CA",
                created_at: date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear()
            });
            new_ticket1.save(function(err) {
                if (err) return next(err)
            });

            let new_ticket2 = new Ticket({
                date: "Nov 15, 2022",
                venue: "The Mill",
                location: "Terre Haute",
                created_at: date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear()
            });
            new_ticket2.save(function(err) {
                if (err) return next(err)
            });

            let new_ticket3 = new Ticket({
                date: "Dec 16, 2022",
                venue: "Country in the Burg",
                location: "Cedarburg, WI",
                created_at: date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear()
            });
            new_ticket3.save(function(err) {
                if (err) return next(err)
            });

            let new_ticket4 = new Ticket({
                date: "Jan 17, 2022",
                venue: "Long Island Amphitheater",
                location: "Farmingville, NY",
                created_at: date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear()
            });
            new_ticket4.save(function(err) {
                if (err) return next(err)
            });

            let new_ticket5 = new Ticket({
                date: "Mar 22, 2022",
                venue: "Annapolis City Dock",
                location: "Annapolis, MD",
                created_at: date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear()
            });
            new_ticket5.save(function(err) {
                if (err) return next(err)
            });
            let new_ticket6 = new Ticket({
                date: "Apr 23, 2022",
                venue: "Hampton Beach Casino Ballroom",
                location: "Hampton Beach, NH",
                created_at: date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear()
            });
            new_ticket6.save(function(err) {
                if (err) return next(err)
            });
        }
    })
    // END INIT
    var loggedin = req.session.loggedin;
    res.render('index', { loggedin : loggedin });
});


router.get('/about', function(req, res, next) {
    var loggedin = req.session.loggedin;
    res.render('about', { loggedin : loggedin });
});

router.get('/admin', function(req, res, next) {
    if(!req.session.loggedin == true) res.redirect('login');
    var loggedin = req.session.loggedin;
        Ticket.find((err, tickets) => {
        res.render('admin', {
            loggedin : loggedin,
            tickets:tickets
        });
    });
});

router.get('/forgot', function(req, res, next) {
    var loggedin = req.session.loggedin;
    res.render('forgot', { loggedin : loggedin });
});
router.get('/fanmail', function(req, res, next) {
    if(!req.session.loggedin == true) res.redirect('login');
    var loggedin = req.session.loggedin;
    res.render('fanmail', { loggedin : loggedin });
});

router.get('/login', function(req, res, next) {
    var loggedin = req.session.loggedin;
    res.render('login', { loggedin : loggedin });
});

router.get('/register', function(req, res, next) {
    var loggedin = req.session.loggedin;
    res.render('register', { loggedin : loggedin });
});

router.get('/tickets', function(req, res, next) {
        if(!req.session.loggedin == true) res.redirect('login');
        var loggedin = req.session.loggedin;
        Ticket.find((err, tickets) => {
                res.render("tickets", {
                    tickets: tickets,
                    loggedin : loggedin
                });
            });
});

module.exports = router;