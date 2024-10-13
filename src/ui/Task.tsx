import { Task } from "../models";

export const TaskComponent = ({ task }: { task: Task }) => {
  return (
    <div>
      <h1>{task.content}</h1>
      <p>{task.completed ? "Completed" : "Not completed"}</p>
    </div>
  );
};
