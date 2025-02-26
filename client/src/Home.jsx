import { useEffect, useState } from "react";
import axios from "axios";
import Addtodo from "./Addtodo";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import "./App.css";

const apiUrl = import.meta.env.VITE_DB_URL;

export const Home = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/list`)
      .then((result) => setList(result.data))
      .catch((err) => console.log(err));
  }, []);

  const handleCheck = async (id) => {
    try {
      const response = await axios.patch(`${apiUrl}/update/${id}`);

      setList((prevList) =>
        prevList.map((todo) =>
          todo._id === response.data._id ? response.data : todo
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/delete/${id}`);
      setList((prevList) => prevList.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = (newTodo) => {
    setList((prevList) => [...prevList, newTodo]);
  };

  return (
    <div className="container">
      <h2>TODO LIST</h2>
      <Addtodo onAdd={handleAdd} />

      {list.length === 0 ? (
        <h3>No Todos</h3>
      ) : (
        list &&
        list.map(({ todo, _id, done }) => (
          <div key={_id} className="task">
            {done ? (
              <MdCheckBox className="icon" onClick={() => handleCheck(_id)} />
            ) : (
              <MdCheckBoxOutlineBlank
                className="icon"
                onClick={() => handleCheck(_id)}
              />
            )}
            <p className={done ? "line" : ""}>{todo}</p>
            <FaRegTrashAlt className="icon" onClick={() => handleDelete(_id)} />
          </div>
        ))
      )}
    </div>
  );
};
