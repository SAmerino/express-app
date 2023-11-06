import jwt from "jsonwebtoken";

const isAuthenticated = (req) => {
    const cookie = req.cookies["jwt"];

    if (!cookie) {
        return false;
    }

    try {
        jwt.verify(cookie, process.env.JWT_PASS);
        return true;
    } catch (error) {
        return false;
    }
}
export default isAuthenticated;