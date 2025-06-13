import { CoValue } from "jazz-tools";

export const canEditValue = (value: CoValue) => {
  return (
    value._owner.myRole() === "writer" || value._owner.myRole() === "admin"
  );
};

// Seems to be a bug with splicing into the beginning of a Jazz list
export const insertIntoJazzList = <T>(
  list: Array<T>,
  item: T,
  index: number
) => {
  if (index === 0) {
    list.unshift(item);
  } else {
    list.splice(index, 0, item);
  }
};

import { Account, Group } from "jazz-tools";
import { List, ListOfSections, ListOfTasks, Section } from "../models";

export const createEmptyList = (owner: Account | Group) => {
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
