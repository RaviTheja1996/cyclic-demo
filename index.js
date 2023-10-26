const express = require("express");
const { connection } = require("./db");
require("dotenv").config();
const { userRouter } = require("./Routes/user.routes");
const { noteRouter } = require("./Routes/note.routes");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());
app.use("/users", userRouter);
app.use("/notes", noteRouter);

app.get("/", (req, res) => {
  res.status(200).send({ "msg": "This is the homepage for testing the server" });
})

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("connected to DB");
    console.log(`server is running at port ${process.env.port}`);
  }
  catch (err) {
    console.log(err.message);
  }
})