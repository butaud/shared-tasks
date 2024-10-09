import { FC, useState } from "react";
import { Task } from "../models";
import "./TaskDisplay.css";
import { EditableText } from "./EditableText";
import { MdAdd } from "react-icons/md";

export type TaskDisplayProps = {
  task: Task;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (deletedTask: Task) => void;
};

export const TaskDisplay: FC<TaskDisplayProps> = ({
  task,
  updateTask,
  deleteTask,
}) => {
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
        onDelete={() => deleteTask(task)}
      />
    </li>
  );
};

export type TaskAdderProps = {
  addTask: (newTask: Task) => void;
};
export const TaskAdder: FC<TaskAdderProps> = ({ addTask }) => {
  const [isAdding, setIsAdding] = useState(false);

  const createTask = (content: string) => {
    const newTask: Task = {
      id: Date.now(),
      content,
      completed: false,
    };
    addTask(newTask);
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <li className="task">
        <input type="checkbox" disabled={true} />
        <EditableText
          editingByDefault
          as="label"
          onTextChange={createTask}
          text={""}
        />
      </li>
    );
  } else {
    return (
      <button className="add-task" onClick={() => setIsAdding(true)}>
        <MdAdd size={20} />
      </button>
    );
  }
};
