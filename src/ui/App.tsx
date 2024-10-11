import { FC, useEffect, useState } from "react";
import { JList, JSection, ListOfSections, ListOfTasks } from "../models";
import { SectionAdder, SectionDisplay } from "./SectionDisplay";
import "./App.css";
import { EditableText } from "./EditableText";
import {
  DragDropContext,
  Droppable,
  OnBeforeCaptureResponder,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { DraggableType, GARBAGE_CAN_IDS, GarbageCan } from "./GarbageCan";
import { FlyoutMenu } from "./FlyoutMenu";
import { useAccount, useCoState } from "..";
import { ID } from "jazz-tools";

const fakeList = {
  id: 1,
  title: "Test List",
  defaultSection: {
    id: 2,
    title: "DEFAULT",
    tasks: [
      {
        id: 3,
        content: "Verify the thing",
        completed: false,
      },
    ],
  },
  sections: [
    {
      id: 4,
      title: "Section 1",
      tasks: [
        {
          id: 5,
          content: "Do the thing",
          completed: true,
        },
        {
          id: 6,
          content: "Do the other thing",
          completed: false,
        },
      ],
    },
    {
      id: 7,
      title: "Section 2",
      tasks: [
        {
          id: 8,
          content: "Do more things",
          completed: false,
        },
      ],
    },
  ],
};

export const App: FC = () => {
  const savedListJson = localStorage.getItem("savedList");
  //const savedList = savedListJson ? JSON.parse(savedListJson) : undefined;
  const listIdFromUrl = window.location.search?.replace("?list=", "");
  console.log("got id from url", listIdFromUrl);
  const [listId, setListId] = useState<ID<JList> | undefined>(
    (listIdFromUrl || undefined) as ID<JList> | undefined
  );

  const [currentDraggingType, setCurrentDraggingType] = useState<
    DraggableType | undefined
  >();
  const { me } = useAccount();
  const list = useCoState(JList, listId, {
    defaultSection: { tasks: [] },
    sections: [{ tasks: [] }],
  });

  //   useEffect(() => {
  //     (async () => {
  //       if (!list) {
  //         const defaultTaskList = ListOfTasks.create([], {
  //           owner: me,
  //         });
  //         const defaultSection = JSection.create(
  //           {
  //             title: "DEFAULT",
  //             tasks: defaultTaskList,
  //           },
  //           { owner: me }
  //         );
  //         const defaultSectionList = ListOfSections.create([], { owner: me });
  //         const newList = JList.create(
  //           {
  //             title: "Test List",
  //             defaultSection: defaultSection,
  //             sections: defaultSectionList,
  //           },
  //           { owner: me }
  //         );
  //         setListId(newList.id);
  //         window.history.pushState({}, "", `?list=${newList.id}`);
  //       }
  //     })();
  //   }, [list, me]);

  if (!list) {
    return null;
  }

  const addSection = (newSection: JSection) => {
    list.sections?.push(newSection);
  };

  const deleteSection = (sectionToDelete: JSection) => {
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

    if (!list.sections) {
      list.sections = ListOfSections.create([], { owner: me });
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
          destinationSection.tasks = ListOfTasks.create([], { owner: me });
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

  return (
    <>
      <header>
        <FlyoutMenu list={list} />
        <EditableText
          as="h1"
          text={list.title}
          onTextChange={updateListTitle}
          className="list-title"
        />
      </header>
      <DragDropContext onDragEnd={onDragEnd} onBeforeCapture={onBeforeCapture}>
        <GarbageCan currentDraggingType={currentDraggingType} />
        <Droppable droppableId="main" type="section">
          {(provided) => (
            <main ref={provided.innerRef} {...provided.droppableProps}>
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
              {provided.placeholder}
              <SectionAdder addSection={addSection} />
            </main>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
