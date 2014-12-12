var VideoStache = function(videoElem, canvasElem, opts) {
    var options = opts || {};
    var self = this;
    self.imageUrl = options.imageUrl || "images/stache.png";
    self.dom = {
        canvas: canvasElem,
        canvasContext: null,
        video: videoElem
    };

    self.yOffset = options.yOffset || 0.61;
    self.widthOffset = options.widthOffset || 1.55;
    self.heightOffset = options.heightOffset || 0.8;

    self.tracker = new tracking.ObjectTracker(['face']);
    self.tracker.setStepSize(options.stepSize || 2);
    self.tracker.setEdgesDensity(options.edgeDensity || 0.1);

    self.onFaceFound = function(event) {
        console.log(event);
        self.dom.canvasContext.clearRect(0, 0, self.dom.canvas.width, self.dom.canvas.height);
        if (event.data.length) {
            self.showStache(event.data[0]);
        }
    };
};

VideoStache.prototype.showStache = function(face) {
    var y = face.y + (face.height * this.yOffset);
    var width = face.width / this.widthOffset;
    var x = face.x + (face.width - width) / 2;
    var stache = new Image();
    stache.src = this.imageUrl;
    this.dom.canvasContext.drawImage(stache, x, y, width, width * this.heightOffset);
};

VideoStache.prototype.init = function() {
    this.dom.canvasContext = this.dom.canvas.getContext("2d");
    tracking.track("#" + this.dom.video.id, this.tracker, {
        camera: true
    });
    this.tracker.on('track', this.onFaceFound);
};