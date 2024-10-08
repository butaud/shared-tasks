import { FC, ReactNode, useState } from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";
import { List, Section } from "../models";
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdMenu,
  MdOutlineShare,
  MdPersonAdd,
  MdRedo,
  MdUndo,
} from "react-icons/md";
import "./FlyoutMenu.css";

export type FlyoutMenuProps = {
  list: List;
  setList: (newList: List) => void;
};

export const FlyoutMenu: FC<FlyoutMenuProps> = ({ list, setList }) => {
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [isInEditMode, setIsInEditMode] = useState(true);
  const toggleEditMode = () => {
    setIsInEditMode((value) => !value);
  };
  const noop = () => {};

  const allUncompleted = [list.defaultSection, ...list.sections].every(
    (section) => section.tasks.every((task) => !task.completed)
  );

  const resetToUncompleted = () => {
    const updatedList = structuredClone(list);
    const resetSectionTasks = (section: Section) => {
      section.tasks.forEach((task) => (task.completed = false));
    };
    resetSectionTasks(updatedList.defaultSection);
    updatedList.sections.forEach(resetSectionTasks);
    setList(updatedList);
    setIsFlyoutOpen(false);
  };

  const onBlur = (e: any) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsFlyoutOpen(false);
    }
  };
  if (!isFlyoutOpen) {
    return (
      <button
        className="flyout-menu-toggle"
        onClick={() => setIsFlyoutOpen(true)}
      >
        <MdMenu size={24} />
      </button>
    );
  } else {
    return (
      <div tabIndex={-1} className="flyout-menu" onBlur={onBlur}>
        <button
          className="flyout-menu-toggle"
          onClick={() => setIsFlyoutOpen(false)}
        >
          <MdMenu size={24} />
        </button>
        <MenuSection
          title="Edit"
          items={[
            {
              icon: <MdUndo />,
              label: "Undo",
              autoFocus: true,
              action: noop,
              disabled: true,
            },
            { icon: <MdRedo />, label: "Redo", action: noop, disabled: true },
            {
              icon: <RiCheckboxMultipleBlankLine />,
              label: "Reset tasks to uncompleted",
              action: resetToUncompleted,
              disabled: allUncompleted,
            },
          ]}
        />
        <MenuSection
          title="View"
          items={[
            {
              icon: <MdCheckBox />,
              label: "Edit mode",
              action: toggleEditMode,
              shouldHide: !isInEditMode,
            },
            {
              icon: <MdCheckBoxOutlineBlank />,
              label: "Edit mode",
              action: toggleEditMode,
              shouldHide: isInEditMode,
            },
          ]}
        />
        <MenuSection
          title="Edit"
          items={[
            {
              icon: <MdOutlineShare />,
              label: "Share a user link...",
              action: noop,
              disabled: true,
            },
            {
              icon: <MdPersonAdd />,
              label: "Invite an admin...",
              action: noop,
              disabled: true,
            },
          ]}
        />
      </div>
    );
  }
};

type MenuSectionProps = {
  title: string;
  items: MenuItemProps[];
};

const MenuSection: FC<MenuSectionProps> = ({ title, items }) => {
  return (
    <div className="menu-section">
      <h3>{title}</h3>
      {items.map((itemProps) => (
        <MenuItem {...itemProps} key={itemProps.label} />
      ))}
    </div>
  );
};

type MenuItemProps = {
  icon: ReactNode;
  action: () => void;
  label: string;
  disabled?: boolean;
  autoFocus?: boolean;
  shouldHide?: boolean;
};

const MenuItem: FC<MenuItemProps> = ({
  icon,
  action,
  label,
  disabled,
  shouldHide,
  autoFocus,
}) => {
  if (shouldHide) {
    return null;
  }
  return (
    <button
      className="menu-item"
      autoFocus={autoFocus}
      onClick={action}
      disabled={disabled}
    >
      {icon} {label}
    </button>
  );
};
