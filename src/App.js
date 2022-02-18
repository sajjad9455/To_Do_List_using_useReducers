
import { useReducer, useState } from "react";

function useReduceMy(reducerFn, initValue) {
  const [state, setState] = useState(initValue);

  return [
    state,
    function dispatch(action) {
      const newState = reducerFn(state, action);
      setState(newState);
    }
  ];
}

function taskReducer(currState, action) {
  switch (action.type) {
    case "MARK_ALL_DONE":
      return currState.map((task) => {
        task.done = true;
        return task;
      });
    case "ADD_ONE_ITEM":
      return [...currState, { content: action.input, done: false }];

    case "DELETE_ONE_ITEM":
      const newArr = currState.filter((task) => task.content !== action.input);
      return newArr;

    case "MARK_AS_DONE":
      return currState.map((task) => {
        if (task.content === action.input) {
          task.done = !task.done;
          return task;
        }
        return task;
      });

    default:
      return currState;
  }
}

function ToDoItem(props) {
  const { children, done, onClick, onDelete } = props;

  return (
    <li style={{ color: done ? "green" : "red" }}>
      {" "}
      {children}
      <button
        onClick={() => {
          onClick(children);
        }}
      >
        done
      </button>
      <button
        onClick={() => {
          onDelete(children);
        }}
      >
        Delete
      </button>
    </li>
  );
}

function ToDoInput(props) {
  const { addOneItem } = props;
  const [input, setInput] = useState();

  return [
    <input
      type="text"
      value={input}
      onChange={(event) => {
        setInput(event.target.value);
      }}
    />,
    <button
      onClick={() => {
        if (input !== "") {
          // dispatch({ type: 'ADD_ONE_ITEM', input })
          addOneItem(input);
          setInput("");
        }
      }}
    >
      Add
    </button>
  ];
}

function ToDoList() {
  // const [tasks, setTasks] = useState([]);

  const [tasks, dispatch] = useReduceMy(taskReducer, []);

  function addOneItem(str) {
    // setTasks([...tasks, { content: str, done: false }]);
    dispatch({ type: "ADD_ONE_ITEM", input: str });
  }

  function deleteOneItem(str) {
    // const newArr = tasks.filter((task) => task.content !== str);
    // setTasks(newArr);
    dispatch({ type: "DELETE_ONE_ITEM", input: str });
  }

  function setItemToTrue(str) {
    // let newArr = tasks.map((task) => {
    //   if (task.content === str) {
    //     task.done = !task.done;
    //     return task;
    //   }
    //   return task;
    // });
    // setTasks(newArr);
    dispatch({ type: "MARK_AS_DONE", input: str });
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <ToDoInput addOneItem={addOneItem} />
      <ul>
        {tasks.map((task) => {
          return (
            <ToDoItem
              onDelete={deleteOneItem}
              onClick={setItemToTrue}
              done={task.done}
            >
              {task.content}
            </ToDoItem>
          );
        })}
      </ul>
      <button
        onClick={() => {
          dispatch({ type: "MARK_ALL_DONE" });
        }}
      >
        Mark all are done
      </button>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <ToDoList />
    </div>
  );
}
