import { useState, useEffect } from "react";
import { getAll, deleteById } from "../service/BaseService";
import { Link } from "react-router-dom";
import "../styles/Tasks.css";

const Tasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    loadTasks();
    getAllUsers();
  }, []);

  const loadTasks = () => {
    getAll("http://localhost:3080/api/tasks")
      .then((res) => {
        setAllTasks(res);
      })
      .catch((err) => console.log(err));
  };

  const getAllUsers = () => {
    getAll("http://localhost:3080/api/users")
      .then((res) => {
        setAllUsers(res);
      })
      .catch((err) => console.log(err));
  };


  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteById(`http://localhost:3080/api/tasks/${taskToDelete}`);
      setShowModal(false);
      setTaskToDelete(null);
      loadTasks(); // Reload tasks after successful deletion
    } catch (err) {
      console.error("Error deleting task:", err.response?.data || err.message);
      // Optionally add user feedback here
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setTaskToDelete(null);
  };

  return (
    <div className="tasks-container">
      <h2 className="tasks-title">Tasks Management</h2>
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Owner</th>
            <th>Completed</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allTasks.length > 0 ? allTasks.map((task) => {
            return (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>{allUsers.find(user => user._id === task.owner)?.name}</td>
                <td>
                  <span className={`status ${task.completed ? 'completed' : 'pending'}`}>
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </td>
                <td className="action-buttons">
                  <Link to={`/tasks/task/${task._id}`} className="btn btn-update">Update</Link>
                  <button 
                    className="btn btn-delete"
                    onClick={() => handleDeleteClick(task._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          }) : <tr><td colSpan="6" style={{textAlign: 'center'}}>No tasks found</td></tr>}
        </tbody>
      </table>
      <p className="add-task-link">
        Need to add a new task?
      </p> 
      <Link to={"/tasks/task/new"} className="new-task-button">Create Task</Link>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 className="modal-title">Confirm Delete</h3>
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-buttons">
              <button 
                className="modal-button cancel"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button 
                className="modal-button confirm"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
