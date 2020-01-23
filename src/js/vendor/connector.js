(function($) {
  $.fn.connections = function(options) {
    if (options === "update") {
      return processConnections(update, this);
    } else if (options === "remove") {
      return processConnections(destroy, this);
    } else {
      options = $.extend(
        true,
        {
          borderClasses: {},
          class: "connection",
          css: {},
          from: this,
          tag: "connection",
          to: this,
          within: ":root"
        },
        options
      );
      connect(options);
      return this;
    }
  };

  $.event.special.connections = {
    teardown: function(namespaces) {
      processConnections(destroy, $(this));
    }
  };

  var connect = function(options) {
    var borderClasses = options.borderClasses;
    var tag = options.tag;
    var end1 = $(options.from);
    var end2 = $(options.to);
    var within = $(options.within);
    delete options.borderClasses;
    delete options.tag;
    delete options.from;
    delete options.to;
    delete options.within;
    within.each(function() {
      var container = this;
      var done = new Array();
      end1.each(function() {
        var node = this;
        done.push(this);
        end2.not(done).each(function() {
          createConnection(
            container,
            [node, this],
            tag,
            borderClasses,
            options
          );
        });
      });
    });
  };

  var createConnection = function(
    container,
    nodes,
    tag,
    borderClasses,
    options
  ) {
    var css = $.extend({ position: "absolute" }, options.css);
    var connection = $("<" + tag + "/>", options).css(css);
    connection.appendTo(container);

    var border_w = (connection.outerWidth() - connection.innerWidth()) / 2;
    var border_h = (connection.outerHeight() - connection.innerHeight()) / 2;

    if (border_w <= 0 && border_h <= 0) {
      border_w = border_h = 1;
    }

    var data = {
      borderClasses: borderClasses,
      border_h: border_h,
      border_w: border_w,
      node_from: $(nodes[0]),
      node_to: $(nodes[1]),
      nodes_dom: nodes,
      css: css
    };

    if ("none" === connection.css("border-top-style")) {
      data.css.borderStyle = "solid";
    }
    $.data(connection.get(0), "connection", data);
    $.data(connection.get(0), "connections", [connection.get(0)]);
    for (var i = 0; i < 2; i++) {
      var connections = connection.add($.data(nodes[i], "connections")).get();
      $.data(nodes[i], "connections", connections);
      if (connections.length == 1) {
        $(nodes[i]).on("connections.connections", false);
      }
    }
    update(connection.get(0));
  };

  var destroy = function(connection) {
    var nodes = $.data(connection, "connection").nodes_dom;
    for (var i = 0; i < 2; i++) {
      var connections = $($.data(nodes[i], "connections"))
        .not(connection)
        .get();
      $.data(nodes[i], "connections", connections);
    }
    $(connection).remove();
  };

  var getState = function(data) {
    data.rect_from = data.nodes_dom[0].getBoundingClientRect();
    data.rect_to = data.nodes_dom[1].getBoundingClientRect();
    var cached = data.cache;
    data.cache = [
      data.rect_from.top,
      data.rect_from.right,
      data.rect_from.bottom,
      data.rect_from.left,
      data.rect_to.top,
      data.rect_to.right,
      data.rect_to.bottom,
      data.rect_to.left
    ];
    data.hidden =
      0 === (data.cache[0] | data.cache[1] | data.cache[2] | data.cache[3]) ||
      0 === (data.cache[4] | data.cache[5] | data.cache[6] | data.cache[7]);
    data.unmodified = true;
    if (cached === undefined) {
      return (data.unmodified = false);
    }
    for (var i = 0; i < 8; i++) {
      if (cached[i] !== data.cache[i]) {
        return (data.unmodified = false);
      }
    }
  };

  var update = function(connection) {
    var data = $.data(connection, "connection");
    getState(data);
    if (data.unmodified) {
      return;
    }
    var border_h = data.border_h;
    var border_w = data.border_w;
    var from = data.rect_from;
    var to = data.rect_to;
    var b = (from.bottom + from.top) / 2;
    var r = (to.left + to.right) / 2;
    var t = (to.bottom + to.top) / 2;
    var l = (from.left + from.right) / 2;

    var h = ["right", "left"];
    if (l > r) {
      h = ["left", "right"];
      var x = Math.max(r - border_w / 2, Math.min(from.right, to.right));
      r = l + border_w / 2;
      l = x;
    } else {
      l -= border_w / 2;
      r = Math.min(r + border_w / 2, Math.max(from.left, to.left));
    }
    var v = ["bottom", "top"];
    if (t > b) {
      v = ["top", "bottom"];
      var x = Math.max(b - border_h / 2, Math.min(from.bottom, to.bottom));
      b = t + border_h / 2;
      t = x;
    } else {
      b = Math.min(b, Math.max(from.top, to.top));
      t -= border_h / 2;
    }
    var width = r - l;
    var height = b - t;
    if (width < border_w) {
      t = Math.max(t, Math.min(from.bottom, to.bottom));
      b = Math.min(b, Math.max(from.top, to.top));
      l = Math.max(from.left, to.left);
      r = Math.min(from.right, to.right);
      r = l = (l + r - border_w) / 2;
    }
    if (height < border_h) {
      l = Math.max(l, Math.min(from.right, to.right));
      r = Math.min(r, Math.max(from.left, to.left));
      t = Math.max(from.top, to.top);
      b = Math.min(from.bottom, to.bottom);
      b = t = (t + b - border_h) / 2;
    }
    width = r - l;
    height = b - t;
    width <= 0 && (border_h = 0);
    height <= 0 && (border_w = 0);
    var style =
      "border-" +
      v[0] +
      "-" +
      h[0] +
      "-radius: 0;" +
      "border-" +
      v[0] +
      "-" +
      h[1] +
      "-radius: 0;" +
      "border-" +
      v[1] +
      "-" +
      h[0] +
      "-radius: 0;";
    (border_h <= 0 || border_w <= 0) &&
      (style += "border-" + v[1] + "-" + h[1] + "-radius: 0;");
    if (data.hidden) {
      style += "display: none;";
    } else {
      data.css["border-" + v[0] + "-width"] = 0;
      data.css["border-" + h[0] + "-width"] = 0;
      data.css["border-" + v[1] + "-width"] = border_h;
      data.css["border-" + h[1] + "-width"] = border_w;
      var current_rect = connection.getBoundingClientRect();
      data.css.left = connection.offsetLeft + l - current_rect.left;
      data.css.top = connection.offsetTop + t - current_rect.top;
      data.css.width = width - border_w;
      data.css.height = height - border_h;
    }
    var bc = data.borderClasses;
    $(connection)
      .removeClass(bc[v[0]])
      .removeClass(bc[h[0]])
      .addClass(bc[v[1]])
      .addClass(bc[h[1]])
      .attr("style", style)
      .css(data.css);
  };

  var processConnections = function(method, elements) {
    return elements.each(function() {
      var connections = $.data(this, "connections");
      if (connections instanceof Array) {
        for (var i = 0, len = connections.length; i < len; i++) {
          method(connections[i]);
        }
      }
    });
  };
})(jQuery);

