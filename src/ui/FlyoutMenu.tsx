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

  const resetToUncompleted = () => {
    const updatedList = structuredClone(list);
    const resetSectionTasks = (section: Section) => {
      section.tasks.forEach((task) => (task.completed = false));
    };
    resetSectionTasks(updatedList.defaultSection);
    updatedList.sections.forEach(resetSectionTasks);
    setList(updatedList);
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
            { icon: <MdUndo />, label: "Undo", autoFocus: true, action: noop },
            { icon: <MdRedo />, label: "Redo", action: noop },
            {
              icon: <RiCheckboxMultipleBlankLine />,
              label: "Reset tasks to uncompleted",
              action: resetToUncompleted,
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
              shouldHide: () => !isInEditMode,
            },
            {
              icon: <MdCheckBoxOutlineBlank />,
              label: "Edit mode",
              action: toggleEditMode,
              shouldHide: () => isInEditMode,
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
            },
            {
              icon: <MdPersonAdd />,
              label: "Invite an admin...",
              action: noop,
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
  autoFocus?: boolean;
  shouldHide?: () => boolean;
};

const MenuItem: FC<MenuItemProps> = ({
  icon,
  action,
  label,
  shouldHide,
  autoFocus,
}) => {
  if (shouldHide?.()) {
    return null;
  }
  return (
    <button className="menu-item" autoFocus={autoFocus} onClick={action}>
      {icon} {label}
    </button>
  );
};
