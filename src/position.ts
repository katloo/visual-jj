import { Type } from 'class-transformer';
import 'reflect-metadata';

export class Position {
	
	id: number;
	type: PositionType;
	name: string;
	details?: string;
	next?: Array<number> = [];
	parent?: number;
	visited?: Boolean = false;

	constructor() {
		this.next = [];
		this.visited = false;
	}
}

export enum PositionType {
	NORMAL = "NORMAL",
	COUNTER = "COUNTER"
}

export class Scenario {

	@Type(() => Position)
	positions: Position[]

	constructor(positions?: Position[]) {
		this.positions = positions === undefined ? [] : positions;
		console.log(this.positions);
	}
}
