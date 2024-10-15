import { FC, useState } from "react";
import { useAccount } from "..";
import "./ProfileComponent.css";
import { MdSave } from "react-icons/md";

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

  const save = () => {
    if (me.profile) {
      me.profile.name = name;
    }
    close();
  };

  const onBlur = (e: any) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      close();
    }
  };

  return (
    <form className="profile-editor" onBlur={onBlur}>
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={save}>
        <MdSave />
      </button>
    </form>
  );
};
