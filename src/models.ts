import { co, CoList, CoMap } from "jazz-tools";

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
