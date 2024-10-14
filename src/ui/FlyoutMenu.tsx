import { FC, ReactNode, useState } from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";
import { List, Section } from "../models";
import { MdAdd, MdMenu, MdRedo, MdUndo } from "react-icons/md";
import "./FlyoutMenu.css";

export type FlyoutMenuProps = {
  list: List;
  createNewList: () => void;
};

export const FlyoutMenu: FC<FlyoutMenuProps> = ({ list, createNewList }) => {
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const noop = () => {};

  const allUncompleted = [list.defaultSection, ...(list.sections ?? [])].every(
    (section) => section?.tasks?.every((task) => !task?.status?.completed)
  );

  const onCreateNewList = () => {
    createNewList();
    setIsFlyoutOpen(false);
  };

  const resetToUncompleted = () => {
    const resetSectionTasks = (section: Section | null) => {
      section?.tasks
        ?.filter((task) => task?.status !== null)
        .forEach((task) => (task!.status!.completed = false));
    };
    if (list.defaultSection) {
      resetSectionTasks(list.defaultSection);
    }
    list.sections?.forEach(resetSectionTasks);
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
        <MdMenu />
      </button>
    );
  } else {
    return (
      <div tabIndex={-1} className="flyout-menu" onBlur={onBlur}>
        <button
          className="flyout-menu-toggle"
          onClick={() => setIsFlyoutOpen(false)}
        >
          <MdMenu />
        </button>
        <MenuSection
          title="Edit"
          items={[
            {
              icon: <MdAdd />,
              label: "Create a new list",
              action: onCreateNewList,
            },
            {
              icon: <MdUndo />,
              label: "Undo",
              autoFocus: true,
              action: noop,
              disabled: true,
              shouldHide: true,
            },
            {
              icon: <MdRedo />,
              label: "Redo",
              action: noop,
              disabled: true,
              shouldHide: true,
            },
            {
              icon: <RiCheckboxMultipleBlankLine />,
              label: "Reset tasks to uncompleted",
              action: resetToUncompleted,
              disabled: allUncompleted,
            },
          ]}
        />
        {/* <MenuSection
          title="Share"
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
        /> */}
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
