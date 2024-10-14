import { Droppable } from "@hello-pangea/dnd";
import { FC } from "react";
import { MdDelete } from "react-icons/md";
import "./GarbageCan.css";

export type DraggableType = "section" | "task";
export type GarbageCanProps = {
  currentDraggingType: DraggableType | undefined;
};

export const GARBAGE_CAN_IDS: Record<DraggableType, string> = {
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

export const GarbageCan: FC<GarbageCanProps> = ({ currentDraggingType }) => {
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
