var visits = require('./visits');
var functions = require('./functions');
var state = require('./state');

var events = function () {

	$(window).bind('hashchange', function () {
		var hash = window.location.hash;
		
		if (hash) functions.initiateSelection(window.location.hash);
		else {
			functions.unselectCountry();
			$('.main-content').removeClass('loaded');
			$('.hide-details-btn').removeClass('is-visible');
		}
	});
	
	$( window ).resize(function() {
		setCountryHeader()  // Meh!
	});

	$('.hide-details-btn').on('click', function () {
		state.asideSelectedYear.prop('checked', true);
		window.location.hash = '';
		history.pushState("", document.title, window.location.pathname + window.location.search);
	});

	$('.aside__trips input[type="radio"]').on('click', function (e) {
		state.asideSelectedYear = $(e.target);
	});

	$('svg#worldmap g path').on('click', function (e) {
		e.preventDefault();
		
		if (visits[e.target.id]) {
			window.location.hash = e.target.id;
			setCountryHeader();
		}
	});

	setTimeout( function () {
		var hash = window.location.hash;
		if (hash) {
			functions.initiateSelection(hash);
			setCountryHeader();
		}
	}, 500);

	$('.main-content').on("scroll", function () {
		if ($(this).scrollTop() > 100) {
			state.$countryHeader.addClass('scrolling');
		} else {
			state.$countryHeader.removeClass('scrolling');
		}
	});
	
}();

function setCountryHeader() {
	state.$countryHeader.innerWidth($('.visits').innerWidth());
}

module.exports = events;