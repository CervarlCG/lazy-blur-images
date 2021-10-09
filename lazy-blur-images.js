(function () {
    var LazyBlurImagesObject = /** @class */ (function () {
        function LazyBlurImagesObject(options) {
            this.options = null;
            this.options = options;
            if (Helper.isIntersectionObserverSupported()) {
                this.observer = new IntersectionObserver(this.onObserve.bind(this), {
                    threshold: 0.1
                });
            }
        }
        /**
         * Apply Blur effect to images
         * @param elements Images elements
         */
        LazyBlurImagesObject.prototype.applyBlur = function (elements) {
            var _this_1 = this;
            var imagesElements = [];
            elements.forEach(function (element) {
                if (_this_1.isValidImage(element)) {
                    _this_1.applyBlurStyles(element, window.lazyBlurData[element.dataset.blur]);
                    imagesElements.push(element);
                }
            });
            this.loadImages(imagesElements);
        };
        /**
         * Apply the blur style and wrap the image in a div
         * @param image Image element
         * @param blur Blue base64 data
         */
        LazyBlurImagesObject.prototype.applyBlurStyles = function (image, blur) {
            var parent = document.createElement("div");
            var _a = image.dataset.size.split("x"), width = _a[0], height = _a[1];
            parent.style.overflow = "hidden";
            parent.style.paddingTop =
                (parseFloat(height) * 100) / parseFloat(width) + "%";
            parent.style.position = "relative";
            image.src = "";
            image.style.backgroundImage = "url(\"" + blur + "\")";
            image.style.backgroundSize = "cover";
            image.style.backgroundRepeat = "no-repeat";
            image.style.filter = "blur(" + (image.dataset.radio || 20) + "px)";
            image.style.transform = "scale(" + (image.dataset.scale || "1") + ")";
            image.parentNode.replaceChild(parent, image);
            image.style.position = "absolute";
            image.style.top = "0px";
            image.style.left = "0px";
            image.style.minWidth = "100%";
            image.style.maxWidth = "100%";
            image.style.minHeight = "100%";
            image.style.maxHeight = "100%";
            parent.appendChild(image);
        };
        /**
         * Trigger when a element intersection happen
         * @param entries Entries given by a intersection observer
         * @param observer the main intersection observer object
         */
        LazyBlurImagesObject.prototype.onObserve = function (entries, observer) {
            var _this = this;
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    if (_this.options.dev && _this.options.dev.awaitTime > 0) {
                        setTimeout(function () {
                            _this.loadSingleImage(entry.target);
                        }, _this.options.dev.awaitTime * 1000);
                    }
                    else {
                        _this.loadSingleImage(entry.target);
                    }
                    observer.unobserve(entry.target);
                }
            });
        };
        /**
         * Load async of a image
         * @param imageElement Image element to load
         */
        LazyBlurImagesObject.prototype.loadSingleImage = function (imageElement) {
            var image = new Image();
            image.onload = function () {
                imageElement.src = imageElement.dataset.src;
                imageElement.style.filter = "blur(0px)";
                imageElement.style.transform = "scale(1)";
                imageElement.style.backgroundImage = "";
            };
            image.src = imageElement.dataset.src;
        };
        /**
         * Add the images to the intersection after the page is loaded
         * @param images HTML Image
         */
        LazyBlurImagesObject.prototype.loadImages = function (images) {
            var _this = this;
            window.addEventListener("load", function () {
                images.forEach(function (image) {
                    if (_this.observer)
                        _this.observer.observe(image);
                    else
                        _this.loadSingleImage(image);
                });
            });
        };
        /**
         * Check if a image has valid data
         * @param image HTML Image
         * @returns true if the image has the needed dataset
         */
        LazyBlurImagesObject.prototype.isValidImage = function (image) {
            return (image.dataset.placeholder === "blur" &&
                image.dataset.blur &&
                image.dataset.size &&
                /^([0-9]*[.])?[0-9]+x([0-9]*[.])?[0-9]+$/.test(image.dataset.size) &&
                window.lazyBlurData[image.dataset.blur]);
        };
        return LazyBlurImagesObject;
    }());
    var Helper = {
        isIntersectionObserverSupported: function () {
            return "IntersectionObserver" in window;
        }
    };
    window.lazyBlurData = window.lazyBlurData || {};
    window.LazyBlurImages = {
        init: function (options) {
            new LazyBlurImagesObject(options || {}).applyBlur([].slice.call(document.getElementsByTagName("img")));
        }
    };
})();
