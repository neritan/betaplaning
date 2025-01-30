import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { create, getAll } from "../service/BaseService";

const NewTask = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [owner, setOwner] = useState('')
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAll("http://localhost:3080/api/users").then((res) => {console.log(res); setUsers(res)})

      .catch((err) => console.log(err));
    })
   
    const newTaskHandle = e => {
        e.preventDefault();
        const task = {title: title, description: description, dueDate: dueDate, owner: owner};
        create('"http://localhost:3080/api/tasks"', task).then(res => console.log(res))
        .catch(err => console.log(err));
        //put the new tast into list of tasks
        //navigate back to tasks
        navigate("/tasks");

    }
        
    return(
        <form onSubmit={newTaskHandle}>
            <h3>return to <Link to="/tasks">tasks</Link></h3>
            <div>
                <label>Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}></input>
            </div>
            <div>
                <label>Description</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)}></input>
            </div>
            <div>
                <label>Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}></input>
            </div>
            <div>
                <label>Owner</label>
                <select value={owner} onChange={e => setOwner(e.target.value)}>
                    <option>select user</option>
                    {users.map((user, index) => {
                        <option key={index} value={user._id}>{user.name}</option>
                    })}
                </select>
            </div>
            <button>Submit</button>
        </form>
    );
}

export default NewTask;