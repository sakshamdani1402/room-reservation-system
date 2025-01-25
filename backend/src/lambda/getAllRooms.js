import { HTTP_STATUS } from "../constants/index.js";
import { getAllRoomsAsync } from "../logic/index.js";

export const handler = async () => {
    try {
        const rooms = await getAllRoomsAsync();
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify({ rooms })
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: HTTP_STATUS.INTERNAL,
            body: JSON.stringify({ rooms: [], message: "Something went wrong." })
        }

    }
};
