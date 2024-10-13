import { co, CoList, CoMap } from "jazz-tools";

export class Task extends CoMap {
  content = co.string;
  completed = co.boolean;
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
