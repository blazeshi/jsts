import CGAlgorithms from '../algorithm/CGAlgorithms';
import CoordinateFilter from '../geom/CoordinateFilter';
import Coordinate from '../geom/Coordinate';
import Double from '../../../../java/lang/Double';
import LineSegment from '../geom/LineSegment';
import CoordinateSequenceFilter from '../geom/CoordinateSequenceFilter';
export default class SimpleMinimumClearance {
	constructor(...args) {
		this.inputGeom = null;
		this.minClearance = null;
		this.minClearancePts = null;
		switch (args.length) {
			case 1:
				{
					let [geom] = args;
					this.inputGeom = geom;
					break;
				}
		}
	}
	get interfaces_() {
		return [];
	}
	static get VertexCoordinateFilter() {
		return VertexCoordinateFilter;
	}
	static get ComputeMCCoordinateSequenceFilter() {
		return ComputeMCCoordinateSequenceFilter;
	}
	static getLine(g) {
		var rp = new SimpleMinimumClearance(g);
		return rp.getLine();
	}
	static getDistance(g) {
		var rp = new SimpleMinimumClearance(g);
		return rp.getDistance();
	}
	getLine() {
		this.compute();
		return this.inputGeom.getFactory().createLineString(this.minClearancePts);
	}
	updateClearance(...args) {
		switch (args.length) {
			case 3:
				{
					let [candidateValue, p0, p1] = args;
					if (candidateValue < this.minClearance) {
						this.minClearance = candidateValue;
						this.minClearancePts[0] = new Coordinate(p0);
						this.minClearancePts[1] = new Coordinate(p1);
					}
					break;
				}
			case 4:
				{
					let [candidateValue, p, seg0, seg1] = args;
					if (candidateValue < this.minClearance) {
						this.minClearance = candidateValue;
						this.minClearancePts[0] = new Coordinate(p);
						var seg = new LineSegment(seg0, seg1);
						this.minClearancePts[1] = new Coordinate(seg.closestPoint(p));
					}
					break;
				}
		}
	}
	compute() {
		if (this.minClearancePts !== null) return null;
		this.minClearancePts = new Array(2);
		this.minClearance = Double.MAX_VALUE;
		this.inputGeom.apply(new VertexCoordinateFilter(this));
	}
	getDistance() {
		this.compute();
		return this.minClearance;
	}
	getClass() {
		return SimpleMinimumClearance;
	}
}
class VertexCoordinateFilter {
	constructor(...args) {
		this.smc = null;
		switch (args.length) {
			case 1:
				{
					let [smc] = args;
					this.smc = smc;
					break;
				}
		}
	}
	get interfaces_() {
		return [CoordinateFilter];
	}
	filter(coord) {
		this.smc.inputGeom.apply(new ComputeMCCoordinateSequenceFilter(this.smc, coord));
	}
	getClass() {
		return VertexCoordinateFilter;
	}
}
class ComputeMCCoordinateSequenceFilter {
	constructor(...args) {
		this.smc = null;
		this.queryPt = null;
		switch (args.length) {
			case 2:
				{
					let [smc, queryPt] = args;
					this.smc = smc;
					this.queryPt = queryPt;
					break;
				}
		}
	}
	get interfaces_() {
		return [CoordinateSequenceFilter];
	}
	isGeometryChanged() {
		return false;
	}
	checkVertexDistance(vertex) {
		var vertexDist = vertex.distance(this.queryPt);
		if (vertexDist > 0) {
			this.smc.updateClearance(vertexDist, this.queryPt, vertex);
		}
	}
	filter(seq, i) {
		this.checkVertexDistance(seq.getCoordinate(i));
		if (i > 0) {
			this.checkSegmentDistance(seq.getCoordinate(i - 1), seq.getCoordinate(i));
		}
	}
	checkSegmentDistance(seg0, seg1) {
		if (this.queryPt.equals2D(seg0) || this.queryPt.equals2D(seg1)) return null;
		var segDist = CGAlgorithms.distancePointLine(this.queryPt, seg1, seg0);
		if (segDist > 0) this.smc.updateClearance(segDist, this.queryPt, seg1, seg0);
	}
	isDone() {
		return false;
	}
	getClass() {
		return ComputeMCCoordinateSequenceFilter;
	}
}
