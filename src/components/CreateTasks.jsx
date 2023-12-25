import { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';

const CreateTasks = ({tasks,setTasks}) => {
    const [task,setTask] = useState({
        id:"",
        name:"",
        state:"todo"
    })
    

    const handleSubmit = (e)=>{
        e.preventDefault()
        if(task.name.length < 3) return toast.error('The task should have more than 3 characters.')
        if(task.name.length > 50) return toast.error("The task shouldn't have more than 50 characters.")
        setTasks((prev)=>{
            
            const list = [...(prev ?? []),task]
            localStorage.setItem('tasks',JSON.stringify(list))
            return list
        })
        toast.success('Task Created')
        setTask({
            id:"",
            name:"",
            state:"todo"
        })

    }
    return ( 
        <form onSubmit={handleSubmit}>
            <input type="text" className="bg-slate-100 border-slate-400 border-2 rounded-md mr-4 h-12 w-64 px-1"
            value={task.name}
            onChange={(e)=>
                setTask({...task,id:uuidv4(),name:e.target.value})
            }
            />
            <button className="bg-cyan-500 rounded-md px-4 h-12 text-white"> Create </button>
        </form>
     );
}
 
export default CreateTasks;