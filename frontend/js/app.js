import { API_URL, toggleLoading, handleError, validateRoomCount, handleApiResponse } from './utils.js';
import { updateRoomStatus, displayRooms } from "./room-service.js";

export async function loadRooms() {
    document.getElementById('bookRoomsBtn').addEventListener('click', bookRooms);
    document.getElementById('generateRandomBtn').addEventListener('click', generateRandomBookings);
    document.getElementById('resetBtn').addEventListener('click', resetBookings);
    try {
        toggleLoading(true);
        const response = await fetch(`${API_URL}/get-all-rooms`);
        const body = await handleApiResponse(response);
        displayRooms(body.rooms);
    } catch (error) {
        handleError(error, 'Failed to load rooms');
    } finally {
        toggleLoading(false);
    }
}

export async function bookRooms() {
    const count = document.getElementById('roomCount')?.value;
    if (!validateRoomCount(count)) return;

    try {
        toggleLoading(true);
        const response = await fetch(`${API_URL}/book-rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body: JSON.stringify({ roomCount: parseInt(count) }) })
        });
        const body = await handleApiResponse(response);

        if (body.bookedRooms?.length) {
            updateRoomStatus(body.bookedRooms.map(room => room.id), true);
        }
    } catch (error) {
        handleError(error, 'Booking failed');
    }
    finally {
        toggleLoading(false);
    }
}

export async function generateRandomBookings() {
    try {
        toggleLoading(true);
        const response = await fetch(`${API_URL}/book-random-rooms`, {
            method: 'POST'
        });
        const body = await handleApiResponse(response);

        if (body.bookedRooms?.length) {
            updateRoomStatus(body.bookedRooms, true);
        }
    } catch (error) {
        handleError(error, 'Random booking failed');
    }
    finally {
        toggleLoading(false);
    }
}

export async function resetBookings() {
    try {
        toggleLoading(true);
        await fetch(`${API_URL}/reset-rooms`, { method: 'PUT' });
        document.querySelectorAll('.room-box.booked, .room-box.already-booked')
            .forEach(element => {
                element.className = 'room-box';
            });
    } catch (error) {
        handleError(error, 'Reset failed');
    } finally {
        toggleLoading(false);
    }
}

document.addEventListener('DOMContentLoaded', loadRooms);