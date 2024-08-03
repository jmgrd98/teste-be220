import { Objective } from "./Objective";

export interface User {
    id: string;
    name: string;
    email: string;
    photoUrl?: string;
    role: string;
    phoneNumber?: string;
    objectives?: Objective[]
}