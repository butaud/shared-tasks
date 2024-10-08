import { FC, ReactNode } from "react";
import { Section, Task } from "../models";
import { TaskDisplay } from "./TaskDisplay";
import "./SectionDisplay.css";

export type SectionProps = {
  section: Section;
  asDefault?: boolean;
  updateSection: (newSection: Section) => void;
};

export const SectionDisplay: FC<SectionProps> = ({
  section,
  asDefault,
  updateSection,
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

  const list = (
    <ul className="task-list">
      {section.tasks.map((task) => (
        <TaskDisplay key={task.id} task={task} updateTask={updateTask} />
      ))}
    </ul>
  );
  if (asDefault) {
    return list;
  } else {
    return (
      <NonDefaultSectionWrapper title={section.title}>
        {list}
      </NonDefaultSectionWrapper>
    );
  }
};

type NonDefaultSectionWrapperProps = {
  children: ReactNode;
  title: string;
};
const NonDefaultSectionWrapper: FC<NonDefaultSectionWrapperProps> = ({
  children,
  title,
}) => {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
};
