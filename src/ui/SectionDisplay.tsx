import { FC, ReactNode } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import { Section, Task } from "../models";
import { TaskDisplay } from "./TaskDisplay";
import "./SectionDisplay.css";
import { EditableText } from "./EditableText";

export type SectionProps = {
  section: Section;
  asDefault?: boolean;
  updateSection: (newSection: Section) => void;
  deleteSection: (deletedSection: Section) => void;
};

export const SectionDisplay: FC<SectionProps> = ({
  section,
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

  const onTitleChange = (newTitle: string) => {
    updateSection({ ...section, title: newTitle });
  };

  const onDragEnd = () => {};

  const list = (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId={`section-${section.id}`}>
        {(provided) => (
          <ul
            className="task-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {section.tasks.map((task, index) => (
              <TaskDisplay
                key={task.id}
                task={task}
                index={index}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ))}
            {provided.placeholder}
          </ul>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
  if (asDefault) {
    return list;
  } else {
    return (
      <NonDefaultSectionWrapper
        title={section.title}
        onTitleChange={onTitleChange}
        onDelete={() => deleteSection(section)}
      >
        {list}
      </NonDefaultSectionWrapper>
    );
  }
};

type NonDefaultSectionWrapperProps = {
  children: ReactNode;
  title: string;
  onTitleChange: (newTitle: string) => void;
  onDelete: () => void;
};
const NonDefaultSectionWrapper: FC<NonDefaultSectionWrapperProps> = ({
  children,
  title,
  onTitleChange,
  onDelete,
}) => {
  return (
    <section>
      <EditableText
        as="h2"
        text={title}
        onTextChange={onTitleChange}
        className="section-title"
        onDelete={onDelete}
      />
      {children}
    </section>
  );
};
