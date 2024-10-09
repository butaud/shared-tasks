import { FC, ReactNode } from "react";
import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import { Section, Task } from "../models";
import { TaskDisplay } from "./TaskDisplay";
import "./SectionDisplay.css";
import { EditableText } from "./EditableText";
import { DraggableList } from "./DragWrapper";

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

  const onDragEnd: OnDragEndResponder = ({ source, destination }) => {
    const sourceIndex = source.index;
    const destinationIndex = destination?.index;
    if (destinationIndex !== undefined && sourceIndex !== destinationIndex) {
      let updatedList = structuredClone(section.tasks);
      const [movedTask] = updatedList.splice(sourceIndex, 1);
      updatedList.splice(destinationIndex, 0, movedTask);
      updateSection({ ...section, tasks: updatedList });
    }
  };

  const list = (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId={`section-${section.id}`}>
        {(provided) => (
          <ul
            className="task-list"
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
