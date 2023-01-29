import { PositionType } from '../position';

export class Attributes {
	public static readonly NORMAL = new Attributes('black', 'solid');
	public static readonly COUNTER = new Attributes('red', 'solid');

	private constructor(readonly color: string, readonly fillStyle: string) {
		this.color = color;
		this.fillStyle = fillStyle;	
	}

	public static getAttributes(positionType: PositionType): Attributes {
		switch (positionType) {
			case PositionType.NORMAL:
				return Attributes.NORMAL;
			case PositionType.COUNTER:
				return Attributes.COUNTER;
			default:
				throw new Error('invalid PositionType: ');
		}
	}
}
	