const mongoose = require("mongoose")
const r_schema = mongoose.Schema

const roomSchema = new r_schema({
    title:
    {
        type: String,
        require: true
    },
    description:
    {
        type: String,
        required: true
    },
    price:
    {
        type: String,
        required: true
    },
    location:
    {
        type: String,
        required: true
    },
    profilePic:
    {
        type: String,
        require: true
    }
})

const room = mongoose.model("room",roomSchema)
module.exports = room
