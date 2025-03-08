import axios from "axios";
import { useRef, useState } from "react";
import "./App.css";
import PropTypes from "prop-types";

const apiUrl = import.meta.env.VITE_DB_URL;

const Addtodo = ({ onAdd }) => {
  const [todo, setTodo] = useState("");
  const inputRef = useRef(null);

  const handleAdd = async () => {
    if (!apiUrl) {
      console.log("API URL is not defined");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/todo`, {
        todo: todo,
      });

      onAdd(response.data);
      setTodo("");
      inputRef.current.focus();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        autoFocus
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
