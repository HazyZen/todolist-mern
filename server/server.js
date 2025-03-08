require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TodoModel = require("./Models/Todos");

const app = express();

const PORT = process.env.PORT;
const mongoUrl = process.env.MONGO_ATLAS_URL;

app.use(express.json());

const corsOptions = {
  origin: ["https://todolist-mern-frontend.vercel.app"],
  method: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

mongoose
  .connect(`${mongoUrl}`)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => console.error("Database connection error: ", err));

app.get("/api", (req, res) => {
  res.status(200).send("TodoList Server");
});

app.get("/api/list", (req, res) => {
  TodoModel.find()
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

app.post("/api/todo", (req, res) => {
  const todo = req.body.todo;
  TodoModel.create({
    todo: todo,
  })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

app.patch("/api/update/:id", (req, res) => {
  const { id } = req.params;

  TodoModel.findById(id)
    .then((todo) => {
      if (!todo) res.status(404).json({ message: "Todo not found" });

      todo.done = !todo.done;
      return todo.save();
    })
    .then((updatedTodo) => res.json(updatedTodo))
    .catch((err) => res.status(500).json(err));
});

app.delete("/api/delete/:id", (req, res) => {
  const { id } = req.params;

  TodoModel.findByIdAndDelete(id)
    .then((todo) => {
      if (!todo) res.status(404).json({ message: "Todo not found" });
      return res.status(200).json(todo);
    })
    .catch((err) => res.status(500).json(err));
});

app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
