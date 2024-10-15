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
  const canEdit = canEditValue(list);
  return (
    <EditableText
      as="h1"
      className="list-title"
      text={list.title}
      onTextChange={updateListTitle}
      canEdit={canEdit}
    />
  );
};
