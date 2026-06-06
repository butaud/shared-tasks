import { FC, useEffect, useState } from "react";
import { useAppRootList } from "./hooks/useJazzList";
import { HeaderComponent } from "./HeaderComponent";
import { MainComponent } from "./MainComponent";
import { canEditValue } from "../util/jazz";

export const App: FC = () => {
  const { list, setList, loading: listLoading } = useAppRootList();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (list?.title) {
      window.document.title = `${list.title} | Shared Tasks`;
    } else {
      window.document.title = "Shared Tasks";
    }
  }, [list?.title]);

  useEffect(() => {
    setEditMode(false);
  }, [list?.id]);

  useEffect(() => {
    if (list && !canEditValue(list)) {
      setEditMode(false);
    }
  }, [list]);

  return (
    <>
      <HeaderComponent
        list={list}
        setList={setList}
        editMode={editMode}
        setEditMode={setEditMode}
      />
      <MainComponent list={list} loading={listLoading} editMode={editMode} />
    </>
  );
};
