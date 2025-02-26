import User from "./users";

export default interface Stakeholder {
    id: number;
    project_id: number;
    user_id: number;
    user: User;
  }
  