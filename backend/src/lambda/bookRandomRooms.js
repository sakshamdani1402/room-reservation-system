import { HTTP_STATUS } from "../constants/index.js";
import { bookRamdomRoomsAsync } from "../logic/index.js";

export const handler = async () => {
    try {
        const bookedRooms = await bookRamdomRoomsAsync();
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