/*!
  jQuery HTML SVG connect v2.0.0
  license: MIT
  based on: https://gist.github.com/alojzije/11127839
  alojzije/connectHTMLelements_SVG.png
*/
; (function ($, window, document, undefined) {
  //https://github.com/jquery-boilerplate/jquery-boilerplate
  "use strict";

  var pluginName = "HTMLSVGconnect",
    defaults = {
      stroke: "#000000",
      strokeWidth: 12,
      orientation: "auto",
      class: "",
      // Array of objects with properties "start" & "end" that
      // define the selectors of the elements to connect:
      // i.e., {start: "#purple", end: "#green"}.
      // Optional properties:
      //  "stroke": [color],
      //  "strokeWidth": [px],
      //  "orientation": [horizontal|vertical|auto (default)]
      //  "offset": [px]
      paths: []
    };

  function Plugin(element, options) {
    this.element = element;
    this.$element = $(this.element);
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  $.extend(Plugin.prototype, {
    init: function () {
      this.$svg = $(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
      this.$svg.attr("height", 0).attr("width", 0);
      this.$element.append(this.$svg);
      // text
      this.$text = $(document.createElementNS("http://www.w3.org/2000/svg", "text"));
      this.$svg.append(this.$text);
      // Draw the paths, and store references to the loaded elements.
      this.loadedPaths = $.map(this.settings.paths, $.proxy(this.connectSetup, this));
      $(window).on("resize", this.throttle(this.reset, 200, this));
    },

    // Recalculate paths.
    reset: function () {
      this.$svg.attr("height", 0).attr("width", 0);
      $.map(this.loadedPaths, $.proxy(this.connectElements, this));
    },

    connectSetup: function (pathConfig, i) {
      if (pathConfig.hasOwnProperty("start") && pathConfig.hasOwnProperty("end")) {
        var $start = $(pathConfig.start), $end = $(pathConfig.end);
        // Start/end elements exist.
        if ($start.length && $end.length) {
          var $path = $(document.createElementNS("http://www.w3.org/2000/svg", "path"));
          // Custom/default path properties.
          var stroke = pathConfig.hasOwnProperty("stroke") ? pathConfig.stroke : this.settings.stroke;
          var strokeWidth = pathConfig.hasOwnProperty("strokeWidth") ? pathConfig.strokeWidth : this.settings.strokeWidth;
          var path_class = pathConfig.hasOwnProperty("class") ? pathConfig.class : this.settings.class;
          var pathId = "path_" + i;
          $path.attr("fill", "white")
            .attr("stroke", stroke)
            .attr("stroke-width", strokeWidth)
            .attr("class", path_class)
            .attr("id", pathId);
          this.$svg.append($path);

          if (pathConfig.text) {
            var $tspan = this._createSvgTextPath(pathConfig.text, strokeWidth, pathId);
          }

          var pathData = {
            "path": $path,
            "start": $start,
            "end": $end,
            "text": pathConfig.text,
            "tspan": $tspan,
            "orientation": pathConfig.hasOwnProperty("orientation") ? pathConfig.orientation : this.settings.orientation,
            "offset": pathConfig.hasOwnProperty("offset") ? parseInt(pathConfig.offset) : 0
            };
          this.connectElements(pathData);
          // Save for reference.
          return pathData;
        }
      }
      return null; // Ignore/invalid.
    },

    _createSvgTextPath(text, strokeWidth, pathId) {
      // textPath
      var textPathElement = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
      textPathElement.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + pathId);
      textPathElement.setAttribute("startOffset", "50%");
      var $textPath = $(textPathElement);
      this.$text.append($textPath);
      var tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      $textPath.append($(tspan));
      var dy = (strokeWidth / 2) + 2;
      tspan.setAttribute("dy",  - dy);
      // need to reset the dy, another tspan is needed
      var otherTspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      $textPath.append($(otherTspan));
      otherTspan.setAttribute("dy", dy);
      $(otherTspan).text(" ");
      var $tspan = $(tspan);
      return $tspan;
    },

    // Whether the path should originate from the top/bottom or the sides;
    // based on whichever is greater: the horizontal or vertical gap between the elements
    // (this depends on the user positioning the elements sensibly,
    // and not overlapping them).
    determineOrientation: function ($startElem, $endElem) {
      // If first element is lower than the second, swap.
      if ($startElem.offset().top > $endElem.offset().top) {
        var temp = $startElem;
        $startElem = $endElem;
        $endElem = temp;
      }
      var startBottom = $startElem.offset().top + $startElem.outerHeight();
      var endTop = $endElem.offset().top;
      var verticalGap = endTop - startBottom;
      // If first element is more left than the second, swap.
      if ($startElem.offset().left > $endElem.offset().left) {
        var temp2 = $startElem;
        $startElem = $endElem;
        $endElem = temp2;
      }
      var startRight = $startElem.offset().left + $startElem.outerWidth();
      var endLeft = $endElem.offset().left;
      var horizontalGap = endLeft - startRight;
      return horizontalGap > verticalGap ? "vertical" : "horizontal";
    },

    connectElements: function (pathData) {
      var $startElem = pathData.start,
      $endElem = pathData.end,
      orientation = pathData.orientation;
      // Orientation not set per path and/or defaulted to global "auto".
      if (orientation != "vertical" && orientation != "horizontal") {
        orientation = this.determineOrientation($startElem, $endElem);
      }
      var swap = false;
      if (orientation == "vertical") {
        // If first element is more left than the second.
        swap = $startElem.offset().left > $endElem.offset().left;
      } else { // Horizontal
        // If first element is lower than the second.
        swap = $startElem.offset().top > $endElem.offset().top;
      }
      if (swap) {
        var temp = $startElem;
        $startElem = $endElem;
        $endElem = temp;
      }
      // Get (top, left) corner coordinates of the svg container.
      var svgTop = this.$element.offset().top;
      var svgLeft = this.$element.offset().left;

      // Get (top, left) coordinates for the two elements.
      var startCoord = $startElem.offset();
      var endCoord = $endElem.offset();

      // Centre path above/below or left/right of element.
      var centreSX = 0.5, centreSY = 1,
        centreEX = 0.5, centreEY = 0;
      if (orientation == "vertical") {
        centreSX = 1;
        centreSY = 0.5;
        centreEX = 0;
        centreEY = 0.5;
      }
      // Calculate the path's start/end coordinates.
      // We want to align with the elements' mid point.
      var startX = startCoord.left + centreSX * $startElem.outerWidth() - svgLeft;
      var startY = startCoord.top + centreSY * $startElem.outerHeight() - svgTop;
      var endX = endCoord.left + centreEX * $endElem.outerWidth() - svgLeft;
      var endY = endCoord.top + centreEY * $endElem.outerHeight() - svgTop;

      this.drawPath(pathData.path, pathData.offset, orientation, startX, startY, endX, endY);
      if (pathData.text != undefined && pathData.tspan != undefined) {
        this.drawText(pathData.text, pathData.tspan);
      }
    },

    drawPath: function ($path, offset, orientation, startX, startY, endX, endY) {
      var stroke = parseFloat($path.attr("stroke-width"));
      // Check if the svg is big enough to draw the path, if not, set height/width.
      if (this.$svg.attr("width") < (Math.max(startX, endX) + stroke)) this.$svg.attr("width", (Math.max(startX, endX) + stroke));
      if (this.$svg.attr("height") < (Math.max(startY, endY) + stroke)) this.$svg.attr("height", (Math.max(startY, endY) + stroke));

      var deltaX = (Math.max(startX, endX) - Math.min(startX, endX)) * 0.15;
      var deltaY = (Math.max(startY, endY) - Math.min(startY, endY)) * 0.15;
      // For further calculations whichever is the shortest distance.
      var delta = Math.min(deltaY, deltaX);
      // Set sweep-flag (counter/clockwise)
      var arc1 = 0; var arc2 = 1;

      if (orientation == "vertical") {
        var sigY = this.sign(endY - startY);
        // If start element is closer to the top edge,
        // draw the first arc counter-clockwise, and the second one clockwise.
        if (startY < endY) {
          arc1 = 1;
          arc2 = 0;
        }
        // Draw the pipe-like path
        // 1. move a bit right, 2. arch, 3. move a bit down, 4.arch, 5. move right to the end
        $path.attr("d", "M" + startX + " " + startY +
          " H" + (startX + offset + delta) +
          " A" + delta + " " + delta + " 0 0 " + arc1 + " " + (startX + offset + 2 * delta) + " " + (startY + delta * sigY) +
          " V" + (endY - delta * sigY) +
          " A" + delta + " " + delta + " 0 0 " + arc2 + " " + (startX + offset + 3 * delta) + " " + endY +
          " H" + endX);
      } else {
        //Horizontal
        var sigX = this.sign(endX - startX);
        // If start element is closer to the left edge,
        // draw the first arc counter-clockwise, and the second one clockwise.
        if (startX > endX) {
          arc1 = 1;
          arc2 = 0;
        }
        // Draw the pipe-like path
        // 1. move a bit down, 2. arch, 3. move a bit to the right, 4.arch, 5. move down to the end
        $path.attr("d", "M" + startX + " " + startY +
          " V" + (startY + offset + delta) +
          " A" + delta + " " + delta + " 0 0 " + arc1 + " " + (startX + delta * sigX) + " " + (startY + offset + 2 * delta) +
          " H" + (endX - delta * sigX) +
          " A" + delta + " " + delta + " 0 0 " + arc2 + " " + endX + " " + (startY + offset + 3 * delta) +
          " V" + endY);
      }
    },

    /*
     * Draw text for a path, takes the text for a path and the id of the path element and will create a textPath element.
     */
    drawText(text, $textPath) {
      $textPath.text(text);
    },

    /*
     * Add array of path objects
     * e.g., var paths = [{ start: "#red", end: "#green" }, { start: "#aqua", end: "#green", stroke: "blue" }];
     * Public method within the plugin's prototype:
     * $("#svgContainer").HTMLSVGconnect("addPaths", paths);
     */
    addPaths: function(paths) {
      var loadedPaths = $.map(paths, $.proxy(this.connectSetup, this));
      Array.prototype.push.apply(this.loadedPaths, loadedPaths);
    },

    // Chrome Math.sign() support.
    sign: function (x) {
      return x > 0 ? 1 : x < 0 ? -1 : x;
    },

    // https://remysharp.com/2010/07/21/throttling-function-calls
    throttle: function (fn, threshhold, scope) {
      threshhold || (threshhold = 250);
      var last, deferTimer;
      return function () {
        var context = scope || this;
        var now = +new Date,
          args = arguments;
        if (last && now < last + threshhold) {
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function () {
            last = now;
            fn.apply(context, args);
          }, threshhold);
        } else {
          last = now;
          fn.apply(context, args);
        }
      };
    },
  });

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
		var args = arguments;
		if (options === undefined || typeof options === 'object') {
			// Creates a new plugin instance, for each selected element, and
			// stores a reference within the element's data
			return this.each(function() {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
				}
			});
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
			// Call a public plugin method (not starting with an underscore) for each 
			// selected element.
			return this.each(function() {
				var instance = $.data(this, 'plugin_' + pluginName);
				if (instance instanceof Plugin && typeof instance[options] === 'function') {
					instance[options].apply(instance, Array.prototype.slice.call(args, 1));
				}
			});
		}
	};

})(jQuery, window, document);
