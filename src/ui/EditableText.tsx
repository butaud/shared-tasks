import {
  createElement,
  FC,
  FocusEvent,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  useState,
} from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import "./EditableText.css";

export type EditableTextProps = {
  text: string;
  onTextChange: (newText: string) => void;
  as: "label" | "h1" | "h2";
  className?: string;
  onClick?: () => void;
  onDelete?: () => void;
};

export const EditableText: FC<EditableTextProps> = ({
  text,
  onTextChange,
  as,
  className,
  onClick,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(text);
  const [isInMenu, setIsInMenu] = useState(false);

  const onStartEditing = () => {
    setDraftText(text);
    setIsInMenu(false);
    setIsEditing(true);
  };
  const onSubmit = (
    e: FormEvent<HTMLFormElement> | FocusEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    onTextChange(draftText);
    setIsEditing(false);
  };
  const onCancel = () => setIsEditing(false);

  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setIsInMenu(true);
  };

  if (isEditing) {
    return (
      <form onSubmit={onSubmit}>
        <input
          autoFocus
          type="text"
          value={draftText}
          onChange={(e) => setDraftText(e.currentTarget.value)}
          onBlur={onSubmit}
          onKeyDown={(e) => e.key === "Escape" && onCancel()}
          className={className}
        />
      </form>
    );
  } else {
    if (isInMenu) {
      return createElement(
        as,
        {
          className: `${className} menu-wrapper`,
          onBlur: (e: any) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsInMenu(false);
            }
          },
          onKeyDown: (e: KeyboardEvent) =>
            e.key === "Escape" && setIsInMenu(false),
          onContextMenu,
          tabIndex: -1,
        },
        <>
          {onDelete && (
            <button className="delete" onClick={onDelete}>
              <MdDelete size={20} />
            </button>
          )}
          <button autoFocus className="edit" onClick={onStartEditing}>
            <MdEdit size={20} />
          </button>
          <span>{text}</span>
        </>
      );
    } else {
      return createElement(
        as,
        {
          onDoubleClick: onStartEditing,
          onClick,
          className,
          onContextMenu,
        },
        text
      );
    }
  }
};
