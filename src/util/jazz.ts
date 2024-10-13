import { CoValue } from "jazz-tools";

export const canEditValue = (value: CoValue) => {
  return (
    value._owner.myRole() === "writer" || value._owner.myRole() === "admin"
  );
};
