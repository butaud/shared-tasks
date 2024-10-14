import React, { ReactNode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./ui/App";
import reportWebVitals from "./reportWebVitals";
import { createJazzReactApp, useDemoAuth, DemoAuthBasicUI } from "jazz-react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const Jazz = createJazzReactApp();
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
        <DemoAuthBasicUI appName="Shared Tasks" state={authState} />
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
