const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const key = require('./config/key');
const session = require("express-session"); // package used to create session
const fileupload = require("express-fileupload")
const methodOverride = require('method-override'); 



const app = express();

//to use all the static folders in public folder
app.use(express.static('public'));

// tell the express to use the template engine to build views for the webpage
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// This tells Express to parse all submitted form data into the body of the request object
app.use(bodyParser.urlencoded({ extended: false }));

//This is how you map your file upload to express
app.use(fileupload()) // map your file up load to express

//import routes objects
const userRoutes = require("./routes/UserRoutes")
const roomRoutes = require("./routes/roomRoutes")

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//This is used to make express load all static resources within the public folder
app.use(express.static("public"));

//session
app.use(session({secret:"This is my secret key. This should not be shown to everyone"}))

app.use((req,res,next)=>{

    //This is a global variable that can be accessed by templates
    res.locals.user= req.session.userInfo;
    res.locals.admin = req.session.adminInfo;
    next();
})

//MAPS routes object

app.use("/", userRoutes)
app.use("/admin", roomRoutes)


//To connect your project to your MongoDB

mongoose.connect(key.key.MONGO_URL, {useUnifiedTopology: true, useNewUrlParser: true,})
.then(()=>
{
    console.log("Connect to database successfully")
})
.catch(err =>
    {
        console.log(`${err}`)
    })

   
//create an express web server
const PORT = process.env.PORT || 2000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));