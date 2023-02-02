const jwt=require("jsonwebtoken");


function verifytoken(req,res,next)
{
    const authheader=req.headers.token;
    if(authheader){
        jwt.verify(authheader,process.env.JWT_SEC,(err,user)=>{
            if(err)
            {
                return res.status(400).json(err);
            }
            else{
                req.user=user;
                next();
            }
        });
    }
    else
    {
        return res.status(400).json("not authenticated");
    }
}

module.exports={verifytoken};