import { FC, useState } from "react";
import { MdMenu } from "react-icons/md";
import { List, Section } from "../models";
import { SectionDisplay } from "./SectionDisplay";
import "./App.css";
import { EditableText } from "./EditableText";

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
      <main>
        <SectionDisplay
          asDefault
          section={list.defaultSection}
          updateSection={updateDefaultSection}
          deleteSection={() => {}}
        />
        {list.sections.map((section) => (
          <SectionDisplay
            key={section.id}
            section={section}
            updateSection={updateSection}
            deleteSection={deleteSection}
          />
        ))}
      </main>
    </>
  );
};
