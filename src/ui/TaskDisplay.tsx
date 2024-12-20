import { FC, useState } from "react";
import { Task, ListOfTasks, TaskStatus, ListProfile } from "../models";
import "./TaskDisplay.css";
import { EditableText } from "./EditableText";
import { MdAdd } from "react-icons/md";
import { useAccount } from "..";
import { useJazzGroups } from "./hooks/useJazzGroups";
import { canEditValue } from "../util/jazz";
import { DraggableListProvided } from "./DraggableList";

export type TaskDisplayProps = DraggableListProvided & {
  task: Task | null;
  deleteTask: (deletedTask: Task) => void;
};

export const TaskDisplay: FC<TaskDisplayProps> = ({
  task,
  deleteTask,
  dragHandle,
  dragHandleParentClassName,
  dragWrapperClassName,
  draggableProvided,
}) => {
  const [completerTooltip, setCompleterTooltip] = useState<
    string | undefined
  >();

  if (!task || !task.status) {
    return null;
  }

  const onContentChange = (newContent: string) => {
    task.content = newContent;
  };

  const canEdit = canEditValue(task);

  const lastEdits = task.status?._edits.completed;
  const lastEditedBy = lastEdits?.by?.profile as ListProfile;
  const checkboxStyle = task.status?.completed
    ? { accentColor: lastEditedBy?.color ?? "hsl(133, 34%, 60%)" }
    : {};

  const hideCompleter = () => setCompleterTooltip(undefined);

  const isMobile =
    matchMedia("(pointer: coarse)").matches ||
    matchMedia("(hover: none)").matches;

  const onCheckboxContextMenu = (e: React.MouseEvent) => {
    if (task.status?.completed && lastEditedBy) {
      e.preventDefault();
      setCompleterTooltip(lastEditedBy.name);
    }
  };

  return (
    <li
      className={`task ${dragHandleParentClassName} ${dragWrapperClassName}`}
      ref={draggableProvided?.innerRef}
      {...draggableProvided?.draggableProps}
      onClick={hideCompleter}
      onBlur={hideCompleter}
    >
      {dragHandle}
      <input
        type="checkbox"
        checked={task.status?.completed}
        style={checkboxStyle}
        onChange={(e) => (task.status!.completed = e.target.checked)}
        title={lastEditedBy?.name}
        // We can rely on the title showing up on hover for desktop users,
        // but for mobile we need to show a fake tooltip on long press.
        onContextMenu={isMobile ? onCheckboxContextMenu : undefined}
      />
      {completerTooltip && (
        <div className="completer-tooltip">{completerTooltip}</div>
      )}
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
    const text = isDefault ? "Add default task" : "Add task to section";
    return (
      <button
        title={text}
        className={"add-task" + (isDefault ? " default" : "")}
        onClick={() => setIsAdding(true)}
      >
        <MdAdd />
        {isDefault && text}
      </button>
    );
  }
};
