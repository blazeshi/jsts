import TreeMap from '../../../../java/util/TreeMap';
export default class NodeMap {
	constructor(...args) {
		this.nodeMap = new TreeMap();
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
	find(coord) {
		return this.nodeMap.get(coord);
	}
	iterator() {
		return this.nodeMap.values().iterator();
	}
	remove(pt) {
		return this.nodeMap.remove(pt);
	}
	values() {
		return this.nodeMap.values();
	}
	add(n) {
		this.nodeMap.put(n.getCoordinate(), n);
		return n;
	}
	getClass() {
		return NodeMap;
	}
}
