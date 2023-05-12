function degrees(radians: number) {
	return radians * (180 / Math.PI);
}

interface Point {
	x: number;
	y: number;
	z: number;
}

export function calcAngle(a: Point, b: Point, c: Point) {
	const v1 = {
		x: a.x - b.x,
		y: a.y - b.y,
		z: a.z - b.z
	};

	const v2 = {
		x: c.x - b.x,
		y: c.y - b.y,
		z: c.z - b.z
	};

	const v1mag = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
	const v1norm = {
		x: v1.x / v1mag,
		y: v1.y / v1mag,
		z: v1.z / v1mag
	};

	const v2mag = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
	const v2norm = {
		x: v2.x / v2mag,
		y: v2.y / v2mag,
		z: v2.z / v2mag
	};

	const res = v1norm.x * v2norm.x + v1norm.y * v2norm.y + v1norm.z * v2norm.z;
	const angle_rad = Math.acos(res);
	return degrees(angle_rad);
}
