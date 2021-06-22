export function formatTime(ms: number) {
    var remaining = ms;
    var times = [];
    var result = null;

    var days = Math.floor(remaining / 1000 / 60 / 60 / 24);
    if (days > 0) {
        remaining -= days * 1000 * 60 * 60 * 24;
        times.push(`${days} day${days > 1 ? "s" : ""}`);
    }
    var hours = Math.floor(remaining / 1000 / 60 / 60);
    if (hours > 0) {
        remaining -= hours * 1000 * 60 * 60;
        times.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    }
    var minutes = Math.floor(remaining / 1000 / 60);
    if (minutes > 0) {
        remaining -= minutes * 1000 * 60;
        times.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    }
    var seconds = Math.floor(remaining / 1000);
    if (seconds > 0) {
        remaining -= seconds * 1000;
        times.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
    }
    var ms = Math.floor(remaining);

    times = times.reverse();

    switch (times.length) {
        case 0:
            result = `${ms}ms`
            break;
        case 1:
            result = `${times[0]}`;
            break;
        case 2:
            result = `${times[1]} and ${times[0]}`;
            break;
        case 3:
            result = `${times[2]}, ${times[1]} and ${times[0]}`;
            break;
        case 4:
            result = `${times[3]}, ${times[2]}, ${times[1]} and ${times[0]}`;
            break;
    }

    return result;
}

export default formatTime