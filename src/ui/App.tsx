import { FC, useEffect, useState } from "react";
import { List, Section, ListOfSections, ListOfTasks } from "../models";
import { SectionAdder, SectionDisplay } from "./SectionDisplay";
import "./App.css";
import { EditableText } from "./EditableText";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  OnBeforeCaptureResponder,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { DraggableType, GARBAGE_CAN_IDS, GarbageCan } from "./GarbageCan";
import { FlyoutMenu } from "./FlyoutMenu";
import { useAccount, useCoState } from "..";
import { ID } from "jazz-tools";
import { useJazzGroups } from "./useJazzGroups";
import { canEditValue } from "../util/jazz";

export const App: FC = () => {
  // const savedListJson = localStorage.getItem("savedList");
  //const savedList = savedListJson ? JSON.parse(savedListJson) : undefined;
  const listIdFromUrl = window.location.search?.replace("?list=", "");
  console.log("got id from url", listIdFromUrl);
  const [listId, setListId] = useState<ID<List> | undefined>(
    (listIdFromUrl || undefined) as ID<List> | undefined
  );

  const [currentDraggingType, setCurrentDraggingType] = useState<
    DraggableType | undefined
  >();
  const { me } = useAccount();
  const { ownerGroup } = useJazzGroups(me);
  const list = useCoState(List, listId, {
    defaultSection: { tasks: [] },
    sections: [{ tasks: [] }],
  });

  useEffect(() => {
    if (list?.title) {
      window.document.title = `${list.title} | Shared Tasks`;
    } else {
      window.document.title = "Shared Tasks";
    }
  }, [list?.title]);

  if (!ownerGroup) {
    return <div>Loading...</div>;
  }

  if (listId && !list) {
    return <div>Loading...</div>;
  }

  const createList = () => {
    const defaultTaskList = ListOfTasks.create([], {
      owner: ownerGroup,
    });
    const defaultSection = Section.create(
      {
        title: "DEFAULT",
        tasks: defaultTaskList,
      },
      { owner: ownerGroup }
    );
    const defaultSectionList = ListOfSections.create([], {
      owner: ownerGroup,
    });
    const newList = List.create(
      {
        title: "New list",
        defaultSection: defaultSection,
        sections: defaultSectionList,
      },
      { owner: ownerGroup }
    );
    setListId(newList.id);
    window.history.pushState({}, "", `?list=${newList.id}`);
  };

  if (!list) {
    return (
      <div>
        <button onClick={createList}>Create List</button>
      </div>
    );
  }

  const deleteSection = (sectionToDelete: Section) => {
    const index =
      list.sections?.findIndex(
        (section) => section?.id === sectionToDelete.id
      ) ?? -1;
    if (index >= 0) {
      list.sections?.splice(index, 1);
    }
  };

  const updateListTitle = (newTitle: string) => {
    list.title = newTitle;
  };

  const onBeforeCapture: OnBeforeCaptureResponder = ({ draggableId }) => {
    if (draggableId.startsWith("task-")) {
      setCurrentDraggingType("task");
    }
    if (draggableId.startsWith("section-")) {
      setCurrentDraggingType("section");
    }
  };

  const onDragEnd: OnDragEndResponder = ({ source, destination, type }) => {
    setCurrentDraggingType(undefined);
    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === "task") {
      const findMatchingSection = (droppableId: string) => {
        if (`section-${list.defaultSection?.id}` === droppableId) {
          return list.defaultSection;
        } else {
          return list.sections?.find(
            (section) => `section-${section?.id}` === droppableId
          );
        }
      };
      const sourceSection = findMatchingSection(source.droppableId);
      if (!sourceSection || !sourceSection.tasks) {
        console.error("Invalid drag - couldn't find source section");
        return;
      }

      // First, pull the task out of the source list
      const [movedOrDeletedTask] = sourceSection.tasks.splice(source.index, 1);

      // Unless we are moving to the garbage can, add it to a destination list
      if (destination.droppableId !== GARBAGE_CAN_IDS["task"]) {
        const destinationSection = findMatchingSection(destination.droppableId);
        if (!destinationSection) {
          console.error("Invalid drag - couldn't find destination section");
          return;
        }
        if (!destinationSection.tasks) {
          destinationSection.tasks = ListOfTasks.create([], {
            owner: list._owner,
          });
        }
        destinationSection.tasks.splice(
          destination.index,
          0,
          movedOrDeletedTask
        );
      }
    } else {
      // section
      // Pull the section out of the section list
      const [movedOrDeletedSection] = list.sections.splice(source.index, 1);

      // Unless we are moving to the garbage can, reinsert at the correct position
      if (destination.droppableId !== GARBAGE_CAN_IDS["section"]) {
        list.sections.splice(destination.index, 0, movedOrDeletedSection);
      }
    }
  };

  const canEdit = canEditValue(list);

  const sectionArea = canEdit ? (
    <DragDropContext onDragEnd={onDragEnd} onBeforeCapture={onBeforeCapture}>
      <GarbageCan currentDraggingType={currentDraggingType} />
      <Droppable droppableId="main" type="section">
        {(provided) => (
          <SectionArea
            provided={provided}
            list={list}
            deleteSection={deleteSection}
            canEdit={canEdit}
          />
        )}
      </Droppable>
    </DragDropContext>
  ) : (
    <SectionArea list={list} deleteSection={deleteSection} canEdit={canEdit} />
  );

  return (
    <>
      <header>
        <FlyoutMenu list={list} createNewList={createList} />
        <EditableText
          as="h1"
          text={list.title}
          onTextChange={updateListTitle}
          className="list-title"
          canEdit={canEdit}
        />
      </header>
      {sectionArea}
    </>
  );
};

type SectionAreaProps = {
  provided?: DroppableProvided;
  list: List;
  deleteSection: (section: Section) => void;
  canEdit: boolean;
};
const SectionArea: FC<SectionAreaProps> = ({
  provided,
  list,
  deleteSection,
  canEdit,
}) => {
  return (
    <main ref={provided?.innerRef} {...provided?.droppableProps}>
      <SectionDisplay
        asDefault
        index={-1}
        section={list.defaultSection}
        deleteSection={() => {}}
      />
      {list.sections
        ?.filter((section) => section !== null)
        .map((section, index) => (
          <SectionDisplay
            key={section.id}
            section={section}
            index={index}
            deleteSection={deleteSection}
          />
        ))}
      {provided?.placeholder}
      {canEdit && <SectionAdder sectionList={list.sections} />}
    </main>
  );
};
