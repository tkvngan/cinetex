import {User} from "cinetex-core/dist/domain/entities/User";
import {UsersQuery} from "cinetex-core/dist/application/queries";
import {UserRepository} from "./UserRepository";
import config from "../../config";
import {connectMongoDB, MongoDBRepositories} from "../../infrastructure/repositories/MongoDBRepositories";
import {Id, newObjectId} from "cinetex-core/dist/domain/types";
import {setObjectIdFactory} from "cinetex-core/dist/domain/types";
import {ObjectId} from "mongodb";
import {startMongoDBMemoryServer} from "../../infrastructure/repositories/MongoDBUtils";
import {MongoMemoryServer} from "mongodb-memory-server";

async function connectMongoDBServer(): Promise<void> {
    const options = {
        dbName: config.MONGODB_DBNAME,
        user: config.MONGODB_USER,
        pass: config.MONGODB_PASS,
    }
    console.log("Connecting to MongoDB with uri:", config.MONGODB_URI, "options:", JSON.stringify(options, null, 4), "...")
    await connectMongoDB(config.MONGODB_URI, options)
    console.log("Connected to MongoDB.")
}

setObjectIdFactory(() => new ObjectId().toString("hex"))

const testUsers: User[] = [
    {
        id: newObjectId(),
        email: 'testEmail',
        password: 'testPassword',
        emailVerified: false,
        firstName: 'Peter',
        lastName: 'testLastName',
        phoneNumber: 'testPhoneNumber',
        createdAt: new Date(),
        roles: ["user"],
    },
    {
        id: newObjectId(),
        email: 'testEmail2',
        password: 'testPassword2',
        emailVerified: false,
        firstName: 'Paul',
        lastName: 'testLastName2',
        phoneNumber: 'testPhoneNumber2',
        createdAt: new Date(),
        roles: ["user", "admin"],
    },
    {
        id: newObjectId(),
        email: 'testEmail3',
        password: 'testPassword3',
        emailVerified: false,
        firstName: 'Paul',
        lastName: 'testLastName3',
        phoneNumber: 'testPhoneNumber3',
        createdAt: new Date(),
        roles: ["admin"],
    },

]

const testUser4: User = {
    id: newObjectId(),
    email: 'testEmail4',
    password: 'testPassword4',
    emailVerified: false,
    firstName: 'testFirstName4',
    lastName: 'testLastName4',
    phoneNumber: 'testPhoneNumber4',
    createdAt: new Date(),
    roles: ["user", "admin"],
}

let mongoServer: MongoMemoryServer | null = null;
const repositories = MongoDBRepositories();

describe('Test UserRepository', () => {

    beforeAll(async () => {
        console.log("Starting MongoDB Memory Server...")
        await startMongoDBMemoryServer().then(async (server) => {
            mongoServer = server
        })
        await connectMongoDBServer()
        console.log("Started MongoDB Memory Server")
    })

    afterAll(async () => {
        if (mongoServer) {
            console.log("Stopping MongoDB Memory Server...")
            await mongoServer.stop()
            mongoServer = null
            console.log("Stopped MongoDB Memory Server")
        }
    })

    beforeEach(async () => {
        await repositories.User.deleteAllUsers()
        for (const user of testUsers) {
            await repositories.User.createUser(user)
        }
    })

    it.each([repositories.User])('getAllUsers returns an array of users', async (repository: UserRepository) => {
        const users = await repository.getAllUsers();
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(3);
        expect(users).toContainEqual(testUsers[0]);
        expect(users).toContainEqual(testUsers[1]);
        expect(users).toContainEqual(testUsers[2]);
    });

    it.each([repositories.User])('getUserById returns a user', async (repository: UserRepository) => {
        const user = await repository.getUserById(testUsers[0].id);
        expect(user).toEqual(testUsers[0]);
    });

    it.each([repositories.User])('getUserByEmail returns a user', async (repository: UserRepository) => {
        const user = await repository.getUserByEmail(testUsers[1].email);
        expect(user).toEqual(testUsers[1]);
    });

    it.each([repositories.User])('createUser creates a user', async (repository: UserRepository) => {
        const user = await repository.createUser(testUser4);
        expect(user).toEqual(testUser4);
    });

    it.each([repositories.User])('deleteUserById deletes a user', async (repository: UserRepository) => {
        const user: User | undefined = await repository.deleteUserById(testUsers[0].id);
        expect(user).toEqual(testUsers[0]);
        expect(await repository.getUserById(testUsers[0].id)).toBeUndefined();
        expect(await repository.getAllUsers()).toHaveLength(2);
    });

    it.each([repositories.User])('deleteUsersByQuery deletes users', async (repository: UserRepository) => {
        const query = {email: testUsers[0].email};
        const count = await repository.deleteUsersByQuery(query);
        expect(count).toEqual(1);
        expect(await repository.getUserById(testUsers[0].id)).toBeUndefined();
        expect(await repository.getAllUsers()).toHaveLength(2);
    });

    it.each([repositories.User])('updateUserById updates a user', async (repository: UserRepository) => {
        const updatedUser = {...testUsers[0], email: 'updatedEmail'};
        const user = await repository.updateUserById(updatedUser.id, updatedUser);
        expect(user).toEqual(updatedUser);
        const users = await repository.getAllUsers();
        expect(users).toHaveLength(3);
        expect(users).toContainEqual(updatedUser);
    });

    it.each([repositories.User])('queryUsers returns an array of users whose name is "Paul"', async (repository: UserRepository) => {
        const query: UsersQuery = {name: "Paul"};
        const users = await repository.queryUsers(query);
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(2);
        expect(users).toContainEqual(testUsers[1]);
        expect(users).toContainEqual(testUsers[2]);
    });

    it.each([repositories.User])('queryUsers returns an array of users whose name is "Peter"', async (repository: UserRepository) => {
        const query: UsersQuery = {name: "Peter"};
        const users = await repository.queryUsers(query);
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(1);
        expect(users).toContainEqual(testUsers[0]);
    });
});
