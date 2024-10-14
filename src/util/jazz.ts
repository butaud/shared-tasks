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
