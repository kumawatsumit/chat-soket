var express = require('express');
var router = express.Router();
var userModel = require('../models/User');
var jwt = require('jsonwebtoken');

async function checkUsername(req, res, next){
  var usename = req.body.uname; 
  var checkUser =  userModel.findOne({ username: usename });
      checkUser.exec( (err, data) => {
        if(err) throw err;
        if(data){
          return res.render('signup', { title: 'SignUp Page', msg: 'User already exist' });
        }
        next();
    });
  }

 function checkEmail(req, res, next) {
  var userEmail = req.body.email;
  var checkEmail = userModel.findOne({ email: userEmail });
  checkEmail.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render('signup', { title: 'SignUp Page', msg: 'Email already exist' });
    }
    next();
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login Page',msg: '' });
});


//Login User
router.post('/', function (req, res, next) {
    var { email, password  } = req.body;
    var checkEmail = userModel.findOne({ email: email});
      checkEmail.exec((err, data) => {
      if (err) throw err;
      if (data) {
        var getUserId = data._id; 
        var token = jwt.sign({ UserId: getUserId }, 'loginToken');

        var getPassword = data.password; 
        if (getPassword == password){
          res.redirect('dashboard');
         // res.render('dashboard', { title: 'SignUp Page', msg: 'Login Successfully' });
        }else{
          res.render('index', { title: 'Login Page', msg: 'Password not match' });
        }
      }else{
        res.render('index', { title: 'Login Page', msg: 'Invalied login' });
      }
  });

});

router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'SignUp Page',msg:'' });
});


//SignUp user
router.post('/signup', checkUsername,checkEmail , async function(req,res, next){
	// console.log("lkdsldnlsndl");
   // console.log(req.body);
 
    var usename = req.body.uname;
    var email = req.body.email;
    var pass = req.body.password;
    
    var newUser =  new userModel({
      "username": usename,
      "email": email,
      "password": pass
    });

    newUser.save(function (err, user) {
      if (err) {
        res.render('signup', { title: 'SignUp Page', msg: 'Not signup' });
      }else{
        res.render('dashboard');
      }
      //console.log(user);
     // res.render('dashboard');
    })
      
});

	router.get('/dashboard', function (req, res, next) {
	  res.render('dashboard', { title: 'SignUp Page' });
	});    
  
module.exports = router;
