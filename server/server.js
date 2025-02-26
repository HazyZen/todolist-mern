require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const TodoModel = require("./Models/Todos");

const app = express();

const PORT = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_ATLAS_URL;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://todo-mern-frontend-wine.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

mongoose
  .connect(`${mongoUrl}`, { useNewUrlParser: true, useUnifiedTopology: true })
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
