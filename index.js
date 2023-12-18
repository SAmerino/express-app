import app from "./app.js";

const port = 3000

import mainRouter from "./routes/main.js";
import userRouter from "./routes/user.js"

app.use("", mainRouter);
app.use("/usuarios", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})