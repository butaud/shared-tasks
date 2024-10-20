import { FC, useEffect, useRef, useState } from "react";
import { MdCheck, MdClose, MdContentCopy, MdShare } from "react-icons/md";
import "./ShareDialog.css";

type ShareDialogProps = {
  closeDialog: () => void;
  listName: string;
};

export const ShareDialog: FC<ShareDialogProps> = ({
  closeDialog,
  listName,
}) => {
  const url = window.location.href;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog className="share-dialog" ref={dialogRef} onCancel={closeDialog}>
      <div>
        <button className="subtle close" onClick={closeDialog} title="Close">
          <MdClose />
        </button>
        <h3>Share this list</h3>
        <p>
          Others with the link will be able to view the list and check off
          tasks.
        </p>
        <div className="value-and-buttons">
          <input type="text" value={url} readOnly />
          <div className="buttons">
            <CopyToClipboardButton url={url} />
            <ShareButton url={url} listName={listName} />
          </div>
        </div>
      </div>
    </dialog>
  );
};

const CopyToClipboardButton = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
  };
  if (copied) {
    return (
      <button className="copy" disabled={true}>
        <span className="icon copied">
          <MdCheck />
        </span>
        <span>Copied to clipboard</span>
      </button>
    );
  } else {
    return (
      <button className="copy" onClick={copy}>
        <span className="icon">
          <MdContentCopy />
        </span>
        <span>Copy to clipboard</span>
      </button>
    );
  }
};

const ShareButton = ({ url, listName }: { url: string; listName: string }) => {
  const shareData = {
    title: `Shared List: ${listName}`,
    url: url,
  };
  if (!navigator.canShare(shareData)) {
    alert("This browser does not support the share API");
    return null;
  }
  return (
    <button
      className="share"
      onClick={() => {
        (async () => {
          try {
            await navigator.share(shareData);
          } catch (err) {
            console.error(err);
          }
        })();
      }}
    >
      <span className="icon">
        <MdShare />
      </span>
      <span>Share</span>
    </button>
  );
};
