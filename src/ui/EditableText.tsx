import { createElement, FC, FocusEvent, FormEvent, useState } from "react";

export type EditableTextProps = {
  text: string;
  onTextChange: (newText: string) => void;
  as: "label" | "h1" | "h2";
  className?: string;
  onClick?: () => void;
};

export const EditableText: FC<EditableTextProps> = ({
  text,
  onTextChange,
  as,
  className,
  onClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(text);

  const onDoubleClick = () => {
    setDraftText(text);
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
    return createElement(
      as,
      {
        onDoubleClick,
        onClick,
        className,
      },
      text
    );
  }
};
