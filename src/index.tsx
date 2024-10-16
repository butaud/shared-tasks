import React, { ReactNode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./ui/App";
import reportWebVitals from "./reportWebVitals";
import { createJazzReactApp, useDemoAuth } from "jazz-react";
import { ListAccount } from "./models";
import { TransientAuthBasicUi } from "./ui/auth/TransientAuth";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const Jazz = createJazzReactApp<ListAccount>({
  AccountSchema: ListAccount,
});
export const { useAccount, useCoState } = Jazz;

function JazzAndAuth({ children }: { children: ReactNode }) {
  const [auth, authState] = useDemoAuth();
  return (
    <>
      <Jazz.Provider
        auth={auth}
        peer="wss://mesh.jazz.tools?key=carterbutaud@gmail.com"
      >
        {children}
      </Jazz.Provider>
      <div className="demoAuth">
        <TransientAuthBasicUi appName={"Shared Tasks"} state={authState} />
      </div>
    </>
  );
}
root.render(
  <React.StrictMode>
    <JazzAndAuth>
      <App />
    </JazzAndAuth>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
