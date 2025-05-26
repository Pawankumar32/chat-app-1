export function formatMessageTime(date) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
        throw new Error('Invalid date');
    }
    return parsedDate.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}