var props = require('./props');
var state = require('./state');
var visits = require('./visits');

var functions = function() {
	
	var country = props.country;
	var trips = props.trips;

	var initiateSelection = function (hash) {
		country.id = hash.substring(1);

		if ($('#' + country.id).hasClass('visited')) {
			$('.main-content').removeClass('loaded');
			selectCountry(country.id);
		}
	};
	var unselectCountry = function() {
		$('.visits').html('');
		$('.selected').removeClass('selected');
	};
	var selectCountry = function() {
		unselectCountry();
		$('#' + country.id).addClass('selected');

		country.name = $('path#' + country.id).attr('title');
		country.visits = visits[country.id];
		displayDetails();
		state.$countryHeader.innerWidth($('.visits').innerWidth());
	};
	var calcMonthYear = function(date) {
		var months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		var month = parseInt(date.substr(3,2)),
			year = date.substr(6);

		if (country.visits.length <= 3) {
			monthYear = months[month] + " " + year;
		} else {
			monthYear = month + "/" + year;
		}

		return monthYear;
	};
	var displayDetails = function () {
		$('.country-name').html(country.name);
		$('.country-flag').attr('src', 'http://www.geonames.org/flags/x/' + country.id.toLowerCase() + '.gif');
		
		var ul = '<ul class="tabs">',
			li = '';

		$.each(country.visits, function (i, item) {
			li += '<li>';
			var monthYear = calcMonthYear(item['from']),
				checked = i == 0 ?'checked' : '';
			
			if (state.asideSelectedYear && monthYear.slice(-4) == state.asideSelectedYear.prop('id').slice(-4)) {
				checked = 'checked';
			}

			var	radio = '<input type="radio" name="tabs" id="tab' + i + '" ' + checked + '/>',
				label = '<label for="tab' + i + '">' + monthYear + '</label>',
				typeStr = '<div class="visit-types"><div class="visit-icon purpose"></div>',
				cityStr = '<div class="visit-cities"><div class="visit-icon location"></div>',
				tweets = '<div class="visit-tweets" id="visit-tweets-',
				spinner = '<div class="spinner visit-spinner"></div>',
				dateStr = '<div class="visit-dates"><div class="visit-icon calendar"></div>';
			
			for (var prop in item) {
				if (prop == 'type') {
					var len = item[prop].length;
					for (var j = 0; j < len; j++) {
						var str = item[prop][j] == "sv" ? "State Visit" : item[prop][j];
						typeStr += '<span class="visit-type">' +  str + '</span>';

						if (j == len - 1) {
							typeStr += '</div>';
						}
					}
				}
				if (prop == 'from') dateStr += '<span>' + item[prop] + ' - ';
				if (prop == 'to') dateStr += item[prop] + '</span></div>';

				if (prop == 'city') {
					cityStr += '<div>';
					var cities = item[prop];
					for (var j = 0 ; j < cities.length; j++) {
						cityStr += '<span class="visit-city">' + cities[j] + '</span>';
					}
					cityStr += '</div></div>' + dateStr + spinner ;
				}
				if(prop == 'tl') {
					tweets += i + '" data-tl="' + item[prop] + '">';
				}
			}
			var tabContent = '<div class="tab-content visit" id="tab-content' + i + '">';
			tabContent += typeStr + cityStr + tweets;
			li += radio + label + tabContent + "</div></li>";
		});

		ul += li + '</ul>';
		$('.visits').append(ul);
		

		$('.main-content').addClass('loaded');
		$('.hide-details-btn').addClass('is-visible');

		addRadioButtonEventListener();
		setTimeline($('.visits input[type="radio"]').first().siblings('.visit').find('.visit-tweets'));
	};
	var addRadioButtonEventListener = function() {
		$('.visits input[type="radio"]').on('change', function (event) {
			var target = $(event.target).siblings('.visit');
			var element = target.find('.visit-tweets');
			var loader = target.find('.visit-spinner');

			if (element.has('iframe').length === 0) {
				setTimeline(element);
			}
		});
	}
	var setTimeline = function (el) {
		var tl = el.data('tl');

		twttr.ready( function () {
			twttr.widgets.createTimeline(
				{ sourceType: "collection", id: tl },
				document.getElementById(el.prop('id')), 
				props.twttrOptions
			);
		});
	}
	var mapFirstLoad = function () {
		for (var country in visits) {
			if(visits.hasOwnProperty(country)) {
				$('#' + country).addClass('visited');
				orderByYear(visits, country);
			}
		}
		orderByYearCountry();
		trips = sortAZ(trips);
		createAsideTrips(trips);
		$('.land:not(.visited)').css('cursor', 'not-allowed');
	};
	var orderByYear = function (visits, country) {
		var visit = visits[country];
		var obj = {};
		for (var i = 0; i < visit.length; i++) {
			var year = visit[i]['from'].slice(-4);

			if (!trips[year][country]) {
				var obj = {};
				obj.name = $('path#' + country).attr('title');
				obj.count = 1;
				trips[year][country] = obj;
			}	
			else
				trips[year][country]['count'] = trips[year][country]['count'] + 1;
		}
	};
	var orderByYearCountry = function () {
		$.each(trips, function (year) {
			var trip = trips[year];
			var byName = {};
			$.each(trip, function(country) {
				var obj = {};
				obj.code =  country;
				obj.count = trip[country].count;
				byName[trip[country]["name"]] = obj;
			});
			trips[year] = byName;
		});
	};
	var sortAZ = function (trips) {
		for (var year in trips) {
			var _year = trips[year];
			Object.keys(_year).sort().forEach(function(key) {
				var value = _year[key];
				delete _year[key];
				_year[key] = value;
			});
		}
		return trips;
	};
	var createAsideTrips = function (trips) {
		var ul = '<ul class="tabs">'
		var li = '';
		$.each(trips, function (i, item) {
			li += '<li>';
			var checked = i == 2014 ? 'checked' : '';
			var	radio = '<input type="radio" name="tabs" id="tab' + i + '" ' + checked + '/>',
				label = '<label for="tab' + i + '">' + i + '</label>';

			var details = '';

			for (var country in item) {
				details += '<div class="aside-country-name" data-country="'+ item[country].code + '">' + country + '</div>';  
			}

			var tabContent = '<div class="tab-content" id="tab-content' + i + '"><div class="country-names">';
			tabContent +=  details;
			li += radio + label + tabContent + "</div></div>" + "</li>";
		});

		ul += li + '</ul>';
		$('.aside__trips').append(ul);
		state.asideSelectedYear = $('.aside__trips input[type="radio"]:checked');
		
		$('.aside-country-name').on('click', function() {
			state.asideSelectedYear = $('.aside__trips input[type="radio"]:checked');
			window.location.hash = $(this).data().country;
		});
	}

	return {
		mapFirstLoad: mapFirstLoad,
		initiateSelection: initiateSelection,
		unselectCountry: unselectCountry
	}
}();

twttr.ready( function () {
	twttr.events.bind('rendered', function (event) {
		$(event.target).parent().siblings('.visit-spinner').addClass('visit-spinner--hidden');
	});
});

module.exports = functions;
