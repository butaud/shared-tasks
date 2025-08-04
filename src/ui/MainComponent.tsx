import { FC } from "react";
import { List } from "../models";
import { canEditValue, createEmptyList } from "../util/jazz";
import { useAccount } from "..";
import { useJazzGroups } from "./hooks/useJazzGroups";
import { DragAndDropContext } from "./DragAndDropContext";
import { SectionComponent, SectionAdder } from "./SectionComponent";
import { DraggableList } from "./DraggableList";
import "./MainComponent.css";

type MainComponentProps = {
  list: List | undefined;
  loading: boolean;
  setList: (newList: List) => void;
};

export const MainComponent: FC<MainComponentProps> = ({
  list,
  loading,
  setList,
}) => {
  const { me } = useAccount();
  const { ownerGroup, loadingOwnerGroup } = useJazzGroups(me);
  if (loading) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  } else if (!list) {
    const createList = () => {
      if (ownerGroup) {
        const newList = createEmptyList(ownerGroup);
        setList(newList);
      }
    };
    return (
      <main>
        <button onClick={createList} disabled={loadingOwnerGroup}>
          Create a new list
        </button>
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
        <SectionArea list={list} />
      </DragAndDropContext>
    );
  } else {
    return <SectionArea list={list} />;
  }
};

type SectionAreaProps = {
  list: List;
};
const SectionArea: FC<SectionAreaProps> = ({ list }) => {
  const canEdit = canEditValue(list);
  if (!list.sections) {
    return null;
  }
  return (
    <main>
      {list.defaultSection && (
        <SectionComponent section={list.defaultSection} />
      )}
      <DraggableList
        droppableId="main"
        type="section"
        listItems={list.sections}
      >
        {({ listItem: section, provided }) => (
          <SectionComponent
            key={section.id}
            section={section}
            containingList={list.sections}
            {...provided}
          />
        )}
      </DraggableList>
      {canEdit && <SectionAdder sectionList={list.sections} />}
    </main>
  );
};
