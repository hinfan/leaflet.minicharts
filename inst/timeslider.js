L.TimeSlider = L.Control.extend({
  options: {
    position: "bottomleft",
    timeLabels: null,
    interval: 1000,
    onTimeIdChange: function(timeId) {console.log(timeId)}
  },

  initialize: function(options) {
    L.Control.prototype.initialize.call(this, options);

    var container = L.DomUtil.create('div', "leaflet-bar leaflet-control");
    container.style.padding = "5px";
    container.style.backgroundColor = 'white';

    var label = L.DomUtil.create("p", "time-slider-label", container);
    var sliderContainer = L.DomUtil.create("div", "leaflet-control-slider", container);

    var slider = L.DomUtil.create("input", "time-slider", sliderContainer);
    slider.type = "range";
    slider.min = 0;
    slider.max = options.timeLabels.length - 1;
    slider.value = 0;

    var btn = L.DomUtil.create("i", "playpause fa fa-play", sliderContainer);

    this._container = container;
    this._slider = slider;
    this._play = false;
    this._btn = btn;
    this._label = label;
  },

  onAdd: function(map) {
    var self = this;
    self._slider.onchange = function(e) {self.options.onTimeIdChange(self._slider.value)};
    self._btn.onclick = function(e) {self.playPause()};

    self.setTimeLabels(self.options.timeLabels);

    L.DomEvent.on(self._slider, 'mousedown mouseup click', L.DomEvent.stopPropagation);
    L.DomEvent.on(self._slider, 'mouseenter', function(e) {
        map.dragging.disable();
    });
    L.DomEvent.on(self._slider, 'mouseleave', function(e) {
        map.dragging.enable();
    });

    return self._container;
  },

  playPause: function() {
    var self = this;
    self._play = !self._play;
    if(self._play) {
      self._btn.className = "playpause fa fa-pause";
      if (self.getTimeId() == self._slider.max) {
        self.setTimeId(0);
      }

      self._intervalId = setInterval(function() {
        self.setTimeId(self.getTimeId() + 1);
        if (self.getTimeId() == self._slider.max) {
          clearInterval(self._intervalId);
          self._play = false;
          self._btn.className = "playpause fa fa-play";
        }
      }, self.options.interval);
    } else {
      clearInterval(self._intervalId);
      self._btn.className = "playpause fa fa-play";
    }
  },

  setTimeId: function(timeId) {
    var self = this;
    self._slider.value = timeId;
    self._label.innerHTML = self.options.timeLabels[timeId];
    self.options.onTimeIdChange(timeId);
  },

  getTimeId: function() {
    return parseInt(this._slider.value);
  },

  setTimeLabels: function(timeLabels) {
    var self = this;

    if (typeof timeLabels == "undefined" || timeLabels.length < 2) {
      self._container.style.display = "none";
      setTimeId(0);
    } else {
      self._container.style.display = "block";
      var currentTimeLabel = self.options.timeLabels[self.getTimeId()];
      var newTimeId = timeLabels.indexOf(currentTimeLabel);
      if (newTimeId == -1) newTimeId = 0;
      this.options.timeLabels = timeLabels;
      self.setTimeId(newTimeId);
    }
  }
});

L.timeSlider = function(options) {
  return new L.TimeSlider(options);
};
