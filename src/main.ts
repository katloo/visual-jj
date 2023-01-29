import { Scenario } from './position';
import { Renderer } from './renderer/render';
import { deserialize } from 'class-transformer';
import fs from 'fs';

export const readInput = async (filename: string): Promise<Scenario> => {
	return fs.promises.readFile(filename, { encoding: 'utf-8' })
		.then((data) => deserialize(Scenario, data))
		.catch((err) => {
			throw new Error(`Failed to read file: ${filename}, message: ${err.message}`);
		});
};

export const render = async (scenario: Scenario, output: string) => {
	const renderer = new Renderer(scenario, output);
	renderer.render();
};


export const main = async (argv: Array<string>) => {
	console.log('argv.length: ' + argv.length);
	if (argv.length != 4) {
		console.log('Usage: yarn start <input>.json <output>.svg');
		process.exit(1);
	}

	const input = argv[2];
	const output = argv[3];

	if (input === undefined) {
		throw new Error('Input filename not defined');
	}

	if (output === undefined) {
		throw new Error('Output filename not defined');
	}
	const scenario: Scenario = await readInput(input);


	render(scenario, output);
};
