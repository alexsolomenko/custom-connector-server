export class Utils {
	static getValue(obj: Object, key: string) {
		if (obj) {
			let _key = key.toLowerCase();
			let field = Object.keys(obj).find(k => k.toLowerCase() == _key);
			if (field)
				return obj[field];
		}
		return undefined;
	}
}