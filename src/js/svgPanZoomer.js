var Hammer = require('hammerjs');
var svgPanZoom = require('svg-pan-zoom');
var visits = require('./visits');

var state = require('./state');

function setPanZoom() {
	var options = {
		minZoom: 1,
		zoomScaleSensitivity: 0.6,
		beforePan: beforePan
	}

	function beforePan (oldPan, newPan) {
		var stopHorizontal = false,
			stopVertical = false,
			gutterWidth = 100,
			gutterHeight = 100,
              // Computed variables
			sizes = this.getSizes(),
			leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth,
			rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom),
			topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight,
			bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom)
          
		  customPan = {}
          customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x))
          customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y))
          return customPan
	}
	
	if (state.isTouchDevice) {
		
		options.customEventsHandler = {
			haltEventListeners: ['touchStart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
			init: function (options) {
				var instance = options.instance,
					initialScale = 1,
					pannedX = 0,
					pannedY = 0

				this.hammer = Hammer(options.svgElement)
				this.hammer.get('pinch').set({enable: true})
				this.hammer.on('doubletap', function (ev) {
					console.log('tappin');
					options.instance.zoomIn()
				})
				this.hammer.on('panstart panmove', function(ev){
					console.log('pannin');
					// On pan start reset panned variables
					if (ev.type === 'panstart') {
						pannedX = 0
						pannedY = 0
					}

					// Pan only the difference
					if (pannedX < 500 && pannedY < 500) {
						instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY})
						pannedX = ev.deltaX
						pannedY = ev.deltaY
					}
				})
				this.hammer.on('pinchstart pinchmove', function(ev){
					// On pinch start remember initial zoom
					if (ev.type === 'pinchstart') {
						initialScale = instance.getZoom()
						instance.zoom(initialScale * ev.scale)
					}

					instance.zoom(initialScale * ev.scale)

				})
				this.hammer.on('tap', function (ev) {
					if (visits[ev.target.id]) {
						window.location.hash = ev.target.id;
					}
				})
				options.svgElement.addEventListener('touchmove', function(e){ e.preventDefault(); });
			}
		}
		options.destroy =  function () {
			this.hammer.destroy();
		}
	}


	var panZoom = svgPanZoom('#worldmap', options);

	$('.zoom-in').on('click', function (e) {
		e.preventDefault();
		panZoom.zoomIn();
	});

	$('.zoom-out').on('click', function (e) {
		e.preventDefault();
		panZoom.zoomOut();
	});

	$('.reset').on('click', function (e) {
		e.preventDefault();
		panZoom.resetZoom();
	});

	$('.loader-wrap').addClass('loaded');
}

 module.exports = setPanZoom;