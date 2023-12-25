import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import toast from "react-hot-toast";

const ListTasks = ({ tasks, setTasks }) => {
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [closed, setClosed] = useState([]);

  useEffect(() => {
    if(tasks){
        
    const fTodos = tasks.filter((tasks) => tasks.state === "todo");
    const fInProgress = tasks.filter((tasks) => tasks.state === "inprogress");
    const fClosed = tasks.filter((tasks) => tasks.state === "closed");
    setTodos(fTodos);
    setInProgress(fInProgress);
    setClosed(fClosed);
    }
  }, [tasks]);

  const statuses = ["todo", "inprogress", "closed"];

  return (
    <div className="flex gap-16">
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todos={todos}
          inProgress={inProgress}
          closed={closed}
        />
      ))}
    </div>
  );
};

export default ListTasks;

const Section = ({ status, tasks, setTasks, todos, inProgress, closed }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "task",
        drop:(item)=>addItemToSection(item.id),
        collect: (monitor) => ({
          isOver: !!monitor.isOver()
        })
      }))

  let text = "Todo";
  let bg = "bg-slate-500";
  let tasksToMap = todos;
  if (status === "inprogress") {
    text = "In progress";
    bg = "bg-green-400";
    tasksToMap = inProgress;
  }
  if (status === "closed") {
    text = "closed";
    bg = "bg-purple-400";
    tasksToMap = closed;
  }

  const addItemToSection = (id)=>{
    setTasks((prev)=>{
        const mTasks = prev.map((t)=>{
            if(t.id === id){
                return { ...t, state: status}
            }
            return t;
        })
        localStorage.setItem("tasks",JSON.stringify(mTasks));
        toast('Task Status updated')
        return mTasks
    })
  }

  return (
    <div ref={drop} className={`w-64 ${isOver ? "bg-slate-200" : ""}`}>
      <Header text={text} bg={bg} count={tasksToMap.length} />
      {
        tasksToMap.length > 0 &&
        tasksToMap.map((task)=>(
            <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks}/>
        ))
      }
    </div>
  );
};

const Header = ({ text, bg, count }) => {
  return (
    <div
      className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-sm text-white}`}
    >
      {text}
      <div className="ml-2 bg-white w-5 h-5 text-black rounded-full flex items-center justify-center">
        {count}
      </div>
    </div>
  );
};

const Task = ({ task, tasks, setTasks }) => {
    const handleRemove = (id)=>{
        const fTasks = tasks.filter((t)=>t.id !== id)
        localStorage.setItem("tasks",JSON.stringify(fTasks));
        setTasks(fTasks)
        toast.success('Task removed')
    }
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "task",
        item: { id:task.id },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging()
        })
      }))
  return (
    <div ref={drag} className="relative p-4 mt-8 shadow-md rounded-md cursor-grab">
      <p>{task.name}</p>
      <button className="absolute bottom-1 right-1 text-slate-400"
      onClick={()=>handleRemove(task.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>
  );
};
