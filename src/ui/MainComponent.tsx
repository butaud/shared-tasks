import { Droppable, DroppableProvided } from "@hello-pangea/dnd";
import { FC } from "react";
import { List } from "../models";
import { canEditValue } from "../util/jazz";
import { DragAndDropContext } from "./DragAndDropContext";
import { SectionDisplay, SectionAdder } from "./SectionDisplay";
import "./MainComponent.css";

type MainComponentProps = {
  list: List | undefined;
  loading: boolean;
};

export const MainComponent: FC<MainComponentProps> = ({ list, loading }) => {
  if (loading) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  } else if (!list) {
    return (
      <main>
        <p>Use the menu to create a new list.</p>
      </main>
    );
  } else {
    return <LoadedListArea list={list} />;
  }
};

type LoadedListAreaProps = {
  list: List;
};

const LoadedListArea: FC<LoadedListAreaProps> = ({ list }) => {
  const canEdit = canEditValue(list);
  if (canEdit) {
    return (
      <DragAndDropContext list={list}>
        <Droppable droppableId="main" type="section">
          {(provided) => <SectionArea provided={provided} list={list} />}
        </Droppable>
      </DragAndDropContext>
    );
  } else {
    return <SectionArea list={list} />;
  }
};

type SectionAreaProps = {
  provided?: DroppableProvided;
  list: List;
};
const SectionArea: FC<SectionAreaProps> = ({ provided, list }) => {
  const canEdit = canEditValue(list);
  return (
    <main ref={provided?.innerRef} {...provided?.droppableProps}>
      <SectionDisplay index={-1} section={list.defaultSection} />
      {list.sections
        ?.filter((section) => section !== null)
        .map((section, index) => (
          <SectionDisplay
            key={section.id}
            section={section}
            index={index}
            containingList={list.sections}
          />
        ))}
      {provided?.placeholder}
      {canEdit && <SectionAdder sectionList={list.sections} />}
    </main>
  );
};
