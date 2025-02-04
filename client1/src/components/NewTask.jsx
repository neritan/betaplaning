import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { create, getAll } from "../service/BaseService";
import "../styles/NewTask.css";

const NewTask = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [owner, setOwner] = useState('');
    const [status, setStatus] = useState('pending');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAll("http://localhost:3080/api/users")
            .then((res) => setUsers(res))
            .catch((err) => console.log(err));
    }, []);

    const newTaskHandle = e => {
        e.preventDefault();
        const task = {
            title,
            description,
            dueDate,
            owner,
            completed: status === 'completed'
        };
        create('http://localhost:3080/api/tasks', task)
            .then(res => {
                console.log(res);
                navigate("/tasks");
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="new-task-container">
            <div className="new-task-header">
                <h3>Create New Task</h3>
                <Link to="/tasks" className="back-to-tasks">Back to Tasks</Link>
            </div>
            <form onSubmit={newTaskHandle}>
                <div className="form-group">
                    <label>Title</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea 
                        value={description} 
                        onChange={e => setDescription(e.target.value)}
                        rows="3"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Due Date</label>
                    <input 
                        type="date" 
                        value={dueDate} 
                        onChange={e => setDueDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Owner</label>
                    <select 
                        value={owner} 
                        onChange={e => setOwner(e.target.value)}
                        required
                    >
                        <option value="">Select user</option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Status</label>
                    <select 
                        value={status} 
                        onChange={e => setStatus(e.target.value)}
                        required
                    >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <button type="submit" className="submit-button">
                    Create Task
                </button>
            </form>
        </div>
    );
}

export default NewTask;