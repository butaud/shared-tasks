import { FC, useState } from "react";
import { Task, ListOfTasks, TaskStatus } from "../models";
import "./TaskDisplay.css";
import { EditableText } from "./EditableText";
import { MdAdd } from "react-icons/md";
import { useAccount } from "..";
import { useJazzGroups } from "./useJazzGroups";
import { canEditValue } from "../util/jazz";

export type TaskDisplayProps = {
  task: Task | null;
  deleteTask: (deletedTask: Task) => void;
};

export const TaskDisplay: FC<TaskDisplayProps> = ({ task, deleteTask }) => {
  if (!task || !task.status) {
    return null;
  }

  const onContentChange = (newContent: string) => {
    task.content = newContent;
  };

  const canEdit = canEditValue(task);

  return (
    <li className="task">
      <input
        type="checkbox"
        checked={task.status?.completed}
        onChange={(e) => (task.status!.completed = e.target.checked)}
      />
      <EditableText
        as="label"
        className={task.status?.completed ? "done" : ""}
        onTextChange={onContentChange}
        text={task.content}
        onClick={() => (task.status!.completed = !task.status?.completed)}
        onDelete={() => deleteTask(task)}
        canEdit={canEdit}
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
  const { me } = useAccount();
  const { statusGroup } = useJazzGroups(me);

  if (taskList === null || !statusGroup) {
    return null;
  }

  const createTask = (content: string) => {
    const newStatus = TaskStatus.create(
      { completed: false },
      { owner: statusGroup }
    );
    const newTask = Task.create(
      {
        content,
        status: newStatus,
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
          onCancel={() => setIsAdding(false)}
          text={""}
          canEdit={true}
        />
      </li>
    );
  } else {
    return (
      <button className="add-task" onClick={() => setIsAdding(true)}>
        <MdAdd />
        {isDefault ? "Add default task" : "Add task to section"}
      </button>
    );
  }
};
