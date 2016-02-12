import Exception from '../../../../../java/lang/Exception';
export default class NoninvertibleTransformationException extends Exception {
	constructor(...args) {
		super();
		const overloaded = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						super();
					})(...args);
				case 1:
					return ((...args) => {
						let [msg] = args;
						super(msg);
					})(...args);
			}
		};
		return overloaded.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	getClass() {
		return NoninvertibleTransformationException;
	}
}
