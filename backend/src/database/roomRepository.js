import { db } from "./index.js"

export const getRoomsAsync = async (args) => {
    const { status } = args;
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM hotel_rooms WHERE is_booked = ${status} ORDER BY room_number ASC`, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    })
}

export const getAllAsync = async () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM hotel_rooms ORDER BY room_number ASC`, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    })
}

export const bookRoomsAsync = async (args) => {
    const { roomIds } = args || {};
    return new Promise((resolve, reject) => {
        db.query(`UPDATE hotel_rooms SET is_booked = 1 WHERE id IN (${roomIds.join(',')})`, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    })
}

export const clearAllBookingsAsync = async () => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE hotel_rooms SET is_booked = 0 where is_booked = 1`, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    })
}
