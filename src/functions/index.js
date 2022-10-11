function RemoveSpecialCharacters(str) {
    return str.replace(/[^\w\s,.-]/gi, '').replace(/-{2,}/gi, '-');
}

export { RemoveSpecialCharacters };
