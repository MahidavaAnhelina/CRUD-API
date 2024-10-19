export interface User {
    id: string; // unique identifier (string, uuid) generated on server side
    username: string; // user's name (string, required)
    age: number; // user's age (number, required)
    hobbies: string[]; // user's hobbies (array of strings or empty array, required)
}
