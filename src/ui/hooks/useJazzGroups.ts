import { Account, Group, ID } from "jazz-tools";
import { useEffect, useState } from "react";

export const useJazzGroups = (owner: Account) => {
  const [loadingOwnerGroup, setLoadingOwnerGroup] = useState(true);
  const [loadingStatusGroup, setLoadingStatusGroup] = useState(true);
  const [ownerGroup, setOwnerGroup] = useState<Group | undefined>();
  const [statusGroup, setStatusGroup] = useState<Group | undefined>();

  const ownerGroupId = localStorage.getItem(
    "jazzOwnerGroup"
  ) as ID<Group> | null;
  const statusGroupId = localStorage.getItem(
    "jazzStatusGroup"
  ) as ID<Group> | null;

  useEffect(() => {
    if (owner && ownerGroupId && !ownerGroup) {
      setLoadingOwnerGroup(true);
      (async () => {
        const ownerGroup = await Group.load(ownerGroupId, owner, {});
        setOwnerGroup(ownerGroup);
        setLoadingOwnerGroup(false);
      })();
    }
  }, [ownerGroupId, ownerGroup, owner]);

  useEffect(() => {
    if (owner && statusGroupId && !statusGroup) {
      setLoadingStatusGroup(true);
      (async () => {
        const statusGroup = await Group.load(statusGroupId, owner, {});
        setStatusGroup(statusGroup);
        setLoadingStatusGroup(false);
      })();
    }
  }, [statusGroupId, statusGroup, owner]);

  useEffect(() => {
    if (!ownerGroupId && !ownerGroup) {
      const newOwnerGroup = Group.create({ owner });
      newOwnerGroup.addMember("everyone", "reader");
      setOwnerGroup(newOwnerGroup);
      localStorage.setItem("jazzOwnerGroup", newOwnerGroup.id);
    }
  }, [ownerGroupId, ownerGroup, owner]);

  useEffect(() => {
    if (!statusGroupId && !statusGroup) {
      const newStatusGroup = Group.create({ owner });
      newStatusGroup.addMember("everyone", "writer");
      setStatusGroup(newStatusGroup);
      localStorage.setItem("jazzStatusGroup", newStatusGroup.id);
    }
  }, [statusGroupId, statusGroup, owner]);

  return { ownerGroup, statusGroup, loadingOwnerGroup, loadingStatusGroup };
};
