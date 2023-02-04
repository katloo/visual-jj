import * as main from './main';
import { Scenario, Position, PositionType } from './position';
import fs from 'fs';

describe('main functions', () => {
	afterEach(() => jest.resetAllMocks());

	it('creates a Scenario with 2 positions', async() => {
		const input = `{ "positions": [{
					"id": 1,
					"type": "NORMAL",
					"name": "name",
					"details": "details",
					"next": [2]
				},
				{
					"id": 2,
					"type": "COUNTER",
					"name": "name2",
					"details": "details2",
					"parent": 1
				}]
		}`;
		jest.spyOn(fs.promises, 'readFile').mockResolvedValueOnce(input);


		const p0: Position = new Position();
		p0.id = 1;
		p0.type = PositionType.NORMAL;
		p0.name = "name";
		p0.details = "details",
		p0.next = [2];
		const p1: Position = new Position();
		p1.id = 2;
		p1.type = PositionType.COUNTER;
		p1.name = "name2";
		p1.details = "details2";
		p1.parent = 1;
		const expected: Scenario = new Scenario([p0, p1]);


		const result = await main.readInput('filename.json');
		expect(fs.promises.readFile).toHaveBeenCalledTimes(1);
		expect(result).toEqual(expected);
	});

	it('creates a Scenario with 0 positions for empty JSON', async() => {
		const input = '{}';
		jest.spyOn(fs.promises, 'readFile').mockResolvedValueOnce(input);

		const expected = new Scenario();

		const result = await main.readInput('filename.json');
		expect(fs.promises.readFile).toHaveBeenCalledTimes(1);
		expect(result).toEqual(expected);
	});

	it('throws error on empty file', async() => {
		const input = '';
		jest.spyOn(fs.promises, 'readFile').mockResolvedValueOnce(input);

		const result = () =>  main.readInput('filename.json');
		expect(result).rejects.toThrow('Failed to read file: filename.json, message: Unexpected end of JSON input');

		expect(fs.promises.readFile).toHaveBeenCalledTimes(1);
	});
}); 
