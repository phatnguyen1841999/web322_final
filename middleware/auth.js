const hasAccess = (req,res,next)=>
{
    if(req.session.userInfo==null)
    {
        res.redirect("/you-can-not-do-that"); // the website will redirect to this ur;=l
        //when someone attempt to get access with protected routes
    }
    else
    {
        next();
    }
}

module.exports=hasAccess;