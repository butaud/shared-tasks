import { FC, useState } from "react";
import { useAccount } from "..";
import "./ProfileComponent.css";
import { MdClose, MdSave } from "react-icons/md";
import { AVATAR_COLORS } from "../models";

export type ProfileComponentProps = {};

export const ProfileComponent: FC<ProfileComponentProps> = () => {
  const { me } = useAccount();
  const [expanded, setExpanded] = useState(false);

  if (!me.profile) {
    return null;
  }

  return (
    <>
      <button
        className="profile-button"
        style={{
          backgroundColor: me.avatarColor,
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {me.profile?.name
          .split(" ")
          .slice(0, 2)
          .map((n: string) => n[0])
          .join("")}
      </button>
      {expanded && <ProfileEditor close={() => setExpanded(false)} />}
    </>
  );
};

type ProfileEditorProps = { close: () => void };
export const ProfileEditor: FC<ProfileEditorProps> = ({ close }) => {
  const { me } = useAccount();
  const [name, setName] = useState(me.profile?.name || "");

  const save = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (me.profile) {
      me.profile.name = name;
    }
    close();
  };

  return (
    <div
      className="profile-editor-container"
      onKeyDown={(e) => e.key === "Escape" && close()}
      style={{ backgroundColor: me.avatarColor }}
    >
      <button className="close" onClick={close} title="Close">
        <MdClose />
      </button>
      <form className="profile-editor">
        <label>Display Name</label>
        <div className="form-line">
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="save" onClick={save}>
            <MdSave />
          </button>
        </div>
        <label>Avatar Color</label>
        <div className="form-line">
          <ColorPicker />
        </div>
      </form>
    </div>
  );
};

const ColorPicker: FC = () => {
  const { me } = useAccount();
  return (
    <div className="color-picker-container">
      {AVATAR_COLORS.map((color) => {
        const selected = color === me.avatarColor;
        const classNames = ["color"];
        if (selected) {
          classNames.push("selected");
        }
        return (
          <button
            key={color}
            className={classNames.join(" ")}
            style={{ backgroundColor: color }}
            type="button"
            onClick={() => {
              if (!selected && me.root) {
                me.root.color = color;
              }
            }}
          />
        );
      })}
    </div>
  );
};
