import { FC, ReactNode } from "react";
import { Draggable } from "react-beautiful-dnd";
import { MdDragHandle } from "react-icons/md";
import "./DragWrapper.css";

export type DragWrapperProps = {
  draggableId: string;
  index: number;
  children: ReactNode;
};

export const DragWrapper: FC<DragWrapperProps> = ({
  draggableId,
  index,
  children,
}) => {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided) => (
        <div
          className="drag-wrapper"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <span className="drag-handle" {...provided.dragHandleProps}>
            <MdDragHandle size={20} />
          </span>
          {children}
        </div>
      )}
    </Draggable>
  );
};
