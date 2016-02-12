import Boundable from './Boundable';
import Serializable from '../../../../../java/io/Serializable';
export default class ItemBoundable {
	constructor(...args) {
		this.bounds = null;
		this.item = null;
		switch (args.length) {
			case 2:
				{
					let [bounds, item] = args;
					this.bounds = bounds;
					this.item = item;
					break;
				}
		}
	}
	get interfaces_() {
		return [Boundable, Serializable];
	}
	getItem() {
		return this.item;
	}
	getBounds() {
		return this.bounds;
	}
	getClass() {
		return ItemBoundable;
	}
}
