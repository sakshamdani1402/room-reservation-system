export const API_URL = 'https://kxu3ton0m1.execute-api.ap-south-1.amazonaws.com/dev';

export function toggleLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    const roomGrid = document.getElementById('roomGrid');
    if (!spinner || !roomGrid) return;

    spinner.style.display = show ? 'block' : 'none';
    roomGrid.style.display = show ? 'none' : 'block';
}

export function handleError(error, message) {
    console.error(message, error);
    alert(message);
    toggleLoading(false);
}

export function validateRoomCount(count) {
    if (!count || count <= 0 || count > 5) {
        alert('Please enter a number between 1 and 5');
        return false;
    }
    return true;
}

export async function handleApiResponse(response) {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return JSON.parse(data.body);
}
