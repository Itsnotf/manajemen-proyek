import Role from "./role";

export default interface User{
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    role_id: number;
    created_at: string;
    updated_at: string;
}