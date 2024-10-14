import { FC, useEffect } from "react";
import { useAppRootList } from "./hooks/useJazzList";
import { HeaderComponent } from "./HeaderComponent";
import { MainComponent } from "./MainComponent";

export const App: FC = () => {
  const { list, setList, loading: listLoading } = useAppRootList();

  useEffect(() => {
    if (list?.title) {
      window.document.title = `${list.title} | Shared Tasks`;
    } else {
      window.document.title = "Shared Tasks";
    }
  }, [list?.title]);

  return (
    <>
      <HeaderComponent list={list} setList={setList} />
      <MainComponent list={list} loading={listLoading} />
    </>
  );
};
