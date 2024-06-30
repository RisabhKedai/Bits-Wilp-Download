function isNumber(value) {
    return !isNaN(value) && typeof value === 'number';
}

module.exports = {isNumber}