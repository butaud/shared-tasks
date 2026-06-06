import { FC, useEffect, useRef } from "react";
import { List, Section } from "../models";
import { EditableText } from "./EditableText";
import { FlyoutMenu } from "./FlyoutMenu";
import { canEditValue } from "../util/jazz";
import "./HeaderComponent.css";
import { ProfileComponent } from "./ProfileComponent";
import confetti from "canvas-confetti";
import { MdEdit, MdVisibility } from "react-icons/md";

export type HeaderComponentProps = {
  list: List | undefined;
  setList: (list: List) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
};

export const HeaderComponent: FC<HeaderComponentProps> = ({
  list,
  setList,
  editMode,
  setEditMode,
}) => {
  const canEdit = !!list && canEditValue(list);

  return (
    <header>
      <FlyoutMenu list={list} setList={setList} />
      {list ? (
        <Title list={list} editMode={editMode} />
      ) : (
        <h1 className="list-title">Shared list editor</h1>
      )}
      <div className="header-actions">
        {canEdit && (
          <button
            className={"edit-mode-toggle" + (editMode ? " active" : "")}
            onClick={() => setEditMode(!editMode)}
            title={editMode ? "Switch to view mode" : "Switch to edit mode"}
            aria-pressed={editMode}
          >
            {editMode ? <MdVisibility /> : <MdEdit />}
            <span>{editMode ? "View" : "Edit"}</span>
          </button>
        )}
        <ProfileComponent />
      </div>
    </header>
  );
};

type TitleProps = {
  list: List;
  editMode: boolean;
};

const getTaskStatusCounts = (list: List) => {
  if (!list || !list.sections || !list.defaultSection) {
    return undefined;
  }

  const sectionFullyLoaded = (section: Section | null) => {
    if (!section || !section.tasks) {
      return false;
    }
    return section.tasks.every((task) => task?.status);
  };

  if (
    !sectionFullyLoaded(list.defaultSection) ||
    !list.sections.every(sectionFullyLoaded)
  ) {
    return undefined;
  }

  const defaultTaskCount = list.defaultSection.tasks!.length;
  const sectionedTasksCount = list.sections.reduce(
    (acc, section) => acc + section!.tasks!.length,
    0
  );
  const completedDefaultTasks = list.defaultSection.tasks!.filter(
    (task) => task!.status!.completed
  ).length;
  const completedSectionedTasks = list.sections.reduce(
    (acc, section) =>
      acc + section!.tasks!.filter((task) => task!.status!.completed).length,
    0
  );
  return {
    all: defaultTaskCount + sectionedTasksCount,
    completed: completedDefaultTasks + completedSectionedTasks,
  };
};

export const Title: FC<TitleProps> = ({ list, editMode }) => {
  const updateListTitle = (newTitle: string) => {
    list.title = newTitle;
  };

  const previouslyCompleted = useRef<boolean | undefined>(undefined);

  const taskCounts = getTaskStatusCounts(list);
  const allCompleted =
    taskCounts && taskCounts.all > 0 && taskCounts.all === taskCounts.completed;

  useEffect(() => {
    if (previouslyCompleted.current === undefined) {
      previouslyCompleted.current = allCompleted;
    } else if (allCompleted !== previouslyCompleted.current) {
      if (allCompleted) {
        confetti({
          angle: 270,
          origin: {
            x: 0.5,
            y: -0.1,
          },
        });
      }
      previouslyCompleted.current = allCompleted;
    }
  }, [allCompleted]);

  const canEdit = canEditValue(list);
  return (
    <div className="title-wrapper">
      <EditableText
        as="h1"
        className="list-title"
        text={list.title}
        onTextChange={updateListTitle}
        canEdit={canEdit && editMode}
      />
      {taskCounts && (
        <p className={"task-count" + (allCompleted ? " done" : "")}>
          ({taskCounts.completed} / {taskCounts.all})
        </p>
      )}
    </div>
  );
};
