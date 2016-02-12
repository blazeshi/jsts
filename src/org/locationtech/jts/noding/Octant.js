import Coordinate from '../geom/Coordinate';
import IllegalArgumentException from '../../../../java/lang/IllegalArgumentException';
export default class Octant {
	constructor(...args) {
		switch (args.length) {
			case 0:
				{
					let [] = args;
					break;
				}
		}
	}
	get interfaces_() {
		return [];
	}
	static octant(...args) {
		switch (args.length) {
			case 2:
				if (typeof args[0] === "number" && typeof args[1] === "number") {
					let [dx, dy] = args;
					if (dx === 0.0 && dy === 0.0) throw new IllegalArgumentException("Cannot compute the octant for point ( " + dx + ", " + dy + " )");
					var adx = Math.abs(dx);
					var ady = Math.abs(dy);
					if (dx >= 0) {
						if (dy >= 0) {
							if (adx >= ady) return 0; else return 1;
						} else {
							if (adx >= ady) return 7; else return 6;
						}
					} else {
						if (dy >= 0) {
							if (adx >= ady) return 3; else return 2;
						} else {
							if (adx >= ady) return 4; else return 5;
						}
					}
				} else if (args[0] instanceof Coordinate && args[1] instanceof Coordinate) {
					let [p0, p1] = args;
					var dx = p1.x - p0.x;
					var dy = p1.y - p0.y;
					if (dx === 0.0 && dy === 0.0) throw new IllegalArgumentException("Cannot compute the octant for two identical points " + p0);
					return Octant.octant(dx, dy);
				}
				break;
		}
	}
	getClass() {
		return Octant;
	}
}
