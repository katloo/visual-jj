import { Renderer } from './render';
import { Attributes } from './attributes';
import { Scenario, Position, PositionType } from '../position';
import graphviz from 'graphviz';
import type { Graph } from 'graphviz';

jest.mock('graphviz');
const graphvizMock = graphviz as jest.Mocked<typeof graphviz>


const gMock = {
	setGraphVizPath: jest.fn(),
	output: jest.fn(),
	addNode: jest.fn(),
	addEdge: jest.fn()
} as unknown as Graph;

describe('Renderer class', () => {

	beforeEach(() => {
		jest.spyOn(graphviz, 'digraph').mockReturnValueOnce(gMock);
		gMock.addNode = jest.fn().mockReturnValue({});
	});
	afterEach(() => jest.resetAllMocks());

	it('does not render', async() => {
		const input = new Scenario([]);
		const renderer = new Renderer(input, 'output.svg');

		renderer.render();

		expect(gMock.addNode).toHaveBeenCalledTimes(0);
		expect(gMock.addEdge).toHaveBeenCalledTimes(0);
		expect(gMock.setGraphVizPath).toHaveBeenCalledTimes(0);
		expect(gMock.output).toHaveBeenCalledTimes(0);
	});

	it('renders 1 position', async() => {
		const positions = generatePositions(1);
		const input = new Scenario(positions);
		const renderer = new Renderer(input, 'output.svg');
		const expectedAttributes = {
			'color': Attributes.NORMAL.color,
			'style': Attributes.NORMAL.fillStyle,
			'xlabel': positions[0].details
		};


		renderer.render();

		expect(gMock.addNode).toHaveBeenCalledTimes(1);
		expect(gMock.addNode).toHaveBeenCalledWith(positions[0].name, expectedAttributes);
		expect(gMock.addEdge).toHaveBeenCalledTimes(0);
		expect(gMock.setGraphVizPath).toHaveBeenCalledTimes(1);
		expect(gMock.output).toHaveBeenCalledTimes(1);
	});

	it('renders 1 normal to 1 counter position', async() => {
		const positions = generatePositions(2);
		const input = new Scenario(positions);
		const renderer = new Renderer(input, 'output.svg');
		const expectedAttributes = [{
			'color': Attributes.NORMAL.color,
			'style': Attributes.NORMAL.fillStyle,
			'xlabel': positions[0].details
		},
		{
			'color': Attributes.COUNTER.color,
			'style': Attributes.COUNTER.fillStyle,
			'xlabel': positions[1].details
		}];


		renderer.render();

		expect(gMock.addNode).toHaveBeenCalledTimes(2);
		expect(gMock.addNode).toHaveBeenNthCalledWith(1, positions[0].name, expectedAttributes[0]);
		expect(gMock.addNode).toHaveBeenNthCalledWith(2, positions[1].name, expectedAttributes[1]);
		expect(gMock.addEdge).toHaveBeenCalledTimes(1);
		expect(gMock.addEdge).toHaveBeenCalledWith(positions[0].name, expect.anything());

		expect(gMock.setGraphVizPath).toHaveBeenCalledTimes(1);
		expect(gMock.output).toHaveBeenCalledTimes(1);
	});

	it('renders a loop with 1 normal to 1 counter position', async() => {
		const positions = generatePositions(2);
		positions[1].next = [0];
		const input = new Scenario(positions);
		const renderer = new Renderer(input, 'output.svg');
		const expectedAttributes = [{
			'color': Attributes.NORMAL.color,
			'style': Attributes.NORMAL.fillStyle,
			'xlabel': positions[0].details
		},
		{
			'color': Attributes.COUNTER.color,
			'style': Attributes.COUNTER.fillStyle,
			'xlabel': positions[1].details
		}];


		renderer.render();

		expect(gMock.addNode).toHaveBeenCalledTimes(3);
		expect(gMock.addNode).toHaveBeenNthCalledWith(1, positions[0].name, expectedAttributes[0]);
		expect(gMock.addNode).toHaveBeenNthCalledWith(2, positions[1].name, expectedAttributes[1]);
		expect(gMock.addNode).toHaveBeenNthCalledWith(3, positions[0].name, expectedAttributes[0]);

		expect(gMock.addEdge).toHaveBeenCalledTimes(2);
		expect(gMock.addEdge).toHaveBeenNthCalledWith(1, positions[0].name, expect.anything());
		expect(gMock.addEdge).toHaveBeenNthCalledWith(2, positions[1].name, expect.anything());


		expect(gMock.setGraphVizPath).toHaveBeenCalledTimes(1);
		expect(gMock.output).toHaveBeenCalledTimes(1);
	});
});

const generatePositions = (size: number): Array<Position> => {
	return Array.from(Array(size).keys()).map((_, i) => {
		const p = new Position();
		p.id = i;
		p.type = i % 2 == 0 ? PositionType.NORMAL : PositionType.COUNTER;
		p.name = `name_${i}`;
		p.details = `details_${i}`;
		if (i > 0) {
			p.parent = i - 1;
		}

		if (i < size - 1) {
			p.next = [i + 1];
		}

		return p;
	});	
}
