import { Account, co, CoList, CoMap, Profile } from "jazz-tools";

// Need to pull this out as a separate class so it can have separate permissions
export class TaskStatus extends CoMap {
  completed = co.boolean;
}

export class Task extends CoMap {
  content = co.string;
  status = co.ref(TaskStatus);
}

export class ListOfTasks extends CoList.Of(co.ref(Task)) {}

export class Section extends CoMap {
  title = co.string;
  tasks = co.ref(ListOfTasks);
}

export class ListOfSections extends CoList.Of(co.ref(Section)) {}

export class List extends CoMap {
  title = co.string;
  defaultSection = co.ref(Section);
  sections = co.ref(ListOfSections);
}

export class ListOfLists extends CoList.Of(co.ref(List)) {}

export class ListAccountRoot extends CoMap {
  lists = co.ref(ListOfLists);
}

export const AVATAR_COLORS = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A1",
  "#EDBF6B",
  "#33FFF5",
  "#FF8C33",
  "#8C33FF",
  "#1C9E31",
  "#F70202",
  "#F7CC31",
  "#F7AFD6",
];
export const AVATAR_GREY = "#333333";

export class ListProfile extends Profile {
  color = co.string;
}

export class ListAccount extends Account {
  profile = co.ref(ListProfile);
  root = co.ref(ListAccountRoot);

  /** The account migration is run on account creation and on every log-in.
   *  You can use it to set up the account root and any other initial CoValues you need.
   */
  migrate(this: ListAccount, creationProps?: { name: string }) {
    super.migrate(creationProps);
    if (!this._refs.root) {
      this.root = ListAccountRoot.create(
        {
          lists: ListOfLists.create([], { owner: this }),
        },
        { owner: this }
      );
    }
  }

  get avatarColor() {
    if (!this.profile) {
      return AVATAR_GREY;
    }
    if (!this.profile.color) {
      this.profile.color =
        AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    }
    return this.profile.color;
  }
}
