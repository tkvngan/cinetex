import {getRepositoriesForTest} from "../test-setup";
import {clearTestData, loadTestData, testBookings, testBookingX} from "../test-data";
import {Booking} from "cinetex-core/dist/domain/entities/Booking";

function removeTemporaryFields(booking?: Booking): Booking | undefined {
    if (!booking) return booking;
    booking.tickets.forEach(ticket => {
        delete (ticket as any).ticketNo;
        delete (ticket as any).token;
    })
    return booking;
}

function removeAllTemporaryFields(bookings: Booking[]): Booking[] {
    bookings.forEach(booking => {
        booking.tickets.forEach(ticket => {
            delete (ticket as any).ticketNo;
            delete (ticket as any).token;
        })
    })
    return bookings;
}

describe.each(getRepositoriesForTest())('BookingRepository', (repositories) => {

    const repository = repositories.Booking;

    beforeEach(async () => {
        await clearTestData(repositories);
        await loadTestData(repositories);
    })

    test('getAllBookings returns all bookings', async () => {
        const bookings = await repository.getAllBookings();
        removeAllTemporaryFields(bookings);
        expect(bookings).toHaveLength(testBookings.length);
        for (const booking of testBookings) {
            expect(bookings).toContainEqual(booking);
        }
    });

    test('getBookingById returns a booking by id', async () => {
        const booking = await repository.getBookingById(testBookings[0].id);
        removeTemporaryFields(booking)
        expect(booking).toEqual(testBookings[0]);
    });

    test('getBookingsByUserId returns bookings by user id', async () => {
        const bookings = await repository.getBookingsByUserId(testBookings[1].userId);
        removeAllTemporaryFields(bookings);
        expect(bookings).toHaveLength(1);
        expect(bookings).toContainEqual(testBookings[1]);
    });

    test('getBookingsByTheatreId returns bookings by theatre id', async () => {
        const bookings = await repository.getBookingsByTheatreId(testBookings[0].theatreId);
        removeAllTemporaryFields(bookings);
        expect(bookings).toHaveLength(1);
        expect(bookings).toContainEqual(testBookings[0]);
    });

    test('getBookingsByMovieId returns bookings by movie id', async () => {
        const bookings = await repository.getBookingsByMovieId("6563a43f92c740d467db925b");
        removeAllTemporaryFields(bookings);
        expect(bookings).toHaveLength(1);
        expect(bookings).toContainEqual(testBookings[0]);
    });

    test('addBooking adds a booking', async () => {
        const booking = await repository.addBooking(testBookingX);
        removeTemporaryFields(booking);
        expect(booking).toEqual(testBookingX);
        const bookings = await repository.getAllBookings();
        removeAllTemporaryFields(bookings);
        expect(bookings).toHaveLength(testBookings.length + 1);
        expect(bookings).toContainEqual(testBookingX);
        for (const booking of testBookings) {
            expect(bookings).toContainEqual(booking);
        }
    });

    test('deleteBookingById deletes a booking by id', async () => {
        const booking = await repository.deleteBookingById(testBookings[0].id);
        removeTemporaryFields(booking);
        expect(booking).toEqual(testBookings[0]);
        expect(await repository.getBookingById(testBookings[0].id)).toBeUndefined();
        const bookings = await repository.getAllBookings();
        removeAllTemporaryFields(bookings);
        expect(bookings).toHaveLength(testBookings.length - 1);
        expect(bookings).not.toContainEqual(testBookings[0]);
    });

    test('deleteBookingsByQuery deletes bookings by query', async () => {
        const result = await repository.deleteBookingsByQuery({ id: testBookings[0].id});
        expect(result).toEqual(1);
    });

    test('updateBookingById updates a booking by id', async () => {
        const booking = await repository.updateBookingById(testBookings[1].id, {totalPrice: 1000});
        removeTemporaryFields(booking)
        expect(booking).toEqual({...testBookings[1], totalPrice: 1000});
        const bookings = await repository.getAllBookings();
        removeAllTemporaryFields(bookings);
        expect(bookings).toHaveLength(testBookings.length);
        expect(bookings).toContainEqual({...testBookings[1], totalPrice: 1000});
    });

    test('getBookingsByQuery gets bookings by query', async () => {
        const bookings = await repository.getBookingsByQuery({});
        removeAllTemporaryFields(bookings);
        expect(bookings).toHaveLength(testBookings.length);
        for (const booking of testBookings) {
            expect(bookings).toContainEqual(booking);
        }

    });
});
