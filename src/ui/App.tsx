import { FC, useState } from "react";
import { MdMenu } from "react-icons/md";
import { List, Section } from "../models";
import { SectionDisplay } from "./SectionDisplay";
import "./App.css";
import { EditableText } from "./EditableText";
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { DraggableList } from "./DragWrapper";

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
  const [list, setList] = useState<List>(fakeList);

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

  const updateListTitle = (newTitle: string) => {
    setList({ ...list, title: newTitle });
  };

  const onDragEnd: OnDragEndResponder = ({ source, destination, type }) => {
    if (!destination) {
      return;
    }

    if (type === "task") {
      const updatedList = structuredClone(list);
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
      const destinationSection = findMatchingSection(destination.droppableId);
      if (!sourceSection || !destinationSection) {
        console.error(
          "Invalid drag - couldn't find source and/or destination section"
        );
        return;
      }
      const [movedTask] = sourceSection.tasks.splice(source.index, 1);
      destinationSection.tasks.splice(destination.index, 0, movedTask);
      setList(updatedList);
    } else {
      const sourceIndex = source.index;
      const destinationIndex = destination?.index;
      if (destinationIndex !== undefined && sourceIndex !== destinationIndex) {
        let updatedList = structuredClone(list.sections);
        const [movedSection] = updatedList.splice(sourceIndex, 1);
        updatedList.splice(destinationIndex, 0, movedSection);
        setList({ ...list, sections: updatedList });
      }
    }
  };

  return (
    <>
      <header>
        <button className="nav">
          <MdMenu size={24} />
        </button>
        <EditableText
          as="h1"
          text={list.title}
          onTextChange={updateListTitle}
          className="list-title"
        />
      </header>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="main" type="section">
          {(provided) => (
            <main ref={provided.innerRef} {...provided.droppableProps}>
              <SectionDisplay
                asDefault
                section={list.defaultSection}
                updateSection={updateDefaultSection}
                deleteSection={() => {}}
              />
              <DraggableList
                idPrefix="section"
                listItems={list.sections.map((section) => (
                  <SectionDisplay
                    key={section.id}
                    section={section}
                    updateSection={updateSection}
                    deleteSection={deleteSection}
                  />
                ))}
              />
              {provided.placeholder}
            </main>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
