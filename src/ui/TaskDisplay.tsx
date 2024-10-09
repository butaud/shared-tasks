import { FC } from "react";
import { MdDragHandle } from "react-icons/md";
import { Draggable } from "react-beautiful-dnd";
import { Task } from "../models";
import "./TaskDisplay.css";
import { EditableText } from "./EditableText";

export type TaskDisplayProps = {
  task: Task;
  index: number;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (deletedTask: Task) => void;
};

export const TaskDisplay: FC<TaskDisplayProps> = ({
  task,
  index,
  updateTask,
  deleteTask,
}) => {
  const onContentChange = (newContent: string) => {
    updateTask({ ...task, content: newContent });
  };

  return (
    <Draggable draggableId={`task-${task.id}`} index={index}>
      {(provided) => (
        <li
          className="task"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <span className="drag-handle" {...provided.dragHandleProps}>
            <MdDragHandle />
          </span>
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
      )}
    </Draggable>
  );
};
