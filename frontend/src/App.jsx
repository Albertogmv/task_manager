import { useEffect, useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  // Función para obtener tareas del backend
  async function fetchTasks() {
    const res = await fetch("http://localhost:8000/tasks");
    const data = await res.json();
    setTasks(data);
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // Función para añadir tarea
  async function addTask() {
    if (!newTitle.trim()) return;
    console.log("Creando tarea:", newTitle);

    await fetch("http://localhost:8000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    setNewTitle("");
    fetchTasks();
  }

  // Función para alternar completado
  async function toggleCompleted(id, completed) {
    await fetch(`http://localhost:8000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTasks();
  }

  // Función para borrar tarea
  async function deleteTask(id) {
    await fetch(`http://localhost:8000/tasks/${id}`, {
      method: "DELETE",
    });
    fetchTasks();
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Lista de Tareas</h1>

      <div className="flex mb-4">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Nueva tarea"
          className="flex-grow border rounded px-3 py-2"
        />
        <button
          onClick={addTask}
          className="ml-2 bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Añadir
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between py-2 border-b"
          >
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompleted(task.id, task.completed)}
              />
              <span className={task.completed ? "line-through text-gray-500" : ""}>
                {task.title}
              </span>
            </label>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-600 hover:text-red-800 font-bold"
              aria-label="Borrar tarea"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
