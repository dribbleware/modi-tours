var state = function () {
    return {
        isTouchDevice : 'ontouchstart' in document.documentElement,
        asideSelectedYear : null,
        $countryHeader : $('.details .title')
    }
}();

module.exports = state;