const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const User = require("../models/schema_user")
const key = require('../config/key');
const roomModel = require("../models/room")
const hasAccess = require("../middleware/auth");
const bcrypt = require("bcryptjs")
const path = require("path")


//create route handler functions for home page
// the "/" shows us that when we go to the main page the home template will be displayed
router.get('/', (req, res) => {
    res.render("homepage");
});

//create route handler function for room listing page

router.get('/room-listing', (req, res) => {
    roomModel.find()
        .then((room) => {
            res.render("room/room",
                {
                    list: room
                })
        })
        .catch(err => console.log(err))
});


router.get("/user/room-listing", hasAccess, (req, res) => {
    roomModel.find()
        .then((room) => {
            res.render("room/userRoom",
                {
                    list: room
                })
        })
        .catch(err => console.log(err))
})
//create route handler function for sign-up page

router.get('/sign-up', (req, res) => {
    res.render("signup");
});

// For registration form, when user click submit this is what happen
router.post('/messages', (req, res) => {
    /***Server-sided validation***/
    const error = []; // initialize the error array to zero to store error message
    if (req.body.email == "") {
        error.push("Email is empty");
    }

    if (req.body.first_name == "") {
        error.push("Please Enter your First Name");
    }

    if (req.body.last_name == "") {
        error.push("Please Enter your Last Name");
    }

    /*if (req.body.username == "")
    {
        error.push("Please enter your username")
    }*/


    if (req.body.password == "") {
        error.push("Please Enter your Password");
    }

    if (req.body.password != '') {

        var pass_len = Object.keys(req.body.password).length;
        var pass = req.body.password;
        //by using the method above we can convert the req.body to object 
        if (pass_len < 6) {
            error.push("Password must have at least 6 characters");
        }

        // Password must contain one character and one digit
        else if (!(pass_len > 6)) {
            // regrex allows us to set condition for password
            //the regrex below set that password must have one character and one digit
            var reg = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
            if (!reg.test(req.body.password)) {
                error.push("Password must contain at least 1 character and 1 digit");
            }
        }
        if (req.body.cpassword == " ") {
            error.push("Please re-type your password")
        }
        else {
            if (req.body.password != req.body.cpassword) {
                error.push("Password doesn't match")
            }
        }

    }

    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user != null) {

                console.log(req.body.username)
                error.push("Sorry, your username already exists in the database")
                //** If there are errors, redirect to the homepage and display them**/
                if (error.length > 0) {

                    res.render('homepage', {
                        message: error
                    });
                }



            }
            else {

                if (error.length == 0) {

                    //*SEND CONFIRMATION EMAIL

                    const nodemailer = require('nodemailer');
                    const sgTransport = require('nodemailer-sendgrid-transport');

                    const options = {
                        auth: {
                            api_key: `${key.key.SENDGRID_KEY1}`
                        }
                    }

                    const mailer = nodemailer.createTransport(sgTransport(options));

                    const email = {
                        to: `${req.body.email}`,
                        from: 'ttpnguyen2@myseneca.ca',
                        subject: 'Confirmation Email',
                        text: 'This is a confirmation email',
                        html: '<strong>Hi! This is a confirmation email to let you know that you are now our member.</strong>',
                    };

                    mailer.sendMail(email, (err, res) => {
                        if (err) {
                            console.log(err)
                        }
                        console.log(res);
                    });


                    /*ADD INFORMATION TO MONGODB DATABASE */


                    //Add data to MongoDB database
                    const formData =
                    {
                        email: req.body.email,
                        fname: req.body.first_name,
                        lname: req.body.last_name,
                        birthdate: req.body.dob,
                        username: req.body.username,
                        password: req.body.password
                    }

                    const user = new User(formData);

                    user.save()
                        .then(() => {
                            console.log("Added")
                        })
                        .catch(err => {
                            console.log(`${err}`)
                        })
                    res.redirect("/");
                }
            }
        })
        .catch(err => console.log(`Something occured ${err}`));


});


//Route to direct use to Registration form
router.get("/register", (req, res) => {
    res.render("homepage");
});




//Route to direct user to login form
router.get("user/login", (req, res) => {
    res.render("partials/login");
});

//Route to process user's request and data when user submits login form
router.post("/user/login", (req, res) => {

    const errors = [];
    const formData = {
        username: req.body.username,
        password: req.body.password
    }

    User.findOne({ username: formData.username })
        .then(user => {
            //This means that there was no matching email in the database
            if (user == null) {
                console.log("check")
                errors.push("Sorry your username was not found");
                res.render("homepage",
                    {
                        errors_log: errors
                    })
            }

            //This reprsents tha the email exists
            else {
                console.log("match")
                bcrypt.compare(formData.password, user.password)
                    .then(isMatched => {

                        if (isMatched == true) {
                            //It means that the user is authenticated 
                            //Create session 
                            req.session.userInfo = user;

                            if (user.is_admin == false) {
                                console.log("user")
                                res.redirect("/user/profile")
                            }
                            else {
                                req.session.adminInfo = user;
                                console.log("admin")
                                res.redirect("/admin/profile")
                            }
                        }

                        else {
                            errors.push("Sorry, your password does not match");
                            res.render("homepage", {
                                errors_log: errors
                            })

                        }

                    })
                    .catch(err => console.log(`Error :${err}`));
            }
        })
        .catch(err => console.log(`Something occured ${err}`));



});


router.get("/user/logout", (req, res) => {

    //This destorys the session
    req.session.destroy();
    res.redirect("/");

});

//Route the user to their dashboard 
router.get("/user/profile", hasAccess, (req, res) => {
    res.render("User/userDashboard");

});

// Route to admin dashboard
router.get("/admin/profile", hasAccess, (req, res) => {

    res.render("User/adminDashboard")
})


//routes to searched rooms
router.get("/results", (req, res) => {
    res.render("room/room")
})

router.post("/results", (req, res) => {
    console.log(req.body.location)
    roomModel.find({ location: req.body.location })
        .then((room) => {
            if (room == null) {
                res.render("partials/noRes")
            }
            else {
                res.render("room/room", {
                    list: room
                })
            }

        })
        .catch(err => console.log(err))
})

/*book room

router.get("/room/book",hasAccess,(req,res)=>
{
   res.send("Hi")
})

router.post("/room/book",hasAccess,(req,res)=>
{
    const user ={
        book: []
    }
    user.book.push(req.body.book)
    console.log(user.book[0])
    console.log(req.body.id_us)
    /*user.save()
    .then((user) => console.log("Added new booked room"))
    .catch(err=>console.log(err))
})*/
module.exports = router