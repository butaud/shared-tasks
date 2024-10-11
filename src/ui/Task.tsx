import { JTask } from "../models";

export const TaskComponent = ({ task }: { task: JTask }) => {
  return (
    <div>
      <h1>{task.content}</h1>
      <p>{task.completed ? "Completed" : "Not completed"}</p>
    </div>
  );
};
