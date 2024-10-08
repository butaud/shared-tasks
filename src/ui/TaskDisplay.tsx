import { FC } from "react";
import { Task } from "../models"

export type TaskDisplayProps = {
    task: Task;
    updateTask: (updatedTask: Task) => void;
}

export const TaskDisplay: FC<TaskDisplayProps> = ({task, updateTask}) => {
    return (<li>
        <input type="checkbox" checked={task.completed} onChange={e => updateTask({...task, completed: e.currentTarget.checked})} />
        <label>{task.content}</label>
    </li>);
}