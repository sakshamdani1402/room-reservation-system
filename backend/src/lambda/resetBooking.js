import { HTTP_STATUS } from "../constants/index.js";
import { resetBookingAsync } from "../logic/index.js";

export const handler = async () => {
    try {
        const success = await resetBookingAsync();
        if (!success) {
            return {
                statusCode: HTTP_STATUS.INTERNAL,
                body: JSON.stringify({ resetSuccess: success, message: "Could not Reset rooms." })
            }
        }
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify({ resetSuccess: success, message: "Rooms reset successfully." })
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: HTTP_STATUS.INTERNAL,
            body: JSON.stringify({ resetSuccess: false, message: "Something went wrong." })
        }

    }
};
