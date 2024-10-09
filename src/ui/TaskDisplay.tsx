import { FC } from "react";
import { Task } from "../models";
import "./TaskDisplay.css";
import { EditableText } from "./EditableText";

export type TaskDisplayProps = {
  task: Task;
  updateTask: (updatedTask: Task) => void;
};

export const TaskDisplay: FC<TaskDisplayProps> = ({ task, updateTask }) => {
  const onContentChange = (newContent: string) => {
    updateTask({ ...task, content: newContent });
  };

  return (
    <li className="task">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) =>
          updateTask({ ...task, completed: e.currentTarget.checked })
        }
      />
      <EditableText
        as="label"
        onTextChange={onContentChange}
        text={task.content}
        onClick={() => updateTask({ ...task, completed: !task.completed })}
      />
    </li>
  );
};
