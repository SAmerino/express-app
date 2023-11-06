import jwt from "jsonwebtoken";

const jwtAuthenticated = (req, res, next) =>{
    const cookie = req.cookies["jwt"]

    if (!cookie){
        res.redirect("login")
        return
    }
    
    try{
        jwt.verify(cookie, process.env.JWT_PASS);
        next();
    } catch(error) {
        console.log("error", error);
        res.redirect("login");
    }
}

export default jwtAuthenticated;