import { v4 as uuidv4 } from 'uuid'

export interface User {
    id: string; // unique identifier (string, uuid) generated on server side
    username: string; // user's name (string, required)
    age: number; // user's age (number, required)
    hobbies: string[]; // user's hobbies (array of strings or empty array, required)
}


export const users: User[] = []

export const createUser = (username: string, age: number, hobbies: string[]): User => {
    return { id: uuidv4(), username, age, hobbies }
}
