import { FC } from "react";
import { List } from "../models";
import { canEditValue } from "../util/jazz";
import { DragAndDropContext } from "./DragAndDropContext";
import { SectionComponent, SectionAdder } from "./SectionComponent";
import { DraggableList } from "./DraggableList";
import "./MainComponent.css";

type MainComponentProps = {
  list: List | undefined;
  loading: boolean;
  editMode: boolean;
};

export const MainComponent: FC<MainComponentProps> = ({
  list,
  loading,
  editMode,
}) => {
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
    return <LoadedListArea list={list} editMode={editMode} />;
  }
};

type LoadedListAreaProps = {
  list: List;
  editMode: boolean;
};

const LoadedListArea: FC<LoadedListAreaProps> = ({ list, editMode }) => {
  const canEdit = canEditValue(list);
  if (canEdit && editMode) {
    return (
      <DragAndDropContext list={list}>
        <SectionArea list={list} editMode={editMode} />
      </DragAndDropContext>
    );
  } else {
    return <SectionArea list={list} editMode={editMode} />;
  }
};

type SectionAreaProps = {
  list: List;
  editMode: boolean;
};
const SectionArea: FC<SectionAreaProps> = ({ list, editMode }) => {
  const canEdit = canEditValue(list);
  if (!list.sections) {
    return null;
  }
  const canUseEditControls = canEdit && editMode;
  return (
    <main>
      {list.defaultSection && (
        <SectionComponent section={list.defaultSection} editMode={editMode} />
      )}
      <DraggableList
        droppableId="main"
        type="section"
        listItems={list.sections}
        canDrag={canUseEditControls}
      >
        {({ listItem: section, provided }) => (
          <SectionComponent
            key={section.id}
            section={section}
            containingList={list.sections}
            editMode={editMode}
            {...provided}
          />
        )}
      </DraggableList>
      {canUseEditControls && <SectionAdder sectionList={list.sections} />}
    </main>
  );
};
