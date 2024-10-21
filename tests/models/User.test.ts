import {createUser, deleteUser, updateUser, users} from "../../src/models/User";

jest.mock('uuid', () => ({
    v4: () => 'unique-id-12345'
}));

describe('User Controller Functions', () => {
    beforeEach(() => {
        users.length = 0;
    });

    describe('createUser', () => {
        it('should create a new user with a unique ID and specified properties', () => {
            const newUser = createUser('John Doe', 30, ['reading', 'coding']);

            expect(newUser).toEqual({
                id: 'unique-id-12345',
                username: 'John Doe',
                age: 30,
                hobbies: ['reading', 'coding'],
            });

            expect(users).toContainEqual(newUser);
        });

        it('should create multiple users with different properties', () => {
            const user1 = createUser('Alice', 25, ['hiking']);
            const user2 = createUser('Bob', 40, ['gardening', 'painting']);

            expect(users).toEqual([
                {
                    id: 'unique-id-12345',
                    username: 'Alice',
                    age: 25,
                    hobbies: ['hiking'],
                },
                {
                    id: 'unique-id-12345',
                    username: 'Bob',
                    age: 40,
                    hobbies: ['gardening', 'painting'],
                },
            ]);
        });
    });

    describe('updateUser', () => {
        it('should update the existing user data with provided fields', () => {
            const newUser = createUser('John Doe', 30, ['reading']);
            const updatedUser = updateUser({ age: 31, hobbies: ['hiking', 'reading'] }, newUser.id);

            expect(updatedUser).toEqual({
                id: newUser.id,
                username: 'John Doe',
                age: 31,
                hobbies: ['hiking', 'reading'],
            });

            expect(users[0]).toEqual(updatedUser);
        });

        it('should not update fields that are not provided', () => {
            const newUser = createUser('Jane Doe', 28, ['drawing']);
            const updatedUser = updateUser({ age: 29 }, newUser.id);

            expect(updatedUser).toEqual({
                id: newUser.id,
                username: 'Jane Doe',
                age: 29,
                hobbies: ['drawing'],
            });
        });
    });

    describe('deleteUser', () => {
        it('should delete a user by ID and return success true', () => {
            const newUser = createUser('John Doe', 30, ['reading']);
            const deleteResult = deleteUser(newUser.id);

            expect(deleteResult).toEqual({ success: true });
            expect(users).not.toContainEqual(newUser);
        });

        it('should return success false if the user ID does not exist', () => {
            const deleteResult = deleteUser('non-existent-id');

            expect(deleteResult).toEqual({ success: false });
            expect(users.length).toBe(0);
        });
    });
});
