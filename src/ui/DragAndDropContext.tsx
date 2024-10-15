import {
  DragDropContext,
  Droppable,
  OnBeforeCaptureResponder,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { FC, ReactNode, useState } from "react";
import { List } from "../models";
import { insertIntoJazzList } from "../util/jazz";
import { MdDelete } from "react-icons/md";
import "./DragAndDropContext.css";

export type DragAndDropContextProps = {
  list: List;
  children: ReactNode;
};

export const DragAndDropContext: FC<DragAndDropContextProps> = ({
  list,
  children,
}) => {
  const [currentDraggingType, setCurrentDraggingType] = useState<
    DraggableType | undefined
  >();
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
        if (!destinationSection || !destinationSection.tasks) {
          console.error("Invalid drag - couldn't find destination section");
          return;
        }
        insertIntoJazzList(
          destinationSection.tasks,
          movedOrDeletedTask,
          destination.index
        );
      }
    } else if (list.sections) {
      // section
      // Pull the section out of the section list
      const [movedOrDeletedSection] = list.sections.splice(source.index, 1);

      // Unless we are moving to the garbage can, reinsert at the correct position
      if (destination.droppableId !== GARBAGE_CAN_IDS["section"]) {
        insertIntoJazzList(
          list.sections,
          movedOrDeletedSection,
          destination.index
        );
      }
    }
  };
  return (
    <DragDropContext onBeforeCapture={onBeforeCapture} onDragEnd={onDragEnd}>
      <GarbageCan currentDraggingType={currentDraggingType} />
      {children}
    </DragDropContext>
  );
};

export type DraggableType = "section" | "task";
type GarbageCanProps = {
  currentDraggingType: DraggableType | undefined;
};

const GARBAGE_CAN_IDS: Record<DraggableType, string> = {
  section: "section-trash",
  task: "task-trash",
};

type TypeSpecificDroppableDrops = {
  draggableType: DraggableType;
  currentDraggingType: DraggableType | undefined;
};
const TypeSpecificDroppable: FC<TypeSpecificDroppableDrops> = ({
  draggableType,
  currentDraggingType,
}) => {
  return (
    <Droppable
      droppableId={GARBAGE_CAN_IDS[draggableType]}
      type={draggableType}
    >
      {(provided, snapshot) => (
        <div
          className={`garbage-can ${
            snapshot.isDraggingOver ? "dragging-over" : ""
          }`}
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={
            currentDraggingType === draggableType ? {} : { display: "none" }
          }
        >
          <MdDelete />
          {/* hide the placeholder for the garbage can */}
          <div style={{ display: "none" }}>{provided.placeholder}</div>
        </div>
      )}
    </Droppable>
  );
};

const GarbageCan: FC<GarbageCanProps> = ({ currentDraggingType }) => {
  // For some reason I couldn't get the sections one to work when it was dynamically created,
  // so instead I use this hack where both trash cans always exist and are hidden unless the
  // right type is being dragged.
  return (
    <>
      <TypeSpecificDroppable
        draggableType="task"
        currentDraggingType={currentDraggingType}
      />
      <TypeSpecificDroppable
        draggableType="section"
        currentDraggingType={currentDraggingType}
      />
    </>
  );
};
