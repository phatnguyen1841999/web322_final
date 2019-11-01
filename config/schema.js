const mongoose = require('mongoose');

const schema = mongoose.Schema;
const schema_form = new schema(
    {
        email: String,
        fname: String,
        lname: String,
        birthdate: Date,
        username: String,
        password: String
       
    }
);

module.exports.schema_form = schema_form;