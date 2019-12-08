const express = require("express")
const router = express.Router()
const roomModel = require("../models/room")
const hasAccess= require("../middleware/auth");
const path = require("path")

router.post("/profile/add-room", hasAccess, (req, res) => {
    //validation
    const newRoom = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        location: req.body.location,
    }
    console.log(req.body.title)

    const errors = [];

    //Test to see if user did not upload file
    if (req.files == null) {
        errors.push("Sorry you must upload a file")
        console.log("check 2")
    }

    //User uploaded file
    else {
        //file is not an image
        console.log("check 3")
        if (req.files.profilePic.mimetype.indexOf("image") == -1) {
            errors.push("Sorry you can only upload images : Example (jpg,gif, png) ")
        }
    }


    //Has errors
    if (errors.length > 0) {
        res.render("User/adminDashboard", {
            errors_f: errors,
            title: newRoom.title,
            description: newRoom.description,
            price: newRoom.price,
            location: newRoom.location
        })
    }

    else {
        const roomDoc = new roomModel(newRoom)
        //create  new room
        roomDoc.save()
            .then(room => {

                console.log("filename")
                //rename file to include the userid
                req.files.profilePic.name = `db_${roomDoc._id}${path.parse(req.files.profilePic.name).ext}`
                console.log(req.files.profilePic.name)
                //upload file to server
                req.files.profilePic.mv(`public/upload/${req.files.profilePic.name}`)
                    .then(() => {
                        console.log("yessss")
                        //Then is needed to refer to associate the uploaded image to the user
                        roomModel.findByIdAndUpdate(roomDoc._id, {
                            profilePic: req.files.profilePic.name
                        })
                            .then(() => {
                                console.log(`File name was updated in the database`)
                                res.redirect("/admin/profile");
                            })
                            .catch(err => console.log(`Error :${err}`));
                    });
            })
            .catch(err => console.log(`${err}`));
    }
})



router.get("/profile/add-room", hasAccess, (req, res) => 
{
    res.render("User/adminDashboard")
});


//This routes is used to display room from the database
router.get("/room-listing",hasAccess,(req,res)=>
{
    roomModel.find()
    .then((room)=>
    {
        res.render("partials/adminRoom", 
        {
            list: room
        })
    })
    .catch(err=>console.log(err))
})


//Edit Room

router.get("/edit/:id",hasAccess,(req,res)=>
{
    roomModel.findById(req.params.id)
    .then((room)=>{

        res.render("room/editRoom",{
            allRoom: room
        })

    })
    .catch(err=>console.log(`Error : ${err}`));
});


//edit room

router.put("/edit/:id",hasAccess,(req,res)=>
{
    roomModel.findById(req.params.id)
    .then((room)=>{

        room.title=req.body.title;
        room.price = req.body.price;
        room.location = req.body.location;
        room.description=req.body.description;

        room.save()

        .then(()=>{
           res.redirect("/room-listing") 
        })
        .catch(err=>console.log(`Error : ${err}`));

    })
    .catch(err=>console.log(`Error : ${err}`));
});
module.exports = router
