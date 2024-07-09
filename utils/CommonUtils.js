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

module.exports = {isNumber, removeWhiteSpace, getAddressToStoreCourseData}