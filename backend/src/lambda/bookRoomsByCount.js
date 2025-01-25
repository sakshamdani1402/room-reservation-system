import { HTTP_STATUS } from "../constants/index.js";
import { bookRoomsByCountAsync } from "../logic/index.js";

export const handler = async (event) => {
    const { roomCount } = JSON.parse(event);
    if (roomCount === 0) {
        return {
            statusCode: 200,
            body: JSON.stringify({ bookingSuccess: true, message: "Number of rooms to book must be greater than 0." })
        }
    }
    try {
        console.log(roomCount);

        const bookedRooms = await bookRoomsByCountAsync({ count: roomCount });
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify({ bookingSuccess: true, message: "Rooms booked successfully.", bookedRooms })
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: HTTP_STATUS.INTERNAL,
            body: JSON.stringify({ bookingSuccess: false, message: "An error occurred while booking rooms." })
        }

    }
};