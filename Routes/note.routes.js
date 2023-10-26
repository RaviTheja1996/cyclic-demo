const express = require("express");
const { NoteModel } = require("../models/note.model");
const { authMiddleware } = require("../middleware/auth.middleware");

const noteRouter = express.Router();

noteRouter.use(authMiddleware);

noteRouter.post("/create", async (req, res) => {
  try {
    const note = new NoteModel(req.body);
    await note.save();
    res.status(200).send({ "msg": "A new notes has been stored successfully" });
  }
  catch (err) {
    res.status(400).send({ "error": err.message });
  }
});
noteRouter.get("/", async (req, res) => {
  try {
    const notes = await NoteModel.find({ username: req.body.username });
    res.status(200).send(notes);
  }
  catch (err) {
    res.status(400).send({ "error": err.message });
  }
});
noteRouter.patch("/update/:noteID", async (req, res) => {
  const { noteID } = req.params;
  const userID = req.body.userID;
  try {
    const note = await NoteModel.findOne({ _id: noteID });
    if (userID === note.userID) {
      await NoteModel.findByIdAndUpdate({ _id: noteID }, req.body);
      res.status(200).send({ "msg": `notes with id ${noteID} updated successfully`, "updated_note": note });
    }
    else {
      res.status(200).send({ "msg": "you are not authorized" });
    }
  }
  catch (err) {
    res.status(400).send({ "error": err.message });
  }
});
noteRouter.delete("/delete/:noteID", async (req, res) => {
  const { noteID } = req.params;
  const userID = req.body.userID;
  try {
    const note = await NoteModel.findOne({ _id: noteID });
    if (userID === note.userID) {
      await NoteModel.findByIdAndDelete({ _id: noteID });
      res.status(200).send({ "msg": `notes with id ${noteID} deleted successfully`, "deleted_note": note });
    }
    else {
      res.status(200).send({ "msg": "you are not authorized" });
    }
  }
  catch (err) {
    res.status(400).send({ "error": err.message });
  }
});

module.exports = { noteRouter };