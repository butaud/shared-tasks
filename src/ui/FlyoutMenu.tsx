import { FC, ReactNode, useState } from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";
import { List } from "../models";
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdOutlineShare,
  MdPersonAdd,
  MdRedo,
  MdUndo,
} from "react-icons/md";
import "./FlyoutMenu.css";

export type FlyoutMenuProps = {
  setList: (newList: List) => void;
};

export const FlyoutMenu: FC<FlyoutMenuProps> = ({ setList }) => {
  const [isInEditMode, setIsInEditMode] = useState(true);
  const toggleEditMode = () => {
    setIsInEditMode((value) => !value);
  };

  const noop = () => {};
  return (
    <div className="flyout-menu">
      <MenuSection
        title="Edit"
        items={[
          {
            icon: <RiCheckboxMultipleBlankLine />,
            label: "Reset to uncompleted",
            action: noop,
          },
          { icon: <MdUndo />, label: "Undo", action: noop },
          { icon: <MdRedo />, label: "Redo", action: noop },
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
          { icon: <MdPersonAdd />, label: "Invite an admin...", action: noop },
        ]}
      />
    </div>
  );
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
  shouldHide?: () => boolean;
};

const MenuItem: FC<MenuItemProps> = ({ icon, action, label, shouldHide }) => {
  if (shouldHide?.()) {
    return null;
  }
  return (
    <button className="menu-item" onClick={action}>
      {icon} {label}
    </button>
  );
};
