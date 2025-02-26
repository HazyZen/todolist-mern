import axios from "axios";
import { useState } from "react";
import "./App.css";
import PropTypes from "prop-types";

const apiUrl = import.meta.env.VITE_DB_URL;

const Addtodo = ({ onAdd }) => {
  const [todo, setTodo] = useState("");

  const handleAdd = async () => {
    if (!apiUrl) {
      console.log("API URL is not defined");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/todo`, {
        todo: todo,
      });

      onAdd(response.data);
      setTodo("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={todo}
        placeholder="Enter Task"
        onChange={(e) => setTodo(e.target.value)}
      />
      <button onClick={handleAdd}>ADD</button>
    </div>
  );
};

Addtodo.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default Addtodo;
