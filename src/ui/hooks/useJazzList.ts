import { useState } from "react";
import { useCoState } from "../..";
import { List } from "../../models";
import { ID } from "jazz-tools";

export const useAppRootList = () => {
  const listIdFromUrl = window.location.search?.replace("?list=", "");
  const [listId, setListId] = useState<ID<List> | undefined>(
    (listIdFromUrl || undefined) as ID<List> | undefined
  );

  const list = useCoState(List, listId, {
    defaultSection: { tasks: [{}] },
    sections: [{ tasks: [{}] }],
  });

  const setList = (list: List) => {
    setListId(list.id);
    window.location.search = `?list=${list.id}`;
  };

  return { list, setList, loading: !!(listId && !list) };
};
