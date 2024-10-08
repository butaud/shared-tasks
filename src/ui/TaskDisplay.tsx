import { FC } from "react";
import { Task } from "../models";
import "./TaskDisplay.css";

export type TaskDisplayProps = {
  task: Task;
  updateTask: (updatedTask: Task) => void;
};

export const TaskDisplay: FC<TaskDisplayProps> = ({ task, updateTask }) => {
  return (
    <li className="task">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) =>
          updateTask({ ...task, completed: e.currentTarget.checked })
        }
      />
      <label>{task.content}</label>
    </li>
  );
};
