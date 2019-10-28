const express = require('express');
const exphbs = require('express-handlebars');


const app= express();
//to use all the static folders in public folder
app.use(express.static('public'));

// tell the express to use the template engine to build views for the webpage
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

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


//create an express web server
const PORT = process.env.PORT || 2000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));