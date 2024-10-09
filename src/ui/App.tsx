import { FC, useState } from "react";
import { MdMenu } from "react-icons/md";
import { List, Section } from "../models";
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

const fakeList: List = {
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
  const savedList = savedListJson ? JSON.parse(savedListJson) : undefined;
  const [list, setListInternal] = useState<List>(savedList ?? fakeList);
  const [currentDraggingType, setCurrentDraggingType] = useState<
    DraggableType | undefined
  >();
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

  const toggleFlyoutState = () => {
    setIsFlyoutOpen((value) => !value);
  };

  const setList = (newList: List) => {
    localStorage.setItem("savedList", JSON.stringify(newList));
    setListInternal(newList);
  };

  const updateDefaultSection = (updatedSection: Section) => {
    setList({ ...list, defaultSection: updatedSection });
  };

  const updateSection = (updatedSection: Section) => {
    const updatedSections = structuredClone(list.sections);
    updatedSections[
      updatedSections.findIndex(
        (section: Section) => section.id === updatedSection.id
      )
    ] = updatedSection;
    console.log("updating section", updatedSection.id, updatedSection.tasks);
    setList({ ...list, sections: updatedSections });
  };

  const deleteSection = (deletedSection: Section) => {
    const updatedSections = structuredClone(list.sections);
    updatedSections.splice(
      updatedSections.findIndex(
        (section: Section) => section.id === deletedSection.id
      ),
      1
    );
    setList({ ...list, sections: updatedSections });
  };

  const addSection = (newSection: Section) => {
    const updatedSections = structuredClone(list.sections);
    updatedSections.push(newSection);
    setList({ ...list, sections: updatedSections });
  };

  const updateListTitle = (newTitle: string) => {
    setList({ ...list, title: newTitle });
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

    // Clone the list which will be the update
    const updatedList = structuredClone(list);

    if (type === "task") {
      const findMatchingSection = (droppableId: string) => {
        if (`section-${updatedList.defaultSection.id}` === droppableId) {
          return updatedList.defaultSection;
        } else {
          return updatedList.sections.find(
            (section: Section) => `section-${section.id}` === droppableId
          );
        }
      };
      const sourceSection = findMatchingSection(source.droppableId);
      if (!sourceSection) {
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
        destinationSection.tasks.splice(
          destination.index,
          0,
          movedOrDeletedTask
        );
      }
    } else {
      // section
      // Pull the section out of the section list
      const [movedOrDeletedSection] = updatedList.sections.splice(
        source.index,
        1
      );

      // Unless we are moving to the garbage can, reinsert at the correct position
      if (destination.droppableId !== GARBAGE_CAN_IDS["section"]) {
        updatedList.sections.splice(
          destination.index,
          0,
          movedOrDeletedSection
        );
      }
    }
    // Propagate the change
    setList(updatedList);
  };

  return (
    <>
      <header>
        <button className="nav" onClick={toggleFlyoutState}>
          <MdMenu size={24} />
        </button>
        {isFlyoutOpen && <FlyoutMenu setList={setList} />}
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
                updateSection={updateDefaultSection}
                deleteSection={() => {}}
              />
              {list.sections.map((section, index) => (
                <SectionDisplay
                  key={section.id}
                  section={section}
                  index={index}
                  updateSection={updateSection}
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
