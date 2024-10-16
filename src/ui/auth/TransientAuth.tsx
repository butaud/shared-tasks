import { useState } from "react";
import "./TransientAuth.css";
import { MdCheckBox, MdEdit, MdPerson } from "react-icons/md";

type DemoAuthState = (
  | {
      state: "uninitialized";
    }
  | {
      state: "loading";
    }
  | {
      state: "ready";
      signUp: (username: string) => void;
    }
  | {
      state: "signedIn";
      logOut: () => void;
    }
) & {
  errors: string[];
};

export const TransientAuthBasicUi = ({
  appName,
  state,
}: {
  appName: string;
  state: DemoAuthState;
}) => {
  const [username, setUsername] = useState<string>("");

  const listIdInUrl = !!new URLSearchParams(window.location.search).get("list");

  return (
    <div className="auth-container">
      {state.state === "loading" ? (
        <div>Loading...</div>
      ) : state.state === "ready" ? (
        <>
          <h1>{appName}</h1>
          <ul>
            <li>
              <span className="person icon">
                <MdPerson />
              </span>
              {listIdInUrl
                ? "Enter any name to view this list."
                : "Enter any name to view and create task lists."}
            </li>
            <li>
              <span className="check icon">
                <MdCheckBox />
              </span>
              Others can see it when you complete a task.
            </li>
            <li>
              <span className="edit icon">
                <MdEdit />
              </span>
              You can always change it later!
            </li>
          </ul>
          {state.errors.map((error) => (
            <div className="error">{error}</div>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              state.signUp(username);
            }}
          >
            <input
              type="text"
              placeholder="Display name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="webauthn"
            />
            <input type="submit" value="Let's Go" />
          </form>
        </>
      ) : null}
    </div>
  );
};
