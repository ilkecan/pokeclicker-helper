class SpatialHelper {
    static calculate_manhattan_distance(p1, p2) {
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    }

    static find_the_closest_points(v1, v2) {
        let minimum_distance = Number.POSITIVE_INFINITY;
        let closest_points = null;

        for (const p1 of v1) {
            for (const p2 of v2) {
                const current_distance = this.calculate_manhattan_distance(p1, p2);

                if (current_distance < minimum_distance) {
                    minimum_distance = current_distance;
                    closest_points = [p1, p2];
                }
            }
        }

        return closest_points;
    }

    // https://zingl.github.io/Bresenham.pdf
    static* follow_bresenhams_line_algorithm(p1, p2) {
        const {x: x1, y: y1} = p1;
        const {x: x2, y: y2} = p2;
        const dx = Math.abs(x2 - x1);
        const sx = x1 < x2 ? 1 : -1;
        const dy = -Math.abs(y2 - y1);
        const sy = y1 < y2 ? 1 : -1;

        let error = dx + dy;
        let x = x1;
        let y = y1;
        while (x !== x2 || y !== y2) {
            if (error + dx >= 0) {
                error += dy;
                x += sx;

                yield new Point(x, y);
            }

            if (error + dy <= 0) {
                error += dx;
                y += sy;

                yield new Point(x, y);
            }
        }
    }

    static* map_cells_in_grid(grid, callback) {
        for (const [y, row] of grid.entries()) {
            for (const [x, cell] of row.entries()) {
                const return_value = callback(cell, x, y);

                if (return_value !== undefined) {
                    yield return_value;
                }
            }
        }
    }

    static for_each_cell_in_grid(grid, callback) {
        for (const [y, row] of grid.entries()) {
            for (const [x, cell] of row.entries()) {
                callback(cell, x, y);
            }
        }
    }

    static* follow_shortest_path_in_grid(source, destinations, is_valid) {
        const predecessors = new Map();
        const seen = new Set([ JSON.stringify(source) ]);
        let destination = null;

        for (const stringified_point of seen) {

            if (destinations.includes(stringified_point)) {
                destination = stringified_point;
                break;
            }

            const point = JSON.parse(stringified_point);
            for (const neighbour of this.get_adjacent_cells(point, is_valid)) {
                const stringified_neighbour = JSON.stringify(neighbour);
                if (!seen.has(stringified_neighbour)) {
                    seen.add(stringified_neighbour);
                    predecessors.set(stringified_neighbour, stringified_point);
                }
            }
        }

        let stringified_point = destination;
        while (stringified_point !== undefined) {
            yield JSON.parse(stringified_point);
            stringified_point = predecessors.get(stringified_point);
        }
    }

    static get_adjacent_cells(point, is_valid) {
        const {x, y} = point;
        const neighbours = [
            new Point(x - 1, y),
            new Point(x, y - 1),
            new Point(x + 1, y),
            new Point(x, y + 1),
        ];

        return neighbours.filter(is_valid);
    }

    static get_opposite_direction(direction) {
        switch (direction) {
            case "left":
                return "right";

            case "up":
                return "down";

            case "right":
                return "left";

            case "down":
                return "up";
        }
    }
}
