import jwt from "jsonwebtoken";

const jwtAuthenticated = (req, res, next) =>{
    const isAuth = req.headers.authorization;

    if (!isAuth){
        res.json({success: false, message: "acceso denegado"})
        return
    }
    
    try{
        jwt.verify(isAuth, process.env.JWT_PASS);
        next();
    } catch(error) {
        console.log("error", error);
        res.json({success: false, message: "acceso denegado"})
    }
}

export default jwtAuthenticated;