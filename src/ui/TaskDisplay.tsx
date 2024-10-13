import { FC, useState } from "react";
import { JTask, ListOfTasks } from "../models";
import "./TaskDisplay.css";
import { EditableText } from "./EditableText";
import { MdAdd } from "react-icons/md";

export type TaskDisplayProps = {
  task: JTask | null;
  deleteTask: (deletedTask: JTask) => void;
};

export const TaskDisplay: FC<TaskDisplayProps> = ({ task, deleteTask }) => {
  if (!task) {
    return null;
  }

  const onContentChange = (newContent: string) => {
    task.content = newContent;
  };

  return (
    <li className="task">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => (task.completed = e.target.checked)}
      />
      <EditableText
        as="label"
        className={task.completed ? "done" : ""}
        onTextChange={onContentChange}
        text={task.content}
        onClick={() => (task.completed = !task.completed)}
        onDelete={() => deleteTask(task)}
      />
    </li>
  );
};

export type TaskAdderProps = {
  taskList: ListOfTasks | null;
  isDefault?: boolean;
};
export const TaskAdder: FC<TaskAdderProps> = ({ taskList, isDefault }) => {
  const [isAdding, setIsAdding] = useState(false);

  if (taskList === null) {
    return null;
  }

  const createTask = (content: string) => {
    const newTask = JTask.create(
      {
        content,
        completed: false,
      },
      { owner: taskList._owner }
    );
    taskList.push(newTask);
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
        {isDefault ? "Add default task" : "Add task to section"}
      </button>
    );
  }
};
