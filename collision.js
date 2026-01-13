function rectToPoly(x, y, w, h, a) {
  let hw = w / 2, hh = h / 2
  let cosA = Math.cos(a), sinA = Math.sin(a)
  let corners = [
    [-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]
  ]
  return corners.map(c => [
    x + c[0] * cosA - c[1] * sinA,
    y + c[0] * sinA + c[1] * cosA
  ])
}

function collideRectRect(x1, y1, w1, h1, a1, x2, y2, w2, h2, a2) {
  let p1 = rectToPoly(x1, y1, w1, h1, a1)
  let p2 = rectToPoly(x2, y2, w2, h2, a2)
  return collidePolyPoly(p1, p2)
}

function collideCircleCircle(x1, y1, r1, x2, y2, r2) {
  let dx = x2 - x1, dy = y2 - y1
  return Math.hypot(dx, dy) < r1 + r2
}

function collideCircleRect(cx, cy, r, rx, ry, rw, rh, a) {
  let poly = rectToPoly(rx, ry, rw, rh, a)
  return collidePolyCircle(poly, cx, cy, r)
}

function collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
  if (den === 0) return false
  let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
  let u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / den
  return t >= 0 && t <= 1 && u >= 0 && u <= 1
}

function collideLineRay(x1, y1, x2, y2, x3, y3, x4, y4) {
  let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (den === 0) return false;
  let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
  let u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / den;
  if (t >= 0 && u >= 0 && u <= 1) {
    let px = x1 + t * (x2 - x1);
    let py = y1 + t * (y2 - y1);
    return [px, py];
  }
  return false;
}


function collideLineRect(x1, y1, x2, y2, rx, ry, rw, rh, a) {
  let poly = rectToPoly(rx, ry, rw, rh, a)
  for (let i = 0; i < poly.length; i++) {
    let j = (i + 1) % poly.length
    if (collideLineLine(x1, y1, x2, y2, poly[i][0], poly[i][1], poly[j][0], poly[j][1])) return true
  }
  return false
}

function collidePointRect(px, py, rx, ry, rw, rh, a) {
  let poly = rectToPoly(rx, ry, rw, rh, a)
  return collidePointPoly(px, py, poly)
}

function collidePointCircle(px, py, cx, cy, r) {
  let dx = px - cx, dy = py - cy
  return dx * dx + dy * dy <= r * r
}

function collidePolyPoly(p1, p2) {
  for (let i = 0; i < p1.length; i++) {
    let a1 = p1[i], a2 = p1[(i + 1) % p1.length]
    for (let j = 0; j < p2.length; j++) {
      let b1 = p2[j], b2 = p2[(j + 1) % p2.length]
      if (collideLineLine(a1[0], a1[1], a2[0], a2[1], b1[0], b1[1], b2[0], b2[1])) return true
    }
  }
  if (collidePointPoly(p1[0][0], p1[0][1], p2)) return true
  if (collidePointPoly(p2[0][0], p2[0][1], p1)) return true
  return false
}

function collidePointPoly(px, py, poly) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    let xi = poly[i][0], yi = poly[i][1]
    let xj = poly[j][0], yj = poly[j][1]
    let intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

function collidePolyCircle(poly, cx, cy, r) {
  for (let i = 0; i < poly.length; i++) {
    let a = poly[i], b = poly[(i + 1) % poly.length]
    if (collideLineCircle(a[0], a[1], b[0], b[1], cx, cy, r)) return true
  }
  return collidePointPoly(cx, cy, poly)
}

function collideLineCircle(x1, y1, x2, y2, cx, cy, r) {
  let acx = cx - x1, acy = cy - y1
  let abx = x2 - x1, aby = y2 - y1
  let ab2 = abx * abx + aby * aby
  let t = (acx * abx + acy * aby) / ab2
  t = Math.max(0, Math.min(1, t))
  let lx = x1 + abx * t, ly = y1 + aby * t
  let dx = lx - cx, dy = ly - cy
  return dx * dx + dy * dy <= r * r
}
