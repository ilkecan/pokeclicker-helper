function calculate_manhattan_distance(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function find_closest_points(v1, v2) {
    let minimum_distance = Number.POSITIVE_INFINITY;
    let closest_points = null;

    for (const p1 of v1) {
        for (const p2 of v2) {
            const current_distance = calculate_manhattan_distance(p1, p2);

            if (current_distance < minimum_distance) {
                minimum_distance = current_distance;
                closest_points = [p1, p2];
            }
        }
    }

    return closest_points;
}

// https://zingl.github.io/Bresenham.pdf
function* follow_bresenhams_line_algorithm(p1, p2) {
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
