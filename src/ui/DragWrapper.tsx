import { FC, ReactElement, ReactNode } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { MdDragHandle } from "react-icons/md";
import "./DragWrapper.css";

export type DraggableListProps = {
  canEdit: boolean;
  idPrefix: string;
  listItems: ReactElement[];
};

export const DraggableList: FC<DraggableListProps> = ({
  idPrefix,
  listItems,
  canEdit,
}) => {
  if (listItems.length === 0) {
    return null;
  } else {
    return (
      <>
        {listItems.map((listItem, index) => {
          if (canEdit) {
            return (
              <DragWrapper
                draggableId={`${idPrefix}-${listItem.key}`}
                index={index}
                key={listItem.key}
              >
                {listItem}
              </DragWrapper>
            );
          } else {
            return listItem;
          }
        })}
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
      {(provided, snapshot) => (
        <div
          className={"drag-wrapper" + (snapshot.isDragging ? " dragging" : "")}
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
