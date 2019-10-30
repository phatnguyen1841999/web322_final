const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();

//to use all the static folders in public folder
app.use(express.static('public'));

// tell the express to use the template engine to build views for the webpage
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// This tells Express to parse all submitted form data into the body of the request object
app.use(bodyParser.urlencoded({ extended: false }));

//create route handler functions for home page
// the "/" shows us that when we go to the main page the home template will be displayed
app.get('/', (req,res) =>
{
    res.render("homepage");
});

//create route handler function for room listing page

app.get('/room-listing', (req,res) =>
{
    res.render("room");
});

//create route handler function for sign-up page

app.get('/sign-up', (req,res) =>
{
    res.render("signup");
});


// For registration form, when user click submit this is what happen
app.post('/messages',(req,res)=>
{
    /***Server-sided validation***/
    const error = []; // initialize the error array to zero to store error message
    if (req.body.email == "")
    {
        error.push("Please Enter your Email");
    }

    
    if (req.body.first_name == "")
    {
        error.push("Please Enter your First Name");
    }
    
    if (req.body.last_name == "")
    {
        error.push("Please Enter your Last Name");
    }
    
    if (req.body.username == "")
    {
        error.push("Please Enter your username");
    }
    
    if (req.body.password == "")
    {
        error.push("Please Enter your Password");        
    }

    else if (req.body.password != '')
    {
        
        var pass_len = Object.keys(req.body.password).length;
        var pass = req.body.password;
        //by using the method above we can convert the req.body to object 
        if (pass_len < 6)
        {
            error.push("Password must have at least 6 characters");
        }

        // Password must contain one character and one digit
        else
        {
            // regrex allows us to set condition for password
            //the regrex below set that password must have one character and one digit
            var reg = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
           if (!reg.test(req.body.password))
           {
               error.push("Password must contain at least 1 character and 1 digit");
           }
        }

    }
    //** If there are errors, redirect to the homepage and display them**/
    if (error.length > 0)
    {

        res.render('homepage',{
            message:error
        });
    }

    
});

//

//create an express web server
const PORT = process.env.PORT || 2000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));