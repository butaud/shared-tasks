import { FC, FocusEvent, FormEvent, useEffect, useState } from "react";
import { Task } from "../models";
import "./TaskDisplay.css";

export type TaskDisplayProps = {
  task: Task;
  updateTask: (updatedTask: Task) => void;
};

export const TaskDisplay: FC<TaskDisplayProps> = ({ task, updateTask }) => {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelDraft, setLabelDraft] = useState(task.content);

  const onEditLabel = () => {
    setLabelDraft(task.content);
    setIsEditingLabel(true);
  };
  const onSubmitContent = (
    e: FormEvent<HTMLFormElement> | FocusEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    updateTask({ ...task, content: labelDraft });
    setIsEditingLabel(false);
  };
  const onCancelContent = () => setIsEditingLabel(false);

  return (
    <li className="task">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) =>
          updateTask({ ...task, completed: e.currentTarget.checked })
        }
      />
      {isEditingLabel ? (
        <form onSubmit={onSubmitContent}>
          <input
            autoFocus
            type="text"
            value={labelDraft}
            onChange={(e) => setLabelDraft(e.currentTarget.value)}
            onBlur={onSubmitContent}
            onKeyDown={(e) => e.key === "Escape" && onCancelContent()}
          />
        </form>
      ) : (
        <label onDoubleClick={onEditLabel}>{task.content}</label>
      )}
    </li>
  );
};
