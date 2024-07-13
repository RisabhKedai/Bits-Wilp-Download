function isNumber(value) {
    return !isNaN(value) && typeof value === 'number';
}

function removeWhiteSpace(string) {
    const whitespaceRegex = /\s+/g;
    return string.replace(whitespaceRegex, ' ');
}

function getAddressToStoreCourseData(courseId) {
    return `./data/${courseId}.json`
}

function parseContentDisposition(header) {
    const result = {};
    
    if (!header || typeof header !== 'string') {
        return result;
    }
    const parts = header.split(';');
    result.disposition = parts[0].trim();

    for (let i = 1; i < parts.length; i++) {
        const part = parts[i].trim();
        const [key, value] = part.split('=');
        if (key && value) {
            result[key.trim()] = value.trim().replace(/^"|"$/g, '');
        }
    }
    return result;
}

module.exports = {isNumber, removeWhiteSpace, getAddressToStoreCourseData, parseContentDisposition}