export interface ICredentials {
    username: string;
    password: string;
}

export interface IServerLoginResponse {
    access_token: string;
    // id: number;
    username: string;
    // role: string;
}

/*export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
    NONE = ""
}*/
