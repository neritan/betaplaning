import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import NotFound from "./components/NotFound";
import Tasks from "./components/Tasks";
import Users from "./components/Users";
import NewTask from "./components/NewTask";

function App() {
  return (
    <>
      <div className="App">
        <Header />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" />
          <Route path="*" element={<NotFound />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/task/new" element={<NewTask />} />
          <Route path="users" element={<Users />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
