import { FC, ReactElement, ReactNode } from "react";
import { Draggable } from "react-beautiful-dnd";
import { MdDragHandle } from "react-icons/md";
import "./DragWrapper.css";

export type DraggableListProps = {
  idPrefix: string;
  listItems: ReactElement[];
};

export const DraggableList: FC<DraggableListProps> = ({
  idPrefix,
  listItems,
}) => {
  if (listItems.length === 0) {
    return null;
  } else {
    return (
      <>
        {listItems.map((listItem, index) => (
          <DragWrapper
            draggableId={`${idPrefix}-${listItem.key}`}
            index={index}
            key={listItem.key}
          >
            {listItem}
          </DragWrapper>
        ))}
      </>
    );
  }
};

type DragWrapperProps = {
  draggableId: string;
  index: number;
  children: ReactNode;
};

const DragWrapper: FC<DragWrapperProps> = ({
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
