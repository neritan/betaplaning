import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getById, update, getAll } from "../service/BaseService";
import "../styles/NewTask.css";

const UpdateTask = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [task, setTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        owner: '',
        completed: false
    });

    useEffect(() => {
        console.log("TaskId:", taskId);
        // Fetch users
        getAll("http://localhost:3080/api/users")
            .then((res) => setUsers(res))
            .catch((err) => console.log(err));

        // Fetch task
        getById(`http://localhost:3080/api/tasks/${taskId}`)
            .then((res) => {
                console.log("Task data from server:", res);
                setTask({
                    title: res.title || '',
                    description: res.description || '',
                    dueDate: res.dueDate ? new Date(res.dueDate).toISOString().split('T')[0] : '',
                    owner: res.owner?._id || res.owner || '',  // Handle both populated and unpopulated owner
                    completed: Boolean(res.completed)  // Ensure boolean value
                });
            })
            .catch((err) => console.log("Error fetching task:", err));
    }, [taskId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTask({
            ...task,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        update(`http://localhost:3080/api/tasks/${taskId}`, task)
            .then(() => {
                navigate("/tasks");
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="new-task-container">
            <div className="new-task-header">
                <h3>Update Task</h3>
                <Link to="/tasks" className="back-to-tasks">Back to Tasks</Link>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        rows="3"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={task.dueDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Owner</label>
                    <select 
                        name="owner"
                        value={task.owner}
                        onChange={handleChange}
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
                        name="completed"
                        value={task.completed}
                        onChange={e => setTask({...task, completed: e.target.value === 'true'})}
                        required
                    >
                        <option value="false">Pending</option>
                        <option value="true">Completed</option>
                    </select>
                </div>
                <button type="submit" className="submit-button">
                    Update Task
                </button>
            </form>
        </div>
    );
};

export default UpdateTask;