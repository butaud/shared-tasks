import { FC, ReactNode, useState } from "react";
import { Section, Task, ListOfSections, ListOfTasks } from "../models";
import { TaskAdder, TaskDisplay } from "./TaskDisplay";
import "./SectionDisplay.css";
import { EditableText } from "./EditableText";
import { DraggableList } from "./DragWrapper";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
} from "@hello-pangea/dnd";
import { MdAdd, MdDragHandle } from "react-icons/md";

export type SectionProps = {
  section: Section | null;
  index: number;
  asDefault?: boolean;
  deleteSection: (sectionToDelete: Section) => void;
};

export const SectionDisplay: FC<SectionProps> = ({
  section,
  index,
  asDefault,
  deleteSection,
}) => {
  if (!section) {
    return null;
  }

  const onDelete = () => {
    deleteSection(section);
  };

  const canEdit =
    section._owner.myRole() === "writer" || section._owner.myRole() === "admin";

  const list = canEdit ? (
    <Droppable droppableId={`section-${section.id}`} type="task">
      {(provided, snapshot) => (
        <ul
          className={`task-list ${snapshot.isDraggingOver ? "drag-over" : ""}`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <TaskList tasks={section.tasks} />
          {provided.placeholder}
          {canEdit && (
            <TaskAdder taskList={section.tasks} isDefault={asDefault} />
          )}
        </ul>
      )}
    </Droppable>
  ) : (
    <TaskList tasks={section.tasks} />
  );
  if (asDefault) {
    return (
      <DefaultSectionWrapper section={section}>{list}</DefaultSectionWrapper>
    );
  } else {
    return (
      <NonDefaultSectionWrapper
        section={section}
        index={index}
        onDelete={onDelete}
      >
        {list}
      </NonDefaultSectionWrapper>
    );
  }
};

const TaskList: FC<{ tasks: ListOfTasks | null }> = ({ tasks }) => {
  if (!tasks) {
    return null;
  }

  const canEdit =
    tasks._owner.myRole() === "writer" || tasks._owner.myRole() === "admin";

  const deleteTask = (taskToDelete: Task) => {
    const index = tasks.findIndex((task) => task?.id === taskToDelete.id);
    if (index >= 0) {
      tasks.splice(index, 1);
    }
  };

  return (
    <DraggableList
      canEdit={canEdit}
      idPrefix="task"
      listItems={tasks
        .filter((task) => task !== null)
        .map((task) => (
          <TaskDisplay key={task.id} task={task} deleteTask={deleteTask} />
        ))}
    />
  );
};

type DefaultSectionWrapperProps = {
  children: ReactNode;
  section: Section;
};
const DefaultSectionWrapper: FC<DefaultSectionWrapperProps> = ({
  children,
  section,
}) => {
  const titleClassNames = ["section-title", "default"];
  if (section.tasks?.every((task) => task?.status?.completed)) {
    titleClassNames.push("all-done");
  }
  return (
    <section>
      <h2 className={titleClassNames.join(" ")}>Default</h2>
      {children}
    </section>
  );
};

type NonDefaultSectionWrapperProps = {
  children: ReactNode;
  section: Section;
  index: number;
  onDelete: () => void;
};
const NonDefaultSectionWrapper: FC<NonDefaultSectionWrapperProps> = ({
  children,
  section,
  index,
  onDelete,
}) => {
  const titleClassNames = ["section-title"];
  if (section.tasks?.every((task) => task?.status?.completed)) {
    titleClassNames.push("all-done");
  }

  const onTitleChange = (newTitle: string) => {
    section.title = newTitle;
  };

  const canEdit =
    section._owner.myRole() === "writer" || section._owner.myRole() === "admin";
  if (canEdit) {
    return (
      <Draggable draggableId={`section-${section.id}`} index={index}>
        {(provided, snapshot) => (
          <MaybeDraggableSection
            provided={provided}
            snapshot={snapshot}
            section={section}
            onTitleChange={onTitleChange}
            onDelete={onDelete}
            canEdit={canEdit}
            titleClassNames={titleClassNames}
          >
            {children}
          </MaybeDraggableSection>
        )}
      </Draggable>
    );
  } else {
    return (
      <MaybeDraggableSection
        section={section}
        onTitleChange={onTitleChange}
        onDelete={onDelete}
        canEdit={canEdit}
        titleClassNames={titleClassNames}
      >
        {children}
      </MaybeDraggableSection>
    );
  }
};

type MaybeDraggableSectionProps = {
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
  section: Section;
  onTitleChange: (newTitle: string) => void;
  onDelete: () => void;
  canEdit: boolean;
  titleClassNames: string[];
  children: ReactNode;
};

const MaybeDraggableSection: FC<MaybeDraggableSectionProps> = ({
  provided,
  snapshot,
  section,
  onTitleChange,
  onDelete,
  canEdit,
  titleClassNames,
  children,
}) => {
  return (
    <section {...provided?.draggableProps} ref={provided?.innerRef}>
      <div
        className={"drag-wrapper" + (snapshot?.isDragging ? " dragging" : "")}
      >
        {canEdit && (
          <span className="drag-handle" {...provided?.dragHandleProps}>
            <MdDragHandle size={20} />
          </span>
        )}
        <EditableText
          as="h2"
          text={section.title}
          onTextChange={onTitleChange}
          className={titleClassNames.join(" ")}
          onDelete={onDelete}
          canEdit={canEdit}
        />
      </div>
      {children}
    </section>
  );
};

export type SectionAdderProps = {
  sectionList: ListOfSections | null;
};

export const SectionAdder: FC<SectionAdderProps> = ({ sectionList }) => {
  const [isAdding, setIsAdding] = useState(false);

  if (!sectionList) {
    return null;
  }

  const createSection = (title: string) => {
    const newSection = Section.create(
      {
        tasks: ListOfTasks.create([], { owner: sectionList._owner }),
        title,
      },
      { owner: sectionList._owner }
    );
    sectionList.push(newSection);
    setIsAdding(false);
  };

  const filling = isAdding ? (
    <EditableText
      editingByDefault
      as="h2"
      text={""}
      onTextChange={createSection}
      canEdit={true}
    />
  ) : (
    <button onClick={() => setIsAdding(true)} className="add-section">
      <MdAdd size={20} /> Add section
    </button>
  );
  return <section>{filling}</section>;
};
