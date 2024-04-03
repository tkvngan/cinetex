import {getRepositoriesForTest} from "../test-setup";
import {newObjectId} from "cinetex-core/dist/domain/types";
import {clearTestData, loadTestData, testTheatres, testTheatreX} from "../test-data";
import {Theatre} from "cinetex-core/dist/domain/entities/Theatre";

describe.each(getRepositoriesForTest())('TheatreRepository', (repositories) => {

    const repository = repositories.Theatre;

    beforeEach(async () => {
       await clearTestData(repositories);
       await loadTestData(repositories);
    })

    test('getAllTheatres should return an array of theatres', async () => {
        const theatres = await repository.getAllTheatres();
        expect(Array.isArray(theatres)).toBeTruthy();
        expect(theatres).toHaveLength(testTheatres.length);
        for (const theatre of testTheatres) {
            expect(theatres).toContainEqual(theatre);
        }
    });

    test('getTheatreById should return a theatre when found', async () => {
        const theatre = await repository.getTheatreById(testTheatres[0].id);
        expect(theatre).toEqual<Theatre>(testTheatres[0]);
    });

    test('getTheatreById should return undefined when not found', async () => {
        const theatre = await repository.getTheatreById(newObjectId());
        expect(theatre).toBeUndefined();
    });

    test('getTheatreByName should return a theatre when found', async () => {
        const theatre = await repository.getTheatreByName(testTheatres[1].name);
        expect(theatre).toMatchObject<Theatre>(testTheatres[1]);
    });

    test('getTheatreByName should return undefined when not found', async () => {
        const theatre = await repository.getTheatreByName('Hello World');
        expect(theatre).toBeUndefined();
    });

    test('addTheatre should return the added theatre', async () => {
        const addedTheatre = await repository.addTheatre(testTheatreX);
        expect(addedTheatre).toMatchObject<Theatre>(testTheatreX);
        const theatres = await repository.getAllTheatres();
        for (const theatre of testTheatres) {
            expect(theatres).toContainEqual(theatre);
        }
        expect(theatres).toContainEqual(testTheatreX);
    });

    test('deleteTheatreById should return the deleted theatre when found', async () => {
        const deletedTheatre = await repository.deleteTheatreById(testTheatres[0].id);
        expect(deletedTheatre).toMatchObject<Theatre>(testTheatres[0]);
    });

    test('deleteTheatreById should return undefined when not found', async () => {
        const deletedTheatre = await repository.deleteTheatreById(newObjectId());
        expect(deletedTheatre).toBeUndefined();
    });

    test('deleteTheatreByName should return the deleted theatre when found', async () => {
        const deletedTheatre = await repository.deleteTheatreByName(testTheatres[0].name);
        expect(deletedTheatre).toMatchObject<Theatre>(testTheatres[0]);
        const theatres = await repository.getAllTheatres();
        expect(theatres).toHaveLength(testTheatres.length - 1);
        expect(theatres).not.toContainEqual(testTheatres[0]);
    });

    test('deleteTheatreByName should return undefined when not found', async () => {
        const deletedTheatre = await repository.deleteTheatreByName('Hello World');
        expect(deletedTheatre).toBeUndefined();
    });

    test('deleteTheatresByQuery should return the number of deleted theatres', async () => {
        const deletedCount = await repository.deleteTheatresByQuery({});
        expect(deletedCount).toEqual(testTheatres.length);
    });

    test('updateTheatreById should update and return the theatre when found', async () => {
        const updatedTheatre = await repository.updateTheatreById(testTheatres[1].id, { name: 'updatedName' });
        expect(updatedTheatre).toMatchObject<Theatre>({...testTheatres[1], name: 'updatedName'});
        const theatres = await repository.getAllTheatres();
        expect(theatres).toHaveLength(testTheatres.length);
        expect(theatres).toContainEqual(updatedTheatre);
    });

    test('updateTheatreById should return undefined when not found', async () => {
        const updatedTheatre = await repository.updateTheatreById(newObjectId() , { phone: '417-555-0113'});
        expect(updatedTheatre).toBeUndefined();
    });

    test('getTheatresByQuery should return an array of theatres matching the query', async () => {
        const theatres = await repository.getTheatresByQuery({ name: testTheatres[0].name });
        expect(Array.isArray(theatres)).toBeTruthy();
        expect(theatres).toHaveLength(1);
        expect(theatres).toContainEqual(testTheatres[0]);
    });
});
