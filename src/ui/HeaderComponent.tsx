import { FC } from "react";
import { List } from "../models";
import { EditableText } from "./EditableText";
import { FlyoutMenu } from "./FlyoutMenu";
import { canEditValue } from "../util/jazz";
import "./HeaderComponent.css";
import { ProfileComponent } from "./ProfileComponent";

export type HeaderComponentProps = {
  list: List | undefined;
  setList: (list: List) => void;
};

export const HeaderComponent: FC<HeaderComponentProps> = ({
  list,
  setList,
}) => {
  return (
    <header>
      <FlyoutMenu list={list} setList={setList} />
      {list ? (
        <Title list={list} />
      ) : (
        <h1 className="list-title">Shared list editor</h1>
      )}
      <ProfileComponent />
    </header>
  );
};

type TitleProps = {
  list: List;
};

export const Title: FC<TitleProps> = ({ list }) => {
  const updateListTitle = (newTitle: string) => {
    list.title = newTitle;
  };

  const defaultTaskCount = list.defaultSection?.tasks?.length ?? 0;
  const sectionedTasksCount =
    list.sections?.reduce(
      (acc, section) => acc + (section?.tasks?.length ?? 0),
      0
    ) ?? 0;
  const completedDefaultTasks =
    list.defaultSection?.tasks?.filter((task) => task?.status?.completed)
      .length ?? 0;
  const completedSectionedTasks =
    list.sections?.reduce(
      (acc, section) =>
        acc +
        (section?.tasks?.filter((task) => task?.status?.completed).length ?? 0),
      0
    ) ?? 0;

  const allTasksCount = defaultTaskCount + sectionedTasksCount;
  const completedTasksCount = completedDefaultTasks + completedSectionedTasks;
  const allCompleted =
    allTasksCount > 0 && allTasksCount === completedTasksCount;

  const canEdit = canEditValue(list);
  return (
    <div className="title-wrapper">
      <EditableText
        as="h1"
        className="list-title"
        text={list.title}
        onTextChange={updateListTitle}
        canEdit={canEdit}
      />
      <p className={"task-count" + (allCompleted ? " done" : "")}>
        ({completedTasksCount} / {allTasksCount})
      </p>
    </div>
  );
};
