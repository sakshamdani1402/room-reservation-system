const API_URL = 'https://kxu3ton0m1.execute-api.ap-south-1.amazonaws.com/dev';

async function loadRooms() {
    try {
        const response = await fetch(`${API_URL}/get-all-rooms`);
        const data = await response.json();
        const body = JSON.parse(data.body)
        displayRooms(body.rooms);
    } catch (error) {
        console.error('Failed to load rooms:', error);
        alert('Failed to load rooms');
    }
}

function displayRooms(rooms) {
    const roomGrid = document.getElementById('roomGrid');
    roomGrid.innerHTML = '';

    // Group rooms by floor
    const roomsByFloor = rooms.reduce((acc, room) => {
        acc[room.floor_number] = acc[room.floor_number] || [];
        acc[room.floor_number].push(room);
        return acc;
    }, {});

    // Create floor containers
    for (let floor = 1; floor <= 10; floor++) {
        const floorContainer = document.createElement('div');
        floorContainer.className = 'floor-container';
        floorContainer.innerHTML = `<h5>Floor ${floor}</h5>`;

        const floorRooms = roomsByFloor[floor] || [];
        floorRooms.sort((a, b) => a.room_number - b.room_number);

        floorRooms.forEach(room => {
            const roomBox = document.createElement('div');
            roomBox.className = `room-box ${room.is_booked ? 'booked' : ''}`;
            roomBox.textContent = `Room ${room.room_number}`;
            floorContainer.appendChild(roomBox);
        });

        roomGrid.appendChild(floorContainer);
    }
}

async function bookRooms() {
    const count = document.getElementById('roomCount').value;
    try {
        const response = await fetch(`${API_URL}/book-rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ countOfRooms: parseInt(count) })
        });
        const data = await response.json();
        loadRooms();
    } catch (error) {
        console.error('Booking failed:', error);
        alert('Booking failed');
    }
}

async function generateRandomBookings() {
    try {
        await fetch(`${API_URL}/book-random-rooms`, { method: 'POST' });
        loadRooms();
    } catch (error) {
        console.error('Random booking failed:', error);
        alert('Random booking failed');
    }
}

async function resetBookings() {
    try {
        await fetch(`${API_URL}/reset-rooms`, { method: 'PUT' });
        loadRooms();
    } catch (error) {
        console.error('Reset failed:', error);
        alert('Reset failed');
    }
}

// Load rooms when page loads
document.addEventListener('DOMContentLoaded', loadRooms);