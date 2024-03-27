import {ScheduleRepository} from "../../../application/repositories/ScheduleRepository";
import {Schedule} from "cinetex-core/dist/domain/entities/Schedule";
import {getRepositoriesForTest} from "./ForTest";
import {clearTestData, loadTestData, testSchedules, testScheduleX, testTheatres} from "./Data";

describe.each(getRepositoriesForTest())('Test ScheduleRepository', (repositories) => {

    const repository: ScheduleRepository = repositories.Schedule;

    beforeEach(async () => {
        await clearTestData(repositories);
        await loadTestData(repositories);
    })

    test('deleteScheduleById should return the deleted schedule when found', async () => {
        const deletedSchedule = await repository.deleteScheduleById(testSchedules[1].id);
        expect(deletedSchedule).toMatchObject<Schedule>(testSchedules[1]);
    });

    test('deleteScheduleById should return undefined when not found', async () => {
        const deletedSchedule = await repository.deleteScheduleById(testScheduleX.id);
        expect(deletedSchedule).toBeUndefined();
    });

    test('deleteSchedulesByQuery should return the number of deleted schedules', async () => {
        const deletedCount = await repository.deleteSchedulesByQuery({
            movie: { name: {pattern: ".* strangers", options: "i"} }
        });
        expect(deletedCount).toEqual(1)
    });

    test('getAllSchedules should return an array of schedules', async () => {
        const schedules = await repository.getAllSchedules();
        expect(Array.isArray(schedules)).toBeTruthy();
        expect(schedules).toHaveLength(testSchedules.length);
        expect(schedules).toContainEqual(testSchedules[0]);
        expect(schedules).toContainEqual(testSchedules[1]);
    });

    test('getScheduleById should return a schedule when found', async () => {
        const schedule = await repository.getScheduleById(testSchedules[0].id);
        expect(schedule).toMatchObject<Schedule>(testSchedules[0]);
    });

    test('getScheduleById should return undefined when not found', async () => {
        const schedule = await repository.getScheduleById(testScheduleX.id);
        expect(schedule).toBeUndefined();
    });

    test('getSchedulesByQuery with id', async () => {
        const schedules = await repository.getSchedulesByQuery({ id: testSchedules[0].id});
        expect(Array.isArray(schedules)).toBeTruthy();
        expect(schedules).toHaveLength(1);
        expect(schedules).toContainEqual(testSchedules[0]);
    });

    test('getSchedulesByQuery with movie id and theatre id', async () => {
        const schedules = await repository.getSchedulesByQuery({
            movie: { id: testSchedules[0].movieId},
            theatre: { id: testSchedules[0].theatreId}
        });
        expect(Array.isArray(schedules)).toBeTruthy();
        expect(schedules).toHaveLength(1);
        expect(schedules).toContainEqual(testSchedules[0]);
    });

    test('getSchedulesByQuery with movie id only', async () => {
        const schedules = await repository.getSchedulesByQuery({
            movie: { id: testSchedules[0].movieId},
        });
        expect(Array.isArray(schedules)).toBeTruthy();
        expect(schedules).toHaveLength(1);
        expect(schedules).toContainEqual(testSchedules[0]);
    });

    test('getSchedulesByQuery with theatre id only', async () => {
        const schedules = await repository.getSchedulesByQuery({
            theatre: { id: testSchedules[0].theatreId}
        });
        expect(Array.isArray(schedules)).toBeTruthy();
        expect(schedules).toHaveLength(2);
        expect(schedules).toContainEqual(testSchedules[0]);
        expect(schedules).toContainEqual(testSchedules[1]);
    });

    test('getSchedulesByQuery with theatre name only', async () => {
        const schedules = await repository.getSchedulesByQuery({
            theatre: { name: "Cineplex - Yonge-Dundas and VIP"}
        });
        expect(Array.isArray(schedules)).toBeTruthy();
        expect(schedules).toHaveLength(2);
        expect(schedules).toContainEqual(testSchedules[0]);
        expect(schedules).toContainEqual(testSchedules[1]);
    });

    test('getSchedulesByQuery with movie name pattern matching', async () => {
        const schedules = await repository.getSchedulesByQuery({
            movie: { name: {pattern: ".* strangers", options: "i"} }
        });
        expect(Array.isArray(schedules)).toBeTruthy();
        expect(schedules).toHaveLength(1);
        expect(schedules).toContainEqual(testSchedules[0]);
    }, 60000);

    test('getSchedulesByQuery with exact show date', async () => {
        const schedules = await repository.getSchedulesByQuery({
            showDate: testSchedules[0].showTimes[0].date
        });
        expect(Array.isArray(schedules)).toBeTruthy();
        expect(schedules).toHaveLength(1);
        expect(schedules).toContainEqual(testSchedules[0]);
    });

    test('getSchedulesByQuery with exact show date and time', async () => {
        const schedules = await repository.getSchedulesByQuery({
            showDate: testSchedules[0].showTimes[0].date,
            showTime: testSchedules[0].showTimes[0].times[0]
        });
        expect(Array.isArray(schedules)).toBeTruthy();
        expect(schedules).toHaveLength(1);
        expect(schedules).toContainEqual(testSchedules[0]);
    });

    test('getSchedulesByQuery with range of show dates', async () => {
        const schedules = await repository.getSchedulesByQuery({
            showDate: {min: "2000-01-01", max: "2050-12-31"},
        });
        expect(Array.isArray(schedules)).toBeTruthy();
        expect(schedules).toHaveLength(2);
        expect(schedules).toContainEqual(testSchedules[0]);
        expect(schedules).toContainEqual(testSchedules[1]);
    });

    test('getSchedulesByQuery with missing range of show dates', async () => {
        const schedules = await repository.getSchedulesByQuery({
            showDate: {min: "2000-01-01", max: "2000-12-31"},
        });
        expect(Array.isArray(schedules)).toBeTruthy();
        expect(schedules).toHaveLength(0);
    });

    test('updateScheduleById should update and return the schedule when found', async () => {
        const updatedSchedule = await repository.updateScheduleById(testSchedules[0].id, { screenId: 999 });
        expect(updatedSchedule).toMatchObject<Schedule>({...testSchedules[0], screenId: 999});
        const schedules = await repository.getAllSchedules();
        expect(schedules).toHaveLength(testSchedules.length);
        expect(schedules).toContainEqual(updatedSchedule);
    });

    test('updateScheduleById should return undefined when not found', async () => {
        const updatedSchedule = await repository.updateScheduleById(testScheduleX.id, { screenId: 999 });
        expect(updatedSchedule).toBeUndefined();
    });

    test('addSchedule should return the added schedule', async () => {
        const addedSchedule = await repository.addSchedule(testScheduleX);
        expect(addedSchedule).toMatchObject<Schedule>(testScheduleX);
    });

});
