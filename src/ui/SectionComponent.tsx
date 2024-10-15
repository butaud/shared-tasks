import { FC, ReactNode, useState } from "react";
import { Section, Task, ListOfSections, ListOfTasks } from "../models";
import { TaskAdder, TaskDisplay } from "./TaskDisplay";
import "./SectionComponent.css";
import { EditableText } from "./EditableText";
import { DraggableList } from "./DraggableList";
import { MdAdd } from "react-icons/md";
import { canEditValue } from "../util/jazz";
import { DraggableListProvided } from "./DraggableList";

export type SectionComponentProps = DraggableListProvided & {
  section: Section;
  containingList?: ListOfSections | null;
};

export const SectionComponent: FC<SectionComponentProps> = ({
  section,
  containingList,
  dragHandle,
  dragHandleParentClassName,
  dragWrapperClassName,
  draggableProvided,
}) => {
  if (!section || !section.tasks) {
    return null;
  }

  const onDelete = () => {
    if (containingList) {
      const index = containingList.findIndex((s) => s?.id === section.id);
      if (index >= 0) {
        containingList.splice(index, 1);
      }
    }
  };

  const deleteTask = (taskToDelete: Task) => {
    const index =
      section.tasks?.findIndex((task) => task?.id === taskToDelete.id) ?? -1;
    if (index >= 0) {
      section.tasks?.splice(index, 1);
    }
  };

  const list = (
    <DraggableList
      listItems={section.tasks}
      type={"task"}
      droppableId={`section-${section.id}`}
    >
      {({ listItem: task, provided }) => (
        <TaskDisplay
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          {...provided}
        />
      )}
    </DraggableList>
  );
  if (!containingList) {
    return (
      <DefaultSectionWrapper section={section}>
        {list}
        <TaskAdder taskList={section.tasks} isDefault />
      </DefaultSectionWrapper>
    );
  } else {
    return (
      <NonDefaultSectionWrapper
        section={section}
        onDelete={onDelete}
        dragHandle={dragHandle}
        dragHandleParentClassName={dragHandleParentClassName}
        dragWrapperClassName={dragWrapperClassName}
        draggableProvided={draggableProvided}
      >
        {list}
        <TaskAdder taskList={section.tasks} />
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
  if (section.tasks?.every((task) => task?.status?.completed)) {
    titleClassNames.push("all-done");
  }
  const hasTasks = section.tasks?.length ?? -1 > 0;
  return (
    <section>
      {hasTasks ? <h2 className={titleClassNames.join(" ")}>Default</h2> : null}
      {children}
    </section>
  );
};

type NonDefaultSectionWrapperProps = DraggableListProvided & {
  children: ReactNode;
  section: Section;
  onDelete: () => void;
};
const NonDefaultSectionWrapper: FC<NonDefaultSectionWrapperProps> = ({
  children,
  section,
  dragHandle,
  dragHandleParentClassName,
  dragWrapperClassName,
  draggableProvided,
  onDelete,
}) => {
  const titleClassNames = ["section-title"];
  if (section.tasks?.every((task) => task?.status?.completed)) {
    titleClassNames.push("all-done");
  }

  const onTitleChange = (newTitle: string) => {
    section.title = newTitle;
  };

  const canEdit = canEditValue(section);
  return (
    <section
      className={dragWrapperClassName}
      ref={draggableProvided?.innerRef}
      {...draggableProvided?.draggableProps}
    >
      <div className={dragHandleParentClassName}>
        {dragHandle}
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
      onCancel={() => setIsAdding(false)}
      canEdit={true}
    />
  ) : (
    <button onClick={() => setIsAdding(true)} className="add-section">
      <MdAdd /> Add section
    </button>
  );
  return <section>{filling}</section>;
};
