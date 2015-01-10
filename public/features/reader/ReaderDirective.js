angular.module('Reader')
    .directive('readerDirective', ['d3Service', function (d3Service) { 'use strict';
        function linkFn(scope, element, attrs) {
            var force,
                svg,
                link,
                node;

            scope.ticks = 0;
            scope.$watch('feedsLoaded', function(value) {
                if(value === 1) {
                    var width = 900,
                        height = 400;

                    force = d3.layout.force()
                        .size([width, height])
                        .on('tick', tick);

                    svg = d3.select(element[0]).append('svg')
                        .attr('width', width)
                        .attr('height', height);

                    link = svg.selectAll('.link'),
                    node = svg.selectAll('.node');
                } else if (value === 4) {
                    updateForceReader(scope.feedData);
                }
            });

            function updateForceReader(root) {
                var nodes = flatten(root),
                    links = d3.layout.tree().links(nodes);
                // Restart the force layout
                force
                    .nodes(nodes)
                    .links(links)
                    .start();

                // Deal with links
                link = link.data(links, function (d) {
                    return d.target.id;
                });

                link.exit().remove();

                link.enter().insert('line', '.node')
                    .attr('class', 'link')
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

                // Deal with nodes
                node = node.data(nodes, function (d) {
                    return d.id;
                }).style('fill', color);

                node.exit().remove();

                node.enter().append('circle')
                    .attr('data', function (d) {
                        if(d.name === 'root') { return d.name; }
                    })
                    .attr('class', 'node')
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    })
                    .attr("r", function (d) {
                        return Math.sqrt(d.size) / 10 || 4.5;
                    })
                    .style("fill", color)
                    .on("click", click)
                    .call(force.drag);
            };

            function tick() {
                link.attr("x1", function (d) {
                    return d.source.x;
                })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

                node.attr("cx", function (d) {
                    return d.x;
                })
                    .attr("cy", function (d) {
                        return d.y;
                    });
                scope.ticks++;
            };

            // Color leaf nodes orange, and packages white or blue.
            function color(d) {
                if(d.name === 'root') { return '#ff0000'; }
                return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
            };

            // Toggle children on click.
            function click(d) {
                console.log(d);
                if (!d3.event.defaultPrevented) {
                    if(d.name === 'root') {
                        return;
                    } else if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    updateForceReader(scope.feedData);
                }
            };

            // Returns a list of all nodes under the root.
            function flatten(root) {
                var nodes = [], i = 0;

                function recurse(node) {
                    if (node.children) node.children.forEach(recurse);
                    if (!node.id) node.id = ++i;
                    nodes.push(node);
                }

                recurse(root);
                return nodes;
            };
        };

        return {
            restrict: 'AE',
            link: linkFn
        }
    }]);