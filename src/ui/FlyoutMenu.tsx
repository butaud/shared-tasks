import { FC, ReactNode, useState } from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";
import { List, ListOfSections, ListOfTasks, Section, Task, TaskStatus } from "../models";
import { MdAdd, MdContentCopy, MdMenu, MdRedo, MdShare, MdUndo } from "react-icons/md";
import "./FlyoutMenu.css";
import { Account, Group } from "jazz-tools";
import { useJazzGroups } from "./hooks/useJazzGroups";
import { useAccount } from "..";
import { canEditValue } from "../util/jazz";
import { ShareDialog } from "./ShareDialog";

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

const cloneList = (list: List, owner: Account | Group) => {
  const cloneSection = (section: Section) => {
    const clonedTasks = (section.tasks ?? []).map((task) => {
      if (!task) return null;
      const clonedStatus = TaskStatus.create(
        { completed: false },
        { owner }
      );
      return Task.create({ content: task.content, status: clonedStatus }, { owner });
    });
    const clonedTaskList = ListOfTasks.create(
      clonedTasks.filter((t): t is Task => t !== null),
      { owner }
    );
    return Section.create({ title: section.title, tasks: clonedTaskList }, { owner });
  };

  const clonedDefaultSection = list.defaultSection
    ? cloneSection(list.defaultSection)
    : Section.create({ title: "DEFAULT", tasks: ListOfTasks.create([], { owner }) }, { owner });

  const clonedSections = (list.sections ?? []).map((section) =>
    section ? cloneSection(section) : null
  );
  const clonedSectionList = ListOfSections.create(
    clonedSections.filter((s): s is Section => s !== null),
    { owner }
  );

  return List.create(
    {
      title: `Copy of ${list.title}`,
      defaultSection: clonedDefaultSection,
      sections: clonedSectionList,
    },
    { owner }
  );
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
      <button className="subtle flyout-menu-toggle" onClick={toggleFlyout}>
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
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const onBlur = (e: any) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      closeFlyout();
    }
  };

  return (
    <div tabIndex={-1} className="flyout-menu" onBlur={onBlur}>
      {list && shareDialogOpen && (
        <ShareDialog
          closeDialog={() => setShareDialogOpen(false)}
          listName={list.title}
        />
      )}
      <MenuSectionList
        list={list}
        setList={setList}
        openShareDialog={() => setShareDialogOpen(true)}
        closeFlyout={closeFlyout}
      />
    </div>
  );
};

type MenuSectionListProps = FlyoutMenuOpenProps & {
  openShareDialog: () => void;
};

const MenuSectionList: FC<MenuSectionListProps> = ({
  list,
  setList,
  openShareDialog,
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

  const onCloneList = () => {
    if (list && ownerGroup) {
      const clonedList = cloneList(list, ownerGroup);
      setList(clonedList);
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
    <>
      <MenuSection
        title="File"
        items={[
          {
            icon: <MdAdd />,
            label: "Create a new list",
            action: onCreateNewList,
          },
          {
            icon: <MdContentCopy />,
            label: "Clone this list",
            action: onCloneList,
            shouldHide: !list,
          },
          {
            icon: <MdShare />,
            label: "Share this list",
            autoFocus: true,
            action: openShareDialog,
            shouldHide: !list,
          },
        ]}
      />
      <MenuSection
        title="Edit"
        items={[
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
            shouldHide: !list || !canEditValue(list),
          },
        ]}
      />
    </>
  );
};

type MenuSectionProps = {
  title: string;
  items: MenuItemProps[];
};

const MenuSection: FC<MenuSectionProps> = ({ title, items }) => {
  const itemsToShow = items.filter((item) => !item.shouldHide);
  if (itemsToShow.length === 0) {
    return null;
  }
  return (
    <div className="menu-section">
      <h3>{title}</h3>
      {itemsToShow.map((itemProps) => (
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
  autoFocus,
}) => {
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
