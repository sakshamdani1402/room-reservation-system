import { db } from "./index.js"

export const getRoomsAsync = async ({ status }) => {
    const [rows] = await db.execute(
        `SELECT * FROM hotel_rooms WHERE is_booked = ${status} ORDER BY room_number ASC`,
    );
    return rows;
};

export const getAllAsync = async () => {
    const [rows] = await db.execute('SELECT * FROM hotel_rooms ORDER BY room_number ASC');
    return rows;
};

export const bookRoomsAsync = async ({ roomIds }) => {
    const [result] = await db.execute(
        `UPDATE hotel_rooms SET is_booked = 1 WHERE id IN (${roomIds.join(",")})`,
    );
    return result;
};

export const clearAllBookingsAsync = async () => {
    const [result] = await db.execute(
        'UPDATE hotel_rooms SET is_booked = 0 WHERE is_booked = 1'
    );
    return result;
};