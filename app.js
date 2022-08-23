const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('./models.js');
const bcrypt = require('bcrypt');
const MongoStore = require("connect-mongo");
mongoose.connect(process.env.MONGODB_URL)

const expressSession = require("express-session");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const app = express();
const Ticket = mongoose.model("Tickets");
const User = mongoose.model("Users");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: "RockRockRock"
}));

// GET REQUESTS:
app.use('/', require('./routes/static'));
app.use('/about', require('./routes/static'));
app.use('/forgot', require('./routes/static'));
app.use('/fanmail', require('./routes/static'));
app.use('/login', require('./routes/static'));
app.use('/register', require('./routes/static'));
app.use('/tickets', require('./routes/static'));
// END GET REQUESTS


// POST FORGOT
app.post('/forgot', function(req,res, next) {
  console.log("started forgot")
  let password = "SeatGeek" + Math.floor(Math.random() * 100);
  User.findOne({
    email:req.body.email
  }, function (err,user){
    if (err) return next({message:"Email not found."});
    if (!user) return next({message:"Email not found."});
    user.password = bcrypt.hashSync(password, 10)
    user.save(function(err){
       if(err)return handleErr(err);
       //user has been updated
   });
    // Send an email with the reset password
    const msg = {
      to: req.body.email, // Change to your recipient
      from: 'mkeeley+twillio@seatgeek.com', // Change to your verified sender
      subject: 'Password Reset',
      text: 'Your password has been reset! Your new password is: ' + password
    }
    sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
    return next({message:"Password reset email has been sent!"})
  });
});
// END POST FORGOT

// POST LOGIN
app.post('/login', function(req,res, next) {
  User.findOne({
    email:req.body.email
  }, function (err,user){
    if (err) return next({message:"Username or password is incorrect."});
    if (!user) return next({message:"Username or password is incorrect."});
    if(bcrypt.compareSync(req.body.password, user.password )){
      req.session.loggedin = true;
      if (user.is_admin ){
        req.session.is_admin = true;
      }
      res.redirect('/');
    }else{
      return next({message:"Username or password is incorrect."});
    }
  });
});
// END POST LOGIN



// POST REGISTER
app.post('/register', function(req,res, next) {
  User.findOne({
    email:req.body.email.toLocaleLowerCase()
  }, function (err,user){
    if (err) return next(err);
    if (user) return next({message:"User has already exists."});
    let date = new Date();
    let new_user = new User({
      email: req.body.email,
      name: req.body.name,
      is_admin: req.body.is_admin,
      password: bcrypt.hashSync(req.body.password, 10),
      created_at: date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear()
    });
    new_user.save(function(err){
      if (err) return next(err)
      // Send user an email saying they have been created and provide them their temp password.
      console.log('User has been created!')
      res.redirect('/');
    });
  });
});
// END POST REGISTER


// POST TICKET
app.post('/tickets', function(req,res, next) {
    let date = new Date();
    let new_ticket = new Ticket({
      date: req.body.date,
      venue: req.body.venue,
      location: req.body.location,
      created_at: date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear()
    });
  new_ticket.save(function(err){
      if (err) return next(err)
      // Send user an email saying they have been created and provide them their temp password.
      console.log('Ticket has been created!')
      res.redirect('/');
    });
});
// END POST TICKET


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('404')
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
