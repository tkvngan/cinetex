import {User} from "cinetex-core/dist/domain/entities/User";
import {UsersQuery} from "cinetex-core/dist/application/queries";
import {clearTestData, loadTestData, testUsers, testUserX} from "./Data";
import {getRepositoriesForTest} from "./ForTest";

describe.each(getRepositoriesForTest())('Test UserRepository', (repositories) => {

    const repository = repositories.User;

    beforeEach(async () => {
        await clearTestData(repositories);
        await loadTestData(repositories);
    })


    test('getAllUsers returns an array of users', async () => {
        const users = await repository.getAllUsers();
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(3);
        expect(users).toContainEqual(testUsers[0]);
        expect(users).toContainEqual(testUsers[1]);
        expect(users).toContainEqual(testUsers[2]);
    });

    test('getUserById returns a user', async () => {
        const user = await repository.getUserById(testUsers[0].id);
        expect(user).toEqual(testUsers[0]);
    });

    test('getUserByEmail returns a user', async () => {
        const user = await repository.getUserByEmail(testUsers[1].email);
        expect(user).toEqual(testUsers[1]);
    });

    test('createUser creates a user', async () => {
        const user = await repository.createUser(testUserX);
        expect(user).toEqual(testUserX);
    });

    test('deleteUserById deletes a user', async () => {
        const user: User | undefined = await repository.deleteUserById(testUsers[0].id);
        expect(user).toEqual(testUsers[0]);
        expect(await repository.getUserById(testUsers[0].id)).toBeUndefined();
        expect(await repository.getAllUsers()).toHaveLength(2);
    });

    test('deleteAllUsers deletes all users', async () => {
        const count = await repository.deleteAllUsers();
        expect(count).toEqual(3);
        expect(await repository.getAllUsers()).toHaveLength(0);
    });

    test('deleteUsersByQuery deletes users', async () => {
        const query = {email: testUsers[0].email};
        const count = await repository.deleteUsersByQuery(query);
        expect(count).toEqual(1);
        expect(await repository.getUserById(testUsers[0].id)).toBeUndefined();
        expect(await repository.getAllUsers()).toHaveLength(2);
    });

    test('updateUserById updates a user', async () => {
        const updatedUser = {...testUsers[0], email: 'updatedEmail'};
        const user = await repository.updateUserById(updatedUser.id, updatedUser);
        expect(user).toEqual(updatedUser);
        const users = await repository.getAllUsers();
        expect(users).toHaveLength(3);
        expect(users).toContainEqual(updatedUser);
    });

    test('queryUsers returns an array of users whose name is "Paul"', async () => {
        const query: UsersQuery = {name: "Paul"};
        const users = await repository.queryUsers(query);
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(2);
        expect(users).toContainEqual(testUsers[1]);
        expect(users).toContainEqual(testUsers[2]);
    });

    test('queryUsers returns an array of users whose name is "Peter"', async () => {
        const query: UsersQuery = {name: "Peter"};
        const users = await repository.queryUsers(query);
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(1);
        expect(users).toContainEqual(testUsers[0]);
    });
});
