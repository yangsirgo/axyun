'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Viewport = PIXI.extras.Viewport;
var Ease = PIXI.extras.Ease;

var defaults = function (options, defaults) {
    options = options || {};
    for (var item in defaults) {
        if (typeof options[item] === 'undefined') {
            options[item] = defaults[item];
        }
    }
    return options;
};
var DEFAULTS = {
    "boxWidth": 100,
    "boxHeight": 100,
    "scrollbarSize": 10,
    "scrollbarBackground": 14540253,
    "scrollbarBackgroundAlpha": 1,
    "scrollbarForeground": 8947848,
    "scrollbarForegroundAlpha": 1,
    "dragScroll": true,
    "stopPropagation": true,
    "scrollbarOffsetHorizontal": 0,
    "scrollbarOffsetVertical": 0,
    "underflow": "top-left",
    "fadeScrollbar": false,
    "fadeWait": 3000,
    "fadeEase": "easeInOutSine"
};

var FADE_SCROLLBAR_TIME = 1000;

/**
 * pixi.js scrollbox: a masked content box that can scroll vertically or horizontally with scrollbars
 */

var Scrollbox = function (_PIXI$Container) {
    _inherits(Scrollbox, _PIXI$Container);

    /**
     * create a scrollbox
     * @param {object} options
     * @param {boolean} [options.dragScroll=true] user may drag the content area to scroll content
     * @param {string} [options.overflowX=auto] (none, scroll, hidden, auto) this changes whether the scrollbar is shown
     * @param {string} [options.overflowY=auto] (none, scroll, hidden, auto) this changes whether the scrollbar is shown
     * @param {string} [options.overflow] (none, scroll, hidden, auto) sets overflowX and overflowY to this value
     * @param {number} [options.boxWidth=100] width of scrollbox including scrollbar (in pixels)
     * @param {number} [options.boxHeight=100] height of scrollbox including scrollbar (in pixels)
     * @param {number} [options.scrollbarSize=10] size of scrollbar (in pixels)
     * @param {number} [options.scrollbarOffsetHorizontal=0] offset of horizontal scrollbar (in pixels)
     * @param {number} [options.scrollbarOffsetVertical=0] offset of vertical scrollbar (in pixels)
     * @param {boolean} [options.stopPropagation=true] call stopPropagation on any events that impact scrollbox
     * @param {number} [options.scrollbarBackground=0xdddddd] background color of scrollbar
     * @param {number} [options.scrollbarBackgroundAlpha=1] alpha of background of scrollbar
     * @param {number} [options.scrollbarForeground=0x888888] foreground color of scrollbar
     * @param {number} [options.scrollbarForegroundAlpha=1] alpha of foreground of scrollbar
     * @param {string} [options.underflow=top-left] what to do when content underflows the scrollbox size: none: do nothing; (left/right/center AND top/bottom/center); OR center (e.g., 'top-left', 'center', 'none', 'bottomright')
     * @param {(boolean|number)} [options.fade] fade the scrollbar when not in use (true = 1000ms)
     * @param {number} [options.fadeWait=3000] time to wait before fading the scrollbar if options.fade is set
     * @param {(string|function)} [options.fadeEase=easeInOutSine] easing function to use for fading
     */
    function Scrollbox(options) {
        _classCallCheck(this, Scrollbox);

        var _this = _possibleConstructorReturn(this, (Scrollbox.__proto__ || Object.getPrototypeOf(Scrollbox)).call(this));

        _this.options = defaults(options, DEFAULTS);
        _this.ease = new Ease.list();

        /**
         * content in placed in here
         * you can use any function from pixi-viewport on content to manually move the content (see https://davidfig.github.io/pixi-viewport/jsdoc/)
         * @type {PIXI.extras.Viewport}
         */
        _this.content = _this.addChild(new Viewport({ passiveWheel: _this.options.stopPropagation, stopPropagation: _this.options.stopPropagation, screenWidth: _this.options.boxWidth, screenHeight: _this.options.boxHeight }));
        _this.content.decelerate().on('moved', function () {
            return _this._drawScrollbars();
        });

        /**
         * graphics element for drawing the scrollbars
         * @type {PIXI.Graphics}
         */
        _this.scrollbar = _this.addChild(new PIXI.Graphics());
        _this.scrollbar.interactive = true;
        _this.scrollbar.on('pointerdown', _this.scrollbarDown, _this);
        _this.interactive = true;
        _this.on('pointermove', _this.scrollbarMove, _this);
        _this.on('pointerup', _this.scrollbarUp, _this);
        _this.on('pointercancel', _this.scrollbarUp, _this);
        _this.on('pointerupoutside', _this.scrollbarUp, _this);
        _this._maskContent = _this.addChild(new PIXI.Graphics());
        _this.update();
        return _this;
    }

    /**
     * offset of horizontal scrollbar (in pixels)
     * @type {number}
     */


    _createClass(Scrollbox, [{
        key: '_drawScrollbars',


        /**
         * draws scrollbars
         * @private
         */
        value: function _drawScrollbars() {
            this._isScrollbarHorizontal = this.overflowX === 'scroll' ? true : ['hidden', 'none'].indexOf(this.overflowX) !== -1 ? false : this.scrollWidth > this.options.boxWidth;
            this._isScrollbarVertical = this.overflowY === 'scroll' ? true : ['hidden', 'none'].indexOf(this.overflowY) !== -1 ? false : this.scrollHeight > this.options.boxHeight;
            this.scrollbar.clear();
            var options = {};
            options.left = 0;
            options.right = this.scrollWidth + (this._isScrollbarVertical ? this.options.scrollbarSize : 0);
            options.top = 0;
            options.bottom = this.scrollHeight + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
            var width = this.scrollWidth + (this.isScrollbarVertical ? this.options.scrollbarSize : 0);
            var height = this.scrollHeight + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
            this.scrollbarTop = this.content.top / height * this.boxHeight;
            this.scrollbarTop = this.scrollbarTop < 0 ? 0 : this.scrollbarTop;
            this.scrollbarHeight = this.boxHeight / height * this.boxHeight;
            this.scrollbarHeight = this.scrollbarTop + this.scrollbarHeight > this.boxHeight ? this.boxHeight - this.scrollbarTop : this.scrollbarHeight;
            this.scrollbarLeft = this.content.left / width * this.boxWidth;
            this.scrollbarLeft = this.scrollbarLeft < 0 ? 0 : this.scrollbarLeft;
            this.scrollbarWidth = this.boxWidth / width * this.boxWidth;
            this.scrollbarWidth = this.scrollbarWidth + this.scrollbarLeft > this.boxWidth ? this.boxWidth - this.scrollbarLeft : this.scrollbarWidth;
            if (this.isScrollbarVertical) {
                this.scrollbar.beginFill(this.options.scrollbarBackground, this.options.scrollbarBackgroundAlpha).drawRect(this.boxWidth - this.scrollbarSize + this.options.scrollbarOffsetVertical, 0, this.scrollbarSize, this.boxHeight).endFill();
            }
            if (this.isScrollbarHorizontal) {
                this.scrollbar.beginFill(this.options.scrollbarBackground, this.options.scrollbarBackgroundAlpha).drawRect(0, this.boxHeight - this.scrollbarSize + this.options.scrollbarOffsetHorizontal, this.boxWidth, this.scrollbarSize).endFill();
            }
            if (this.isScrollbarVertical) {
                this.scrollbar.beginFill(this.options.scrollbarForeground, this.options.scrollbarForegroundAlpha).drawRect(this.boxWidth - this.scrollbarSize + this.options.scrollbarOffsetVertical, this.scrollbarTop, this.scrollbarSize, this.scrollbarHeight).endFill();
            }
            if (this.isScrollbarHorizontal) {
                this.scrollbar.beginFill(this.options.scrollbarForeground, this.options.scrollbarForegroundAlpha).drawRect(this.scrollbarLeft, this.boxHeight - this.scrollbarSize + this.options.scrollbarOffsetHorizontal, this.scrollbarWidth, this.scrollbarSize).endFill();
            }
            // this.content.forceHitArea = new PIXI.Rectangle(0, 0 , this.boxWidth, this.boxHeight)
            this.activateFade();
        }

        /**
         * draws mask layer
         * @private
         */

    }, {
        key: '_drawMask',
        value: function _drawMask() {
            this._maskContent.beginFill(0).drawRect(0, 0, this.boxWidth, this.boxHeight).endFill();
            this.content.mask = this._maskContent;
        }

        /**
         * call when scrollbox content changes
         */

    }, {
        key: 'update',
        value: function update() {
            this.content.mask = null;
            this._maskContent.clear();
            if (!this._disabled) {
                this._drawScrollbars();
                this._drawMask();
                if (this.options.dragScroll) {
                    var direction = this.isScrollbarHorizontal && this.isScrollbarVertical ? 'all' : this.isScrollbarHorizontal ? 'x' : 'y';
                    if (direction != null) {
                        this.content.drag({ clampWheel: true, direction: direction }).clamp({ direction: direction, underflow: this.options.underflow });
                    }
                }
            }
        }

        /**
         * show the scrollbar and restart the timer for fade if options.fade is set
         */

    }, {
        key: 'activateFade',
        value: function activateFade() {
            var _this2 = this;

            if (this.options.fade) {
                if (this.fade) {
                    this.ease.remove(this.fade);
                }
                this.scrollbar.alpha = 1;
                var time = this.options.fade === true ? FADE_SCROLLBAR_TIME : this.options.fade;
                this.fade = this.ease.to(this.scrollbar, { alpha: 0 }, time, { wait: this.options.fadeWait, ease: this.options.fadeEase });
                this.fade.on('each', function () {
                    return _this2.content.dirty = true;
                });
            }
        }

        /**
         * handle pointer down on scrollbar
         * @param {PIXI.interaction.InteractionEvent} e
         * @private
         */

    }, {
        key: 'scrollbarDown',
        value: function scrollbarDown(e) {
            var local = this.toLocal(e.data.global);
            if (this.isScrollbarHorizontal) {
                if (local.y > this.boxHeight - this.scrollbarSize) {
                    if (local.x >= this.scrollbarLeft && local.x <= this.scrollbarLeft + this.scrollbarWidth) {
                        this.pointerDown = { type: 'horizontal', last: local };
                    } else {
                        if (local.x > this.scrollbarLeft) {
                            this.content.left += this.content.worldScreenWidth;
                            this.update();
                        } else {
                            this.content.left -= this.content.worldScreenWidth;
                            this.update();
                        }
                    }
                    if (this.options.stopPropagation) {
                        e.stopPropagation();
                    }
                    return;
                }
            }
            if (this.isScrollbarVertical) {
                if (local.x > this.boxWidth - this.scrollbarSize) {
                    if (local.y >= this.scrollbarTop && local.y <= this.scrollbarTop + this.scrollbarWidth) {
                        this.pointerDown = { type: 'vertical', last: local };
                    } else {
                        if (local.y > this.scrollbarTop) {
                            this.content.top += this.content.worldScreenHeight;
                            this.update();
                        } else {
                            this.content.top -= this.content.worldScreenHeight;
                            this.update();
                        }
                    }
                    if (this.options.stopPropagation) {
                        e.stopPropagation();
                    }
                    return;
                }
            }
        }

        /**
         * handle pointer move on scrollbar
         * @param {PIXI.interaction.InteractionEvent} e
         * @private
         */

    }, {
        key: 'scrollbarMove',
        value: function scrollbarMove(e) {
            if (this.pointerDown) {
                if (this.pointerDown.type === 'horizontal') {
                    var local = this.toLocal(e.data.global);
                    this.content.left += local.x - this.pointerDown.last.x;
                    this.pointerDown.last = local;
                    this.update();
                } else if (this.pointerDown.type === 'vertical') {
                    var _local = this.toLocal(e.data.global);
                    this.content.top += _local.y - this.pointerDown.last.y;
                    this.pointerDown.last = _local;
                    this.update();
                }
                if (this.options.stopPropagation) {
                    e.stopPropagation();
                }
            }
        }

        /**
         * handle pointer down on scrollbar
         * @private
         */

    }, {
        key: 'scrollbarUp',
        value: function scrollbarUp() {
            this.pointerDown = null;
        }

        /**
         * resize the mask for the container
         * @param {object} options
         * @param {number} [options.boxWidth] width of scrollbox including scrollbar (in pixels)
         * @param {number} [options.boxHeight] height of scrollbox including scrollbar (in pixels)
         * @param {number} [options.scrollWidth] set the width of the inside of the scrollbox (leave null to use content.width)
         * @param {number} [options.scrollHeight] set the height of the inside of the scrollbox (leave null to use content.height)
         */

    }, {
        key: 'resize',
        value: function resize(options) {
            this.options.boxWidth = typeof options.boxWidth !== 'undefined' ? options.boxWidth : this.options.boxWidth;
            this.options.boxHeight = typeof options.boxHeight !== 'undefined' ? options.boxHeight : this.options.boxHeight;
            if (options.scrollWidth) {
                this.scrollWidth = options.scrollWidth;
            }
            if (options.scrollHeight) {
                this.scrollHeight = options.scrollHeight;
            }
            this.content.resize(this.options.boxWidth, this.options.boxHeight, this.scrollWidth, this.scrollHeight);
            this.update();
        }

        /**
         * ensure that the bounding box is visible
         * @param {number} x - relative to content's coordinate system
         * @param {number} y
         * @param {number} width
         * @param {number} height
         */

    }, {
        key: 'ensureVisible',
        value: function ensureVisible(x, y, width, height) {
            this.content.ensureVisible(x, y, width, height);
            this._drawScrollbars();
        }
    }, {
        key: 'scrollbarOffsetHorizontal',
        get: function get() {
            return this.options.scrollbarOffsetHorizontal;
        },
        set: function set(value) {
            this.options.scrollbarOffsetHorizontal = value;
        }

        /**
         * offset of vertical scrollbar (in pixels)
         * @type {number}
         */

    }, {
        key: 'scrollbarOffsetVertical',
        get: function get() {
            return this.options.scrollbarOffsetVertical;
        },
        set: function set(value) {
            this.options.scrollbarOffsetVertical = value;
        }

        /**
         * disable the scrollbox (if set to true this will also remove the mask)
         * @type {boolean}
         */

    }, {
        key: 'disable',
        get: function get() {
            return this._disabled;
        },
        set: function set(value) {
            if (this._disabled !== value) {
                this._disabled = value;
                this.update();
            }
        }

        /**
         * call stopPropagation on any events that impact scrollbox
         * @type {boolean}
         */

    }, {
        key: 'stopPropagation',
        get: function get() {
            return this.options.stopPropagation;
        },
        set: function set(value) {
            this.options.stopPropagation = value;
        }

        /**
         * user may drag the content area to scroll content
         * @type {boolean}
         */

    }, {
        key: 'dragScroll',
        get: function get() {
            return this.options.dragScroll;
        },
        set: function set(value) {
            this.options.dragScroll = value;
            if (value) {
                this.content.drag();
            } else {
                this.content.removePlugin('drag');
            }
            this.update();
        }

        /**
         * width of scrollbox including the scrollbar (if visible)- this changes the size and not the scale of the box
         * @type {number}
         */

    }, {
        key: 'boxWidth',
        get: function get() {
            return this.options.boxWidth;
        },
        set: function set(value) {
            this.options.boxWidth = value;
            this.content.screenWidth = value;
            this.update();
        }

        /**
         * sets overflowX and overflowY to (scroll, hidden, auto) changing whether the scrollbar is shown
         * scroll = always show scrollbar
         * hidden = hide overflow and do not show scrollbar
         * auto = if content is larger than box size, then show scrollbar
         * @type {string}
         */

    }, {
        key: 'overflow',
        get: function get() {
            return this.options.overflow;
        },
        set: function set(value) {
            this.options.overflow = value;
            this.options.overflowX = value;
            this.options.overflowY = value;
            this.update();
        }

        /**
         * sets overflowX to (scroll, hidden, auto) changing whether the scrollbar is shown
         * scroll = always show scrollbar
         * hidden = hide overflow and do not show scrollbar
         * auto = if content is larger than box size, then show scrollbar
         * @type {string}
         */

    }, {
        key: 'overflowX',
        get: function get() {
            return this.options.overflowX;
        },
        set: function set(value) {
            this.options.overflowX = value;
            this.update();
        }

        /**
         * sets overflowY to (scroll, hidden, auto) changing whether the scrollbar is shown
         * scroll = always show scrollbar
         * hidden = hide overflow and do not show scrollbar
         * auto = if content is larger than box size, then show scrollbar
         * @type {string}
         */

    }, {
        key: 'overflowY',
        get: function get() {
            return this.options.overflowY;
        },
        set: function set(value) {
            this.options.overflowY = value;
            this.update();
        }

        /**
         * height of scrollbox including the scrollbar (if visible) - this changes the size and not the scale of the box
         * @type {number}
         */

    }, {
        key: 'boxHeight',
        get: function get() {
            return this.options.boxHeight;
        },
        set: function set(value) {
            this.options.boxHeight = value;
            this.content.screenHeight = value;
            this.update();
        }

        /**
         * scrollbar size in pixels
         * @type {number}
         */

    }, {
        key: 'scrollbarSize',
        get: function get() {
            return this.options.scrollbarSize;
        },
        set: function set(value) {
            this.options.scrollbarSize = value;
        }

        /**
         * width of scrollbox less the scrollbar (if visible)
         * @type {number}
         * @readonly
         */

    }, {
        key: 'contentWidth',
        get: function get() {
            return this.options.boxWidth - (this.isScrollbarVertical ? this.options.scrollbarSize : 0);
        }

        /**
         * height of scrollbox less the scrollbar (if visible)
         * @type {number}
         * @readonly
         */

    }, {
        key: 'contentHeight',
        get: function get() {
            return this.options.boxHeight - (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
        }

        /**
         * is the vertical scrollbar visible
         * @type {boolean}
         * @readonly
         */

    }, {
        key: 'isScrollbarVertical',
        get: function get() {
            return this._isScrollbarVertical;
        }

        /**
         * is the horizontal scrollbar visible
         * @type {boolean}
         * @readonly
         */

    }, {
        key: 'isScrollbarHorizontal',
        get: function get() {
            return this._isScrollbarHorizontal;
        }

        /**
         * top coordinate of scrollbar
         */

    }, {
        key: 'scrollTop',
        get: function get() {
            return this.content.top;
        }

        /**
         * left coordinate of scrollbar
         */

    }, {
        key: 'scrollLeft',
        get: function get() {
            return this.content.left;
        }

        /**
         * width of content area
         * if not set then it uses content.width to calculate width
         */

    }, {
        key: 'scrollWidth',
        get: function get() {
            return this._scrollWidth || this.content.width;
        },
        set: function set(value) {
            this._scrollWidth = value;
        }

        /**
         * height of content area
         * if not set then it uses content.height to calculate height
         */

    }, {
        key: 'scrollHeight',
        get: function get() {
            return this._scrollHeight || this.content.height;
        },
        set: function set(value) {
            this._scrollHeight = value;
        }
    }]);

    return Scrollbox;
}(PIXI.Container);

PIXI.extras.Scrollbox = Scrollbox;