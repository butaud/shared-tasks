import { Droppable, Draggable, DraggableProvided } from "@hello-pangea/dnd";
import React, { ReactNode } from "react";
import { MdDragHandle } from "react-icons/md";
import { Section, Task, ListOfSections, ListOfTasks } from "../models";
import { canEditValue } from "../util/jazz";
import { DraggableType } from "./DragAndDropContext";
import "./DraggableList.css";

export type DraggableModelType<T extends DraggableType> = T extends "section"
  ? Section
  : Task;
export type DraggableModelListType<T extends DraggableType> =
  T extends "section" ? ListOfSections : ListOfTasks;

export type DraggableListProvided = {
  dragHandle?: ReactNode;
  dragHandleParentClassName?: string;
  dragWrapperClassName?: string;
  draggableProvided?: DraggableProvided;
};
export type DraggableListItemProps<T extends DraggableType> = {
  provided: DraggableListProvided;
  listItem: DraggableModelType<T>;
};

export type DraggableListProps<T extends DraggableType> = {
  droppableId: string;
  type: T;
  listItems: DraggableModelListType<T>;
  children: (props: DraggableListItemProps<T>) => ReactNode;
};

export const DraggableList = <T extends DraggableType>({
  droppableId,
  type,
  listItems,
  children: childItemRenderer,
}: DraggableListProps<T>) => {
  const canEdit = canEditValue(listItems);
  if (!canEdit) {
    return listItems
      .filter((item) => item !== null)
      .map((listItem) =>
        childItemRenderer({
          listItem: listItem as DraggableModelType<T>,
          provided: {},
        })
      );
  }
  return (
    <Droppable droppableId={droppableId} type={type}>
      {(droppableProvided, snapshot) => {
        const Component = type === "task" ? "ul" : "div";
        return (
          <Component
            className={`${type}-list ${
              snapshot.isDraggingOver ? "drag-over" : ""
            }`}
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {listItems
              .filter((item) => item !== null)
              .map((listItem, index) => {
                return (
                  <Draggable
                    key={listItem.id}
                    draggableId={`${type}-${listItem.id}`}
                    index={index}
                  >
                    {(draggableProvided, snapshot) => {
                      const dragHandle = (
                        <span
                          className="drag-handle"
                          {...draggableProvided.dragHandleProps}
                        >
                          <MdDragHandle />
                        </span>
                      );
                      const dragWrapperClassName = snapshot.isDragging
                        ? "dragging"
                        : "";
                      return childItemRenderer({
                        listItem: listItem as DraggableModelType<T>,
                        provided: {
                          dragHandle,
                          dragHandleParentClassName: "drag-handle-wrapper",
                          dragWrapperClassName,
                          draggableProvided,
                        },
                      });
                    }}
                  </Draggable>
                );
              })}
            {droppableProvided.placeholder}
          </Component>
        );
      }}
    </Droppable>
  );
};
