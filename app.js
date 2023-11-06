import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";


const app = express();

dotenv.config();

app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    layoutsDir: new URL("./views/layouts", import.meta.url).pathname,
    partialsDir: new URL("./views/partials", import.meta.url).pathname,
    defaultLayout: "index",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

mongoose
  .connect(process.env.URL_MONGO)
  .then(() => {
    console.log("Connected to Mongo Database");
  })
  .catch((error) => {
    console.error(`Connection refuse: ${error}`);
  });

export default app ;