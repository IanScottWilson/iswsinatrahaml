(function() {
  var Multipoly, Point, Pointsarray, SVG_line, SVG_mcpolyline, SVG_multipolydrawing, SVG_path, SVG_path_data, SVG_path_svg, addcolor, calcviewbox, clearcolors, degreesToRadians, degreesToRadiansL, drawBoxFractal, drawCrossStitchFractal, drawDragonCurve, drawFractalAlien, drawGreekKey, drawHexagonalGosperCurve, drawHilbertSpaceFillingCurve, drawIslandsAndLakes, drawLevyCCurve, drawPeanoSpaceFillingCurve, drawPenroseTiling, drawPlant1, drawPlant2, drawPlant3, drawPlant4, drawSVG, drawSierpinskiGasket, drawmultipoly, drawplant, gcd, gcdMulti, generate, getAllSides, getPoints, insertmarkup, makesvgmultipolyfrompaths, modifypointsarray, pagecolors, rewrite, rotatearbitrary, rotateplant, rotatewitharg, roundNumber, scalearbitrary, scalewitharg, svgdrawpath, svgdrawplant, updateBounds, writemarkup;

  Multipoly = (function() {

    function Multipoly(lengths, angles, colors, strokewidths) {
      var i, last, side;
      this.lengths = lengths;
      this.angles = angles;
      this.colors = colors;
      this.strokewidths = strokewidths;
      this.limit = 360 / gcd(360, gcdMulti(this.angles));
      this.sides = getAllSides(this.lengths, degreesToRadiansL(this.angles), this.limit);
      this.rawpoints = this.sides.pointSet.reduce(function(a, b) {
        return a.concat(b);
      });
      this.augmentedpointSet = (function() {
        var _len, _ref, _results;
        _ref = this.sides.pointSet;
        _results = [];
        for (i = 0, _len = _ref.length; i < _len; i++) {
          side = _ref[i];
          last = side.length - 1;
          if (i !== 0) {
            _results.push([this.sides.pointSet[i - 1][last]].concat(side));
          } else {
            _results.push([new Point(0, 0)].concat(side));
          }
        }
        return _results;
      }).call(this);
      this.rawbounds = this.sides.bounds;
    }

    Multipoly.prototype.getlengths = function() {
      return this.lengths;
    };

    Multipoly.prototype.getangles = function() {
      return this.angles;
    };

    Multipoly.prototype.getcolors = function() {
      return this.colors;
    };

    Multipoly.prototype.setlengths = function(newlengths) {
      return this.lengths = newlengths;
    };

    Multipoly.prototype.setangles = function(newangles) {
      return this.angles = newangles;
    };

    Multipoly.prototype.setcolors = function(newcolors) {
      return this.colors = newcolors;
    };

    Multipoly.prototype.toGraphic = function() {
      return "Sub-class responsibilty.";
    };

    return Multipoly;

  })();

  Point = (function() {

    function Point(x, y) {
      this.x = x;
      this.y = y;
    }

    Point.prototype.x = function() {
      return this.x;
    };

    Point.prototype.y = function() {
      return this.y;
    };

    return Point;

  })();

  Pointsarray = (function() {

    function Pointsarray(pointsarray) {
      this.pointsarray = pointsarray;
      this.leftbound = (_.min(this.pointsarray, function(p) {
        return p.x;
      })).x;
      this.rightbound = (_.max(this.pointsarray, function(p) {
        return p.x;
      })).x;
      this.topbound = (_.max(this.pointsarray, function(p) {
        return p.y;
      })).y;
      this.bottombound = (_.min(this.pointsarray, function(p) {
        return p.y;
      })).y;
    }

    return Pointsarray;

  })();

  getPoints = function(startpoint, lengths, angles, count) {
    var angle, currentpoint, freshpoints, i, nextpoint;
    freshpoints = [];
    nextpoint = new Point(0, 0);
    currentpoint = startpoint;
    return freshpoints = (function() {
      var _len, _results;
      _results = [];
      for (i = 0, _len = angles.length; i < _len; i++) {
        angle = angles[i];
        nextpoint = new Point(roundNumber(currentpoint.x + lengths[i] * Math.cos(count * angle), 2), roundNumber(currentpoint.y + lengths[i] * Math.sin(count * angle), 2));
        _results.push(currentpoint = nextpoint);
      }
      return _results;
    })();
  };

  getAllSides = function(lengths, angles, limit) {
    var bounds, count, last, newPoints, pointReached, pointSet;
    bounds = {
      leftb: 0,
      bottomb: 0,
      rightb: 0,
      topb: 0
    };
    last = angles.length - 1;
    pointSet = [];
    newPoints = [];
    pointReached = new Point(0, 0);
    count = 0;
    pointSet = (function() {
      var _results;
      _results = [];
      while (count < limit) {
        newPoints = getPoints(pointReached, lengths, angles, count);
        pointReached = newPoints[last];
        bounds = updateBounds(newPoints, bounds);
        count = count + 1;
        _results.push(newPoints);
      }
      return _results;
    })();
    return {
      bounds: bounds,
      pointSet: pointSet
    };
  };

  updateBounds = function(points, bounds) {
    var point, _i, _len;
    for (_i = 0, _len = points.length; _i < _len; _i++) {
      point = points[_i];
      bounds.rightb = point.x > bounds.rightb ? point.x : bounds.rightb;
      bounds.leftb = point.x < bounds.leftb ? point.x : bounds.leftb;
      bounds.topb = point.y > bounds.topb ? point.y : bounds.topb;
      bounds.bottomb = point.y < bounds.bottomb ? point.y : bounds.bottomb;
    }
    return bounds;
  };

  SVG_path_data = (function() {

    function SVG_path_data(points, open) {
      var point, rest, terminator;
      this.points = points;
      if (open == null) open = true;
      if (open) {
        terminator = "";
      } else {
        terminator = " z";
      }
      this.stringhead = "M " + points[0].x.toString() + ',' + points[0].y.toString() + " ";
      this.stringnext = "L" + points[1].x.toString() + ',' + points[1].y.toString() + " ";
      rest = points.slice(2);
      this.temprest = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = rest.length; _i < _len; _i++) {
          point = rest[_i];
          _results.push(" " + point.x.toString() + ',' + point.y.toString() + " ");
        }
        return _results;
      })();
      this.stringrest = this.temprest.join(" ");
      this.wholestring = this.stringhead + this.stringnext + this.stringrest + terminator;
    }

    return SVG_path_data;

  })();

  SVG_path_svg = (function() {

    function SVG_path_svg(svgpathdata, color, fill, fillrule, strokewidth) {
      var dq;
      this.svgpathdata = svgpathdata;
      this.color = color;
      this.fill = fill;
      this.fillrule = fillrule;
      this.strokewidth = strokewidth;
      dq = '"';
      this.svgpathelement = '<path d=' + dq + this.svgpathdata.wholestring + dq + ' fill=' + dq + fill + dq + ' fill-rule=' + dq + this.fillrule + dq + ' stroke=' + dq + this.color + dq + ' stroke-width=' + dq + this.strokewidth + dq + '/>';
    }

    return SVG_path_svg;

  })();

  makesvgmultipolyfrompaths = function(amultipolyobject) {
    var col, color, command, i, index, mpside, mpsides, path, pathslist, sw, _i, _len, _len2, _len3, _ref;
    pathslist = [];
    _ref = amultipolyobject.colors;
    for (index = 0, _len = _ref.length; index < _len; index++) {
      color = _ref[index];
      pathslist = pathslist.concat('<path id=\"path' + index + '\" ' + 'class=\"' + color + '\" d= \"');
    }
    mpsides = amultipolyobject.augmentedpointSet;
    for (_i = 0, _len2 = mpsides.length; _i < _len2; _i++) {
      mpside = mpsides[_i];
      i = 0;
      command = '';
      while (i <= mpside.length - 2) {
        command = ' M' + mpside[i].x + ' ' + mpside[i].y + ' ' + 'L' + mpside[i + 1].x + ' ' + mpside[i + 1].y;
        pathslist[i] += command;
        i += 1;
      }
    }
    for (index = 0, _len3 = pathslist.length; index < _len3; index++) {
      path = pathslist[index];
      sw = amultipolyobject.strokewidths[index] || 1;
      col = amultipolyobject.colors[index] || 'red';
      path += '\" stroke-width=\"' + sw + '\" stroke=\"' + col + '\" />';
      pathslist[index] = path;
    }
    return pathslist.reduce(function(a, b) {
      return a + b;
    });
  };

  SVG_line = (function() {

    function SVG_line(begin, end, color, strokewidth) {
      var dq;
      this.begin = begin;
      this.end = end;
      this.color = color;
      this.strokewidth = strokewidth;
      dq = '"';
      this.wholestring = '<line x1=' + dq + this.begin.x + dq + ' y1=' + dq + this.begin.y + dq + ' x2=' + dq + this.end.x + dq + ' y2=' + dq + this.end.y + dq + ' stroke=' + dq + this.color + dq + ' stroke-width=' + dq + this.strokewidth + dq + '/>';
    }

    return SVG_line;

  })();

  SVG_mcpolyline = (function() {

    function SVG_mcpolyline(points, colors, strokewidth) {
      var from, index, last, point, to;
      this.points = points;
      this.colors = colors;
      this.strokewidth = strokewidth;
      from = null;
      to = null;
      last = this.points.length - 1;
      this.svglines = (function() {
        var _len, _results;
        _results = [];
        for (index = 0, _len = points.length; index < _len; index++) {
          point = points[index];
          if (index !== last) {
            from = this.points[index];
            to = this.points[index + 1];
            _results.push(new SVG_line(from, to, this.colors[index], this.strokewidth));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }).call(this);
      this.svg = this.svglines.slice(0, last);
    }

    return SVG_mcpolyline;

  })();

  SVG_multipolydrawing = (function() {

    function SVG_multipolydrawing(sides, colors, strokewidth) {
      var line, side;
      this.sides = sides;
      this.colors = colors;
      this.strokewidth = strokewidth;
      this.drawingarray = (function() {
        var _i, _len, _ref, _results;
        _ref = this.sides;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          side = _ref[_i];
          _results.push((new SVG_mcpolyline(side, this.colors, this.strokewidth)).svg);
        }
        return _results;
      }).call(this);
      this.drawingflatten = this.drawingarray.reduce(function(a, b) {
        return a.concat(b);
      });
      this.svgtextarray = (function() {
        var _i, _len, _ref, _results;
        _ref = this.drawingflatten;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          line = _ref[_i];
          _results.push(line.wholestring);
        }
        return _results;
      }).call(this);
      this.svgtext = this.svgtextarray.reduce(function(a, b) {
        return a.concat(b);
      });
    }

    return SVG_multipolydrawing;

  })();

  roundNumber = function(num, places) {
    return Math.round(num * Math.pow(10, places)) / Math.pow(10, places);
  };

  generate = function(n, axiom, rules) {
    var i, start;
    start = axiom;
    i = 1;
    while (i <= n) {
      start = rewrite(start, rules);
      i += 1;
    }
    return start + "/";
  };

  rewrite = function(str, rules) {
    var strarray, token;
    strarray = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = str.length; _i < _len; _i++) {
        token = str[_i];
        if (typeof rules[token] === "undefined") {
          _results.push(token);
        } else {
          _results.push(rules[token]);
        }
      }
      return _results;
    })();
    return strarray.join("");
  };

  modifypointsarray = function(pointsarray, d, heading) {
    return pointsarray.concat(new Point(roundNumber(pointsarray.last().x + d * Math.cos(heading), 2), roundNumber(pointsarray.last().y + d * Math.sin(heading), 2)));
  };

  SVG_path = (function() {

    function SVG_path(startx, starty, color, fill, strokewidth) {
      this.startx = startx;
      this.starty = starty;
      this.color = color;
      this.fill = fill;
      this.strokewidth = strokewidth;
      this.svgsubstring = "<path stroke=\"" + this.color + "\" fill=\"" + this.fill + "\" stroke-width=\"" + this.strokewidth + "\" d=\"M " + this.startx + " " + this.starty;
    }

    return SVG_path;

  })();

  svgdrawpath = function(str, length, delta, color, fill, strokewidth) {
    var boundsarray, cp, heading, restored, stack, subfigures, svg, token, _i, _len;
    stack = [];
    subfigures = [];
    heading = 0;
    cp = new Point(0, 0);
    svg = (new SVG_path(0, 0, color, fill, strokewidth)).svgsubstring;
    boundsarray = [];
    for (_i = 0, _len = str.length; _i < _len; _i++) {
      token = str[_i];
      if (_.include(["F", "l", "r"], token)) token = "F";
      switch (token) {
        case "F":
          cp = new Point(roundNumber(cp.x + length * Math.cos(heading), 2), roundNumber(cp.y + length * Math.sin(heading), 2));
          boundsarray = boundsarray.concat(cp);
          svg += " L" + cp.x + " " + cp.y;
          break;
        case "+":
          heading = heading + degreesToRadians(delta);
          break;
        case "-":
          heading = heading - degreesToRadians(delta);
          break;
        case "f":
          subfigures = subfigures.concat(svg += "\"/>");
          cp = new Point(roundNumber(cp.x + length * Math.cos(heading), 2), roundNumber(cp.y + length * Math.sin(heading), 2));
          boundsarray = boundsarray.concat(cp);
          svg = (new SVG_path(cp.x, cp.y, color, fill, strokewidth)).svgsubstring;
          break;
        case "[":
          stack.push({
            "position": cp,
            "heading": heading
          });
          break;
        case "]":
          restored = stack.pop();
          cp = restored.position;
          heading = restored.heading;
          svg = svg + " M" + cp.x + " " + cp.y;
          break;
        case "/":
          subfigures = subfigures.concat(svg += "\"/>");
      }
    }
    return {
      "sf": subfigures.join(""),
      "ba": boundsarray
    };
  };

  svgdrawplant = function(str, length, delta, color, strokewidth) {
    var boundsarray, cp, heading, op, restored, stack, subfigures, token, _i, _len;
    stack = [];
    subfigures = [];
    heading = Math.PI / 2;
    op = new Point(0, 0);
    boundsarray = [];
    for (_i = 0, _len = str.length; _i < _len; _i++) {
      token = str[_i];
      switch (token) {
        case "F":
          cp = new Point(roundNumber(op.x + length * Math.cos(heading), 2), roundNumber(op.y + length * Math.sin(heading), 2));
          boundsarray = boundsarray.concat(cp);
          subfigures = subfigures.concat((new SVG_line(op, cp, color, strokewidth)).wholestring);
          op = cp;
          break;
        case "f":
          op = new Point(roundNumber(op.x + length * Math.cos(heading), 2), roundNumber(op.y + length * Math.sin(heading), 2));
          boundsarray = boundsarray.concat(op);
          break;
        case "+":
          heading = heading + degreesToRadians(delta);
          break;
        case "-":
          heading = heading - degreesToRadians(delta);
          break;
        case "[":
          stack.push({
            "position": op,
            "heading": heading
          });
          break;
        case "]":
          restored = stack.pop();
          op = restored.position;
          heading = restored.heading;
      }
    }
    return {
      "sf": subfigures.join(""),
      "ba": boundsarray
    };
  };

  gcd = function(a, b) {
    var r;
    a = Math.abs(a);
    b = Math.abs(b);
    r = 0;
    while (b > 0) {
      r = a % b;
      a = b;
      b = r;
    }
    return a;
  };

  gcdMulti = function(list) {
    return list.reduce(function(a, b) {
      return gcd(a, b);
    });
  };

  degreesToRadians = function(angle) {
    return (angle / 360) * 2 * Math.PI;
  };

  degreesToRadiansL = function(list) {
    return list.map(degreesToRadians);
  };

  calcviewbox = function(multipoly) {
    var mb, vb;
    mb = multipoly.rawbounds;
    return vb = [mb.leftb - 10, mb.bottomb - 10, mb.rightb - mb.leftb + 20, mb.topb - mb.bottomb + 20].toString();
  };

  writemarkup = function(inner, viewbox, width, height) {
    return '<svg width=' + width + ' height=' + height + ' viewBox="' + viewbox + '" xmlns="http://www.w3.org/2000/svg" version="1.1">' + inner + '</svg>';
  };

  insertmarkup = function(insertionpoint, markup) {
    return $(insertionpoint).innerHTML = markup;
  };

  pagecolors = [];

  addcolor = function() {
    return pagecolors = pagecolors.concat([$("hex3").value]);
  };

  clearcolors = function() {
    return pagecolors = [];
  };

  drawmultipoly = function() {
    var a, figure, l, mu, pageangles, pageanglestr, pagelengths, pagelengthstr, pagestrokewidths, pagestrokewidthstr, peterpoly, s, svgcontent;
    pagelengthstr = $("lengths3").value.split(",");
    pagelengths = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = pagelengthstr.length; _i < _len; _i++) {
        l = pagelengthstr[_i];
        _results.push(parseInt(l));
      }
      return _results;
    })();
    pageanglestr = $("angles3").value.split(",");
    pageangles = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = pageanglestr.length; _i < _len; _i++) {
        a = pageanglestr[_i];
        _results.push(parseInt(a));
      }
      return _results;
    })();
    pagestrokewidthstr = $("strokewidths3").value.split(",");
    pagestrokewidths = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = pagestrokewidthstr.length; _i < _len; _i++) {
        s = pagestrokewidthstr[_i];
        _results.push(parseInt(s));
      }
      return _results;
    })();
    peterpoly = new Multipoly(pagelengths, pageangles, pagecolors, pagestrokewidths);
    figure = makesvgmultipolyfrompaths(peterpoly);
    svgcontent = "<g id=\"thisSVGfigure\">" + figure + "</g>";
    mu = writemarkup(svgcontent, calcviewbox(peterpoly), "600", "600");
    return insertmarkup("graphic", mu);
  };

  drawSVG = function() {
    var axiom, color, delta, fill, level, lu, pa, rewritestring, rules, strokewidth, svgarray, svgcontent, viewbox;
    axiom = $("axiom").value;
    rules = $("rules").value.evalJSON();
    level = parseInt($("level").value);
    delta = parseInt($("delta").value);
    color = $("hex3").value;
    strokewidth = $("strokewidth").value;
    fill = $("fill").value;
    rewritestring = generate(level, axiom, rules);
    svgarray = svgdrawpath(rewritestring, 10, delta, color, fill, strokewidth);
    pa = new Pointsarray(svgarray.ba);
    viewbox = [pa.leftbound - 10, pa.bottombound - 10, pa.rightbound - pa.leftbound + 20, pa.topbound - pa.bottombound + 20].toString();
    svgcontent = "<g id=\"thisSVGfigure\">" + svgarray.sf + "</g>";
    lu = writemarkup(svgcontent, viewbox, "600", "600");
    return insertmarkup("graphic", lu);
  };

  drawplant = function() {
    var axiom, color, delta, level, lu, pa, rewritestring, rules, strokewidth, svgcontent, svgobject, viewbox;
    axiom = $("axiom").value;
    rules = $("rules").value.evalJSON();
    level = parseInt($("level").value);
    delta = parseInt($("delta").value);
    color = $("hex3").value;
    strokewidth = $("strokewidth").value;
    rewritestring = generate(level, axiom, rules);
    svgobject = svgdrawplant(rewritestring, 10, delta, color, strokewidth);
    pa = new Pointsarray(svgobject.ba);
    viewbox = [pa.leftbound - 10, pa.bottombound - 10, pa.rightbound - pa.leftbound + 20, pa.topbound - pa.bottombound + 20].toString();
    svgcontent = "<g id=\"thisSVGfigure\">" + svgobject.sf + "</g>";
    lu = writemarkup(svgcontent, viewbox, "600", "600");
    insertmarkup("graphic", lu);
    return rotateplant();
  };

  rotatewitharg = function(angle) {
    var action, box, centre;
    box = $("thisSVGfigure").getBBox();
    centre = new Point(box.x + box.width / 2, box.y + box.height / 2);
    action = "rotate(" + angle + "," + centre.x + "," + centre.y + ")";
    return $("thisSVGfigure").setAttributeNS(null, "transform", action);
  };

  rotateplant = function() {
    return rotatewitharg(-180);
  };

  rotatearbitrary = function() {
    return rotatewitharg($("rotationangle").value);
  };

  scalewitharg = function(factor) {
    var action;
    action = "scale(" + factor + ")";
    return $("thisSVGfigure").setAttributeNS(null, "transform", action);
  };

  scalearbitrary = function() {
    return scalewitharg($("scalefactor").value);
  };

  drawDragonCurve = function() {
    $("axiom").value = 'l';
    $("rules").value = '{"l":"l+r+","r":"-l-r","-":"-", "+":"+"}';
    $("hex3").value = '#A8FF00';
    $("fill").value = 'none';
    $("delta").value = '90';
    $("level").value = '11';
    $("strokewidth").value = '5';
    return drawSVG();
  };

  drawSierpinskiGasket = function() {
    $("axiom").value = 'r';
    $("rules").value = '{"-":"-","+":"+","l":"r+l+r","r":"l-r-l"}';
    $("hex3").value = '#42F1FF';
    $("fill").value = 'none';
    $("delta").value = '60';
    $("level").value = '7';
    $("strokewidth").value = '5';
    return drawSVG();
  };

  drawHexagonalGosperCurve = function() {
    $("axiom").value = 'l';
    $("rules").value = '{"-":"-","+":"+","l":"l+r++r-l--ll-r+","r":"-l+rr++r+l--l-r"}';
    $("hex3").value = '#FF0000';
    $("fill").value = 'none';
    $("delta").value = '60';
    $("level").value = '4';
    $("strokewidth").value = '5';
    return drawSVG();
  };

  drawPeanoSpaceFillingCurve = function() {
    $("axiom").value = 'l';
    $("rules").value = '{"-":"-","+":"+","l":"lFrFl-F-rFlFr+F+lFrFl","r":"rFlFr+F+lFrFl-F-rFlFr"}';
    $("hex3").value = '#9900CC';
    $("fill").value = 'none';
    $("delta").value = '90';
    $("level").value = '3';
    $("strokewidth").value = '3';
    return drawSVG();
  };

  drawHilbertSpaceFillingCurve = function() {
    $("axiom").value = 'l';
    $("rules").value = '{"-":"-","+":"+","l":"+rF-lFl-Fr+", "r":"-lF+rFr+Fl-"}';
    $("hex3").value = '#FF00BF';
    $("fill").value = 'none';
    $("delta").value = '90';
    $("level").value = '5';
    $("strokewidth").value = '3';
    return drawSVG();
  };

  drawLevyCCurve = function() {
    $("axiom").value = 'F';
    $("rules").value = '{"-":"-","+":"+","F":"+F--F+"}';
    $("hex3").value = '#F3FF90';
    $("fill").value = 'none';
    $("delta").value = '45';
    $("level").value = '13';
    $("strokewidth").value = '5';
    return drawSVG();
  };

  drawBoxFractal = function() {
    $("axiom").value = 'F-F-F-F';
    $("rules").value = '{"-":"-","+":"+","F":"F-F+F+F-F"}';
    $("hex3").value = '#F3FF90';
    $("fill").value = 'none';
    $("delta").value = '90';
    $("level").value = '4';
    $("strokewidth").value = '5';
    return drawSVG();
  };

  drawFractalAlien = function() {
    $("axiom").value = 'F-F-F-F';
    $("rules").value = '{"-":"-","+":"+","F":"F-F+F+F-F"}';
    $("hex3").value = '#FF0000';
    $("fill").value = '#47FF3B';
    $("delta").value = '103';
    $("level").value = '5';
    $("strokewidth").value = '3';
    return drawSVG();
  };

  drawCrossStitchFractal = function() {
    $("axiom").value = 'F-F-F-F';
    $("rules").value = '{"-":"-","+":"+","F":"F+F-F-F+F"}';
    $("hex3").value = '#BBDAFF';
    $("fill").value = '#000000';
    $("delta").value = '90';
    $("level").value = '5';
    $("strokewidth").value = '3';
    return drawSVG();
  };

  drawGreekKey = function() {
    $("axiom").value = 'L';
    $("rules").value = '{"L":"L+F+R-F-L+F+R-F-L-F-R+F+L-F-R-F-L+F+R-F-L-F-R-F-L+F+R+F+L+F+R-F-L+F+R+F+L-F-R+F+L+F+R-F-L+F+R-F-L",\
"R":"R-F-L+F+R-F-L+F+R+F+L-F-R+F+L+F+R-F-L+F+R+F+L+F+R-F-L-F-R-F-L+F+R-F-L-F-R+F+L-F-R-F-L+F+R-F-L+F+R",\
"-":"-", \
"+":"+"}';
    $("hex3").value = '#8EA0FF';
    $("fill").value = 'none';
    $("delta").value = '45';
    $("level").value = '2';
    $("strokewidth").value = '5';
    return drawSVG();
  };

  drawPenroseTiling = function() {
    $("axiom").value = '[N]++[N]++[N]++[N]++[N]';
    $("rules").value = '{"M":"OF++PF----NF[-OF----MF]++","N":"+OF--PF[---MF--NF]+","O":"-MF++NF[+++OF++PF]-","P":"--OF++++MF[+PF++++NF]--NF","F":""}';
    $("hex3").value = '#FFFF00';
    $("fill").value = 'none';
    $("delta").value = '36';
    $("level").value = '4';
    $("strokewidth").value = '0.5';
    return drawSVG();
  };

  drawIslandsAndLakes = function() {
    $("axiom").value = 'F+F+F+F';
    $("rules").value = '{"F":"F+f-FF+F+FF+Ff+FF-f+FF-F-FF-Ff-FFF", "f":"ffffff"}';
    $("hex3").value = '#00FF00';
    $("fill").value = 'none';
    $("delta").value = '90';
    $("level").value = '2';
    $("strokewidth").value = '2';
    return drawSVG();
  };

  drawPlant1 = function() {
    $("axiom").value = 'X';
    $("rules").value = '{"X":"F[+X]F[-X]+X","F":"FF","-":"-", "+":"+"}';
    $("hex3").value = '#9CE60F';
    $("fill").value = 'none';
    $("delta").value = '30';
    $("level").value = '7';
    $("strokewidth").value = '5';
    drawSVG();
    return rotatewitharg(-90);
  };

  drawPlant2 = function() {
    $("axiom").value = 'X';
    $("rules").value = '{"X":"F[+X][-X]FX","F":"FF","-":"-", "+":"+"}';
    $("hex3").value = '#CC9933';
    $("fill").value = 'none';
    $("delta").value = '25.7';
    $("level").value = '7';
    $("strokewidth").value = '5';
    drawSVG();
    return rotatewitharg(-90);
  };

  drawPlant3 = function() {
    $("axiom").value = 'X';
    $("rules").value = '{"X":"F-[[X]+X]+F[+FX]-X","F":"FF", "-":"-", "+":"+"}';
    $("hex3").value = '#DADA48';
    $("fill").value = 'none';
    $("delta").value = '25';
    $("level").value = '6';
    $("strokewidth").value = '5';
    drawSVG();
    return rotatewitharg(-90);
  };

  drawPlant4 = function() {
    $("axiom").value = 'F';
    $("rules").value = '{"-":"-","+":"+","F":"F[-F][++F]F[--F][+F]"}';
    $("hex3").value = '#663333';
    $("fill").value = '#A7FF4F';
    $("delta").value = '22.5';
    $("level").value = '5';
    $("strokewidth").value = '1';
    drawSVG();
    return rotatewitharg(-90);
  };

  $("addcolor").addEventListener("click", addcolor, false);

  $("clearcolors").addEventListener("click", clearcolors, false);

  $("drawmultipoly").addEventListener("click", drawmultipoly, false);

  $("drawsvg").addEventListener("click", drawSVG, false);

  $("drawplant").addEventListener("click", drawplant, false);

  $("rotatesvg").addEventListener("click", rotatearbitrary, false);

  $("scalesvg").addEventListener("click", scalearbitrary, false);

  $("dragoncurve").addEventListener("click", drawDragonCurve, false);

  $("sierpinskigasket").addEventListener("click", drawSierpinskiGasket, false);

  $("hexagonalgospercurve").addEventListener("click", drawHexagonalGosperCurve, false);

  $("peanospacefillingcurve").addEventListener("click", drawPeanoSpaceFillingCurve, false);

  $("hilbertspacefillingcurve").addEventListener("click", drawHilbertSpaceFillingCurve, false);

  $("levyccurve").addEventListener("click", drawLevyCCurve, false);

  $("boxfractal").addEventListener("click", drawBoxFractal, false);

  $("crossstitchfractal").addEventListener("click", drawCrossStitchFractal, false);

  $("fractalalien").addEventListener("click", drawFractalAlien, false);

  $("greekkey").addEventListener("click", drawGreekKey, false);

  $("penrosetile").addEventListener("click", drawPenroseTiling, false);

  $("islandsandlakes").addEventListener("click", drawIslandsAndLakes, false);

  $("plantnumber1").addEventListener("click", drawPlant1, false);

  $("plantnumber2").addEventListener("click", drawPlant2, false);

  $("plantnumber3").addEventListener("click", drawPlant3, false);

  $("plantnumber4").addEventListener("click", drawPlant4, false);

  drawGreekKey();

}).call(this);
