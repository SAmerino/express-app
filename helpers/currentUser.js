import jwt from "jsonwebtoken";

const currentUser = async (req) => {
  const isAuth = req.headers.authorization;

  if (!isAuth) return null;

  try {
    const token = await jwt.verify(isAuth, process.env.JWT_PASS);
    return token;
  } catch (error) {
    console.log("error", error);
    null;
  }
};

export default currentUser;