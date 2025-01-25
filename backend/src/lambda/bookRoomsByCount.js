import { HTTP_STATUS } from "../constants/index.js";
import { bookRoomsByCountAsync } from "../logic/index.js";

export const handler = async (event) => {
    const { countOfRooms } = JSON.parse(event.body);
    if (countOfRooms === 0) {
        return {
            statusCode: 200,
            body: JSON.stringify({ bookingSuccess: true, message: "Number of rooms to book must be greater than 0." })
        }
    }
    try {
        console.log(countOfRooms);

        const bookedRooms = await bookRoomsByCountAsync({ count: countOfRooms });
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

handler({ body: JSON.stringify({ countOfRooms: 5 }) }).then(console.log).catch(console.error);
