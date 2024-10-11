import { co, CoList, CoMap } from "jazz-tools";

export class JTask extends CoMap {
  content = co.string;
  completed = co.boolean;
}

export class ListOfTasks extends CoList.Of(co.ref(JTask)) {}

export class JSection extends CoMap {
  title = co.string;
  tasks = co.ref(ListOfTasks);
}

export class ListOfSections extends CoList.Of(co.ref(JSection)) {}

export class JList extends CoMap {
  title = co.string;
  defaultSection = co.ref(JSection);
  sections = co.ref(ListOfSections);
}
