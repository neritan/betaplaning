import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import NotFound from "./components/NotFound";
import Tasks from "./components/Tasks";
import Users from "./components/Users";
import NewTask from "./components/NewTask";
import UpdateTask from './components/UpdateTask'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Tasks />} />
          <Route path="*" element={<NotFound />} />
          <Route path="tasks" element={<Tasks/>}/>
          <Route path="tasks/task/new" element={<NewTask/>}/>
          <Route path="tasks/task/:taskId" element={<UpdateTask/>}/>
          <Route path="users" element={<Users/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
