import { BOOKING_LIMIT, HTTP_STATUS, ROOM_BOOKING_STATUS } from "../constants/index.js";
import { bookRoomsAsync, clearAllBookingsAsync, getAllAsync, getRoomsAsync } from "../database/roomRepository.js";
import { isNullOrEmptyList } from "../utils/index.js";

const getTravelTime = (roomA, roomB) => {
    if (!roomA || !roomB) return 0;

    // If rooms are on the same floor
    if (roomA.floor_number === roomB.floor_number) {
        return Math.abs(roomA.room_position - roomB.room_position);
    }

    // Different floors: Calculate path via stairs
    // 1. Distance to stairs (first room is position 1)
    const distanceToStairsA = roomA.room_position - 1;
    // 2. Vertical travel (2 points per floor)
    const verticalDistance = Math.abs(roomA.floor_number - roomB.floor_number) * 2;
    // 3. Distance from stairs to destination room
    const distanceFromStairsB = roomB.room_position - 1;

    return distanceToStairsA + verticalDistance + distanceFromStairsB;
};

const findBestRooms = (unbookedRooms, count) => {
    // Group rooms by floor
    const roomsByFloor = unbookedRooms.reduce((acc, room) => {
        acc[room.floor_number] = acc[room.floor_number] || [];
        acc[room.floor_number].push(room);
        return acc;
    }, {});

    // First try to find rooms on the same floor
    for (const floor in roomsByFloor) {
        if (roomsByFloor[floor].length >= count) {
            // Sort rooms by room number to get adjacent rooms
            const sortedRooms = roomsByFloor[floor].sort((a, b) =>
                a.room_number - b.room_number
            );

            // Find the sequence with minimum travel time
            let minTravelTime = Infinity;
            let bestRooms = [];

            for (let i = 0; i <= sortedRooms.length - count; i++) {
                const currentRooms = sortedRooms.slice(i, i + count);
                let totalTime = 0;

                for (let j = 1; j < currentRooms.length; j++) {
                    totalTime += getTravelTime(currentRooms[j - 1], currentRooms[j]);
                }

                if (totalTime < minTravelTime) {
                    minTravelTime = totalTime;
                    bestRooms = currentRooms;
                }
            }

            if (bestRooms.length === count) {
                return { rooms: bestRooms, travelTime: minTravelTime };
            }
        }
    }

    // If no single floor has enough rooms, find best combination across floors
    let allPossibleCombinations = [];
    const sortedFloors = Object.keys(roomsByFloor).sort((a, b) => a - b);

    for (let i = 0; i < sortedFloors.length; i++) {
        let currentRooms = [];
        let remainingCount = count;

        for (let j = i; j < sortedFloors.length && remainingCount > 0; j++) {
            const floorRooms = roomsByFloor[sortedFloors[j]]
                .sort((a, b) => a.room_number - b.room_number);
            currentRooms.push(...floorRooms.slice(0, remainingCount));
            remainingCount -= floorRooms.length;
        }

        if (currentRooms.length === count) {
            let totalTime = 0;
            for (let k = 1; k < currentRooms.length; k++) {
                totalTime += getTravelTime(currentRooms[k - 1], currentRooms[k]);
            }
            allPossibleCombinations.push({
                rooms: currentRooms,
                travelTime: totalTime
            });
        }
    }

    return allPossibleCombinations.sort((a, b) => a.travelTime - b.travelTime)[0];
};

export const bookRoomsByCountAsync = async (args) => {
    if (!args || args.count < 1 || args.count > BOOKING_LIMIT) {
        throw Error(`Invalid room count. Must be between 1 and ${BOOKING_LIMIT}`);
    }

    const { count } = args;
    const unbookedRooms = await getRoomsAsync({ status: ROOM_BOOKING_STATUS.UNBOOKED });

    if (isNullOrEmptyList(unbookedRooms) || unbookedRooms.length < count) {
        return {
            status: HTTP_STATUS.NOT_ALLOWED,
            message: "Not enough rooms available"
        };
    }

    const bestBooking = findBestRooms(unbookedRooms, count);

    if (!bestBooking) {
        return {
            status: HTTP_STATUS.NOT_ALLOWED,
            message: "Could not find suitable rooms"
        };
    }

    await bookRoomsAsync({ roomIds: bestBooking.rooms.map(room => room.id) });
    return {
        status: HTTP_STATUS.OK,
        data: {
            rooms: bestBooking.rooms,
            totalTravelTime: bestBooking.travelTime
        }
    };
};

export const resetBookingAsync = async () => {
    const result = await clearAllBookingsAsync();
    return result.affectedRows > 0;
}

export const bookRamdomRoomsAsync = async () => {
    const unbookedRooms = await getRoomsAsync({ status: ROOM_BOOKING_STATUS.UNBOOKED });
    if (isNullOrEmptyList(unbookedRooms)) {
        return false;
    }
    const roomsToBook = Math.min(BOOKING_LIMIT, unbookedRooms.length);
    const randomIds = new Set();
    while (randomIds.size < roomsToBook) {
        randomIds.add(Math.floor(Math.random() * unbookedRooms.length));
    }
    const roomIds = Array.from(randomIds);
    const result = await bookRoomsAsync({ roomIds });
    if (result.affectedRows <= 0) {
        throw Error("Failed to book rooms");
    }
    console.log("randomly booking rooms:" + roomIds.join(","));
    return roomIds;
}

export const getAllRoomsAsync = async () => {
    const rooms = await getAllAsync();
    return rooms;
}