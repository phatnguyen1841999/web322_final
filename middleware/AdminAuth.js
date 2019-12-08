const hasAccessAd = (req,res,next)=>
{
    if(req.session.adminInfo==null)
    {
        res.redirect("/you-are-not-admin"); // the website will redirect to this ur;=l
        //when someone attempt to get access with protected routes
    }
    else
    {
        next();
    }
}

module.exports=hasAccessAd;