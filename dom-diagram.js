// This is based on http://bl.ocks.org/mbostock/1093025.

function domToDiagram(el, state) {
  var diagram = el._diagram || {};
  if (!state) {
    if (!diagram.state) diagram.state = {latestId: 0};
    state = diagram.state;
  }
  if (!el._diagram) {
    el._diagram = diagram;
    diagram.id = ++state.latestId;
  }
  diagram.children = [];
  if (el.nodeType == el.TEXT_NODE) {
    diagram.type = 'text';
    var val = JSON.stringify(el.nodeValue);
    if (val.length > 30)
      val = val.slice(0, 29) + '\u2026' + '"';
    diagram.name = "Text node: " + val;
  } else if (el.nodeType == el.ELEMENT_NODE) {
    diagram.type = 'element';
    diagram.name = "Element: " + el.nodeName.toLowerCase() +
                   (el.id ? '#' + el.id : '');
    for (var i = 0; i < el.childNodes.length; i++) {
      var child = el.childNodes[i];
      if (child.nodeType == el.TEXT_NODE &&
          !child.nodeValue.trim()) continue;
      diagram.children.push(domToDiagram(child, state));
    }
  }
  return diagram;
}

function showDomDiagram(root, parent, minHeight) {
  var margin = {top: 30, right: 20, bottom: 30, left: 20},
      width = 960 - margin.left - margin.right,
      barHeight = 20,
      barWidth = width * .8;

  var i = 0,
      duration = 400;

  var tree = d3.layout.tree()
      .nodeSize([0, 20]);

  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

  var svg = d3.select(parent).append("svg")
      .attr("width", width + margin.left + margin.right)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  root.x0 = 0;
  root.y0 = 0;
  update(root);

  function update(source) {

    // Compute the flattened node list. TODO use d3.layout.hierarchy.
    var nodes = tree.nodes(root);

    var height = Math.max(minHeight || 0, nodes.length * barHeight + margin.top + margin.bottom);

    d3.select(parent + ' svg').transition()
        .duration(duration)
        .attr("height", height);

    d3.select(parent).transition()
        .duration(duration)
        .style("height", height + "px");

    // Compute the "layout".
    nodes.forEach(function(n, i) {
      n.x = i * barHeight;
    });

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .style("opacity", 1e-6);

    // Enter any new nodes at the parent's previous position.
    nodeEnter.append("rect")
        .attr("y", -barHeight / 2)
        .attr("height", barHeight)
        .attr("width", barWidth)
        .style("fill", color);

    nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", 5.5)
        .text(function(d) { return d.name; });

    // Transition nodes to their new position.
    nodeEnter.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        .style("opacity", 1);

    node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        .style("opacity", 1)
      .select("rect")
        .style("fill", color);

    // Transition exiting nodes to the parent's new position.
    node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .style("opacity", 1e-6)
        .remove();

    // Update the links…
    var link = svg.selectAll("path.link")
        .data(tree.links(nodes), function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
          var o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        })
      .transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
          var o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  function color(d) {
    return d.type == 'element' ? "#c6dbef" : "#fd8d3c";
  }

  return update;
}
