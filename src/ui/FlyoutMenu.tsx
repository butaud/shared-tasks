import { FC, ReactNode, useState } from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";
import { List, ListOfSections, ListOfTasks, Section } from "../models";
import { MdAdd, MdMenu, MdRedo, MdUndo } from "react-icons/md";
import "./FlyoutMenu.css";
import { Account, Group } from "jazz-tools";
import { useJazzGroups } from "./hooks/useJazzGroups";
import { useAccount } from "..";

export type FlyoutMenuProps = {
  list: List | undefined;
  setList: (newList: List) => void;
};

const createEmptyList = (owner: Account | Group) => {
  const defaultTaskList = ListOfTasks.create([], {
    owner,
  });
  const defaultSection = Section.create(
    {
      title: "DEFAULT",
      tasks: defaultTaskList,
    },
    { owner }
  );
  const defaultSectionList = ListOfSections.create([], {
    owner,
  });
  const newList = List.create(
    {
      title: "New list",
      defaultSection: defaultSection,
      sections: defaultSectionList,
    },
    { owner }
  );
  return newList;
};

const noop = () => {};

export const FlyoutMenu: FC<FlyoutMenuProps> = ({ list, setList }) => {
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const toggleFlyout = () => setIsFlyoutOpen(!isFlyoutOpen);
  return (
    <div className="flyout-menu-wrapper">
      {isFlyoutOpen && (
        <FlyoutMenuOpen
          list={list}
          setList={setList}
          closeFlyout={() => setIsFlyoutOpen(false)}
        />
      )}
      <button className="flyout-menu-toggle" onClick={toggleFlyout}>
        <MdMenu />
      </button>
    </div>
  );
};

type FlyoutMenuOpenProps = FlyoutMenuProps & {
  closeFlyout: () => void;
};

const FlyoutMenuOpen: FC<FlyoutMenuOpenProps> = ({
  list,
  setList,
  closeFlyout,
}) => {
  const onBlur = (e: any) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      closeFlyout();
    }
  };

  return (
    <div tabIndex={-1} className="flyout-menu" onBlur={onBlur}>
      <MenuSectionList
        list={list}
        setList={setList}
        closeFlyout={closeFlyout}
      />
    </div>
  );
};

const MenuSectionList: FC<FlyoutMenuOpenProps> = ({
  list,
  setList,
  closeFlyout,
}) => {
  const { me } = useAccount();
  const { ownerGroup, loadingOwnerGroup } = useJazzGroups(me);

  if (loadingOwnerGroup) {
    return <div>Loading...</div>;
  }

  if (!ownerGroup) {
    return <div>Error: Please refresh to try again</div>;
  }

  const onCreateNewList = () => {
    if (ownerGroup) {
      const newList = createEmptyList(ownerGroup);
      setList(newList);
      closeFlyout();
    }
  };

  const allUncompleted =
    list?.sections &&
    [list.defaultSection, ...list.sections].every((section) =>
      section?.tasks?.every((task) => !task?.status?.completed)
    );

  const resetToUncompleted = () => {
    if (list) {
      const resetSectionTasks = (section: Section | null) => {
        section?.tasks
          ?.filter((task) => task?.status !== null)
          .forEach((task) => (task!.status!.completed = false));
      };
      if (list.defaultSection) {
        resetSectionTasks(list.defaultSection);
      }
      list.sections?.forEach(resetSectionTasks);
      closeFlyout();
    }
  };

  return (
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
          shouldHide: !list || true,
        },
        {
          icon: <MdRedo />,
          label: "Redo",
          action: noop,
          disabled: true,
          shouldHide: !list || true,
        },
        {
          icon: <RiCheckboxMultipleBlankLine />,
          label: "Reset tasks to uncompleted",
          action: resetToUncompleted,
          disabled: allUncompleted,
          shouldHide: !list,
        },
      ]}
    />
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
  disabled?: boolean | null;
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
      disabled={disabled ?? undefined}
    >
      {icon} {label}
    </button>
  );
};
