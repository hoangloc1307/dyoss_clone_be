function RemoveSpecialCharacters(str) {
    return str.replace(/[^\w\s]/gi, '');
}

module.exports = { RemoveSpecialCharacters };
