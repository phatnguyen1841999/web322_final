const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;
const schema_form = new schema(
    {
        email: String,
        fname: String,
        lname: String,
        birthdate: Date,
        username: String,
        password: String,
        is_admin:
        {
            type: Boolean,
            default: false
        },
        booked_room: []
    }
);

//The "pre" mongoose function is going to call the below function right before the document is saved to the DB
schema_form.pre("save",function(next){ // call the function right before it gets save to the database
  
    bcrypt.genSalt(10) // 10 is a number of Salt
    .then(salt=>{
        bcrypt.hash(this.password,salt) // create a random 10-char string 
        .then(hash=>{
            this.password=hash
            console.log("Encrypted")
            // The below code is a call back function that does the following :
             //It forces the code of execution to  move onto the next code in the execution queue 
            next();
        })
    })

})


const Users = mongoose.model('users', schema_form);
module.exports = Users;