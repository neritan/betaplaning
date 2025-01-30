import { useState, useEffect } from "react";
import { getAll } from "../service/BaseService";
import { Link } from "react-router-dom";
const Tasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  useEffect(() => {
    getAll("http://localhost:3080/api/tasks").then((res) => {console.log(res); setAllTasks(res)})

      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <h2>Tasks Component</h2>
      <table>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Due Date</th>
          <th>Owner</th>
          <th>Completed</th>
          <th>Action</th>
        </tr>
        {allTasks.map((task) => {
          return (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.dueDate}</td>
              <td>{task.owner}</td>
              <td>{task.completed? "TRUE" : "FALSE"}</td>
              <td>Update</td>
            </tr>
          );
        })}
      </table>
      <p>Do you want to add new task? <Link to={"task/new"}>click here </Link></p> 
    </div>
  );
};

export default Tasks;
