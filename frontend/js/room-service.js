export function updateRoomStatus(roomIds, isBooked) {
    if (!Array.isArray(roomIds)) return;

    roomIds.forEach(id => {
        const roomElement = document.querySelector(`#room-${id}`);
        if (roomElement) {
            roomElement.className = `room-box ${isBooked ? 'booked' : ''}`;
        }
    });
}

export function displayRooms(rooms) {
    if (!Array.isArray(rooms)) return;

    const roomGrid = document.getElementById('roomGrid');
    if (!roomGrid) return;

    roomGrid.innerHTML = '';
    const roomsByFloor = groupRoomsByFloor(rooms);

    for (let floor = 1; floor <= 10; floor++) {
        const floorContainer = createFloorContainer(floor, roomsByFloor[floor] || []);
        roomGrid.appendChild(floorContainer);
    }
}

function groupRoomsByFloor(rooms) {
    return rooms.reduce((acc, room) => {
        acc[room.floor_number] = acc[room.floor_number] || [];
        acc[room.floor_number].push(room);
        return acc;
    }, {});
}

function createFloorContainer(floor, rooms) {
    const container = document.createElement('div');
    container.className = 'floor-container';
    container.innerHTML = `<h5>Floor ${floor}</h5>`;

    rooms.sort((a, b) => a.room_number - b.room_number)
        .forEach(room => {
            container.appendChild(createRoomElement(room));
        });

    return container;
}

function createRoomElement(room) {
    const roomBox = document.createElement('div');
    roomBox.id = `room-${room.id}`;
    roomBox.className = `room-box ${room.is_booked ? 'already-booked' : ''}`;
    roomBox.textContent = `Room ${room.room_number}`;
    return roomBox;
}