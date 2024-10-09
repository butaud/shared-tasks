import { FC, ReactNode, useState } from "react";
import { Section, Task } from "../models";
import { TaskAdder, TaskDisplay } from "./TaskDisplay";
import "./SectionDisplay.css";
import { EditableText } from "./EditableText";
import { DraggableList } from "./DragWrapper";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { MdAdd, MdDragHandle } from "react-icons/md";

export type SectionProps = {
  section: Section;
  index: number;
  asDefault?: boolean;
  updateSection: (newSection: Section) => void;
  deleteSection: (deletedSection: Section) => void;
};

export const SectionDisplay: FC<SectionProps> = ({
  section,
  index,
  asDefault,
  updateSection,
  deleteSection,
}) => {
  const updateTask = (updatedTask: Task) => {
    const updatedList = structuredClone(section.tasks);
    updatedList[
      updatedList.findIndex((task: Task) => task.id === updatedTask.id)
    ] = updatedTask;
    updateSection({
      ...section,
      tasks: updatedList,
    });
  };

  const deleteTask = (deletedTask: Task) => {
    const updatedList = structuredClone(section.tasks);
    updatedList.splice(
      updatedList.findIndex((task: Task) => task.id === deletedTask.id),
      1
    );
    updateSection({
      ...section,
      tasks: updatedList,
    });
  };

  const addTask = (newTask: Task) => {
    const updatedList = structuredClone(section.tasks);
    updatedList.push(newTask);
    updateSection({
      ...section,
      tasks: updatedList,
    });
  };

  const onTitleChange = (newTitle: string) => {
    updateSection({ ...section, title: newTitle });
  };
  const list = (
    <Droppable droppableId={`section-${section.id}`} type="task">
      {(provided, snapshot) => (
        <ul
          className={`task-list ${snapshot.isDraggingOver ? "drag-over" : ""}`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <DraggableList
            idPrefix="task"
            listItems={section.tasks.map((task) => (
              <TaskDisplay
                key={task.id}
                task={task}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ))}
          />
          {provided.placeholder}
          <TaskAdder addTask={addTask} isDefault={asDefault} />
        </ul>
      )}
    </Droppable>
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
        onTitleChange={onTitleChange}
        onDelete={() => deleteSection(section)}
      >
        {list}
      </NonDefaultSectionWrapper>
    );
  }
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
  if (section.tasks.every((task) => task.completed)) {
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
  onTitleChange: (newTitle: string) => void;
  onDelete: () => void;
};
const NonDefaultSectionWrapper: FC<NonDefaultSectionWrapperProps> = ({
  children,
  section,
  index,
  onTitleChange,
  onDelete,
}) => {
  const titleClassNames = ["section-title"];
  if (section.tasks.every((task) => task.completed)) {
    titleClassNames.push("all-done");
  }
  return (
    <Draggable draggableId={`section-${section.id}`} index={index}>
      {(provided, snapshot) => (
        <section {...provided.draggableProps} ref={provided.innerRef}>
          <div
            className={
              "drag-wrapper" + (snapshot.isDragging ? " dragging" : "")
            }
          >
            <span className="drag-handle" {...provided.dragHandleProps}>
              <MdDragHandle size={20} />
            </span>
            <EditableText
              as="h2"
              text={section.title}
              onTextChange={onTitleChange}
              className={titleClassNames.join(" ")}
              onDelete={onDelete}
            />
          </div>
          {children}
        </section>
      )}
    </Draggable>
  );
};

export type SectionAdderProps = {
  addSection: (newSection: Section) => void;
};

export const SectionAdder: FC<SectionAdderProps> = ({ addSection }) => {
  const [isAdding, setIsAdding] = useState(false);
  const createSection = (title: string) => {
    const newSection: Section = {
      id: Date.now(),
      tasks: [],
      title,
    };
    addSection(newSection);
    setIsAdding(false);
  };

  const filling = isAdding ? (
    <EditableText
      editingByDefault
      as="h2"
      text={""}
      onTextChange={createSection}
    />
  ) : (
    <button onClick={() => setIsAdding(true)} className="add-section">
      <MdAdd size={20} /> Add section
    </button>
  );
  return <section>{filling}</section>;
};
