import graphviz from 'graphviz';
import util from 'util';
import { Scenario, Position, PositionType } from '../position';
import { Attributes } from './attributes';


export class Renderer {

	private positions: Array<Position>;
	private idToPositionMap: Map<number, Position>;
	private output: string;

	constructor(scenario: Scenario, output: string) {
		this.positions = scenario.positions;
		this.idToPositionMap = this.buildIdToPositionMap(scenario.positions);
		this.output = output;
	}

	public render() {
		if (this.positions.length == 0) {
			// no positions to render
			return;
		}

		// Create digraph G
		const g = graphviz.digraph("G");

		let queue: Array<Position>
		queue = [];

		queue.unshift(this.positions[0]);

		while (queue.length > 0) {
			const node: Position = queue.shift()!;

			console.log(`LOOKING AT: ${node.name}`);
			const parent = node.parent !== undefined ? this.getPositionsFromIds([node.parent])[0] : undefined;
			
			this.renderNode(g, node, parent);

			if (node.next !== undefined && node.next!.length > 0) {
				this.getPositionsFromIds(node.next!).forEach(nextPos => {
					if (nextPos.visited === false) {
						queue.unshift(nextPos);
					} else {
						// the "next" position was already processed, meaning the current node should only be drawn as a parent to the "next"
						this.renderNode(g, nextPos, node);
					}
				});
			}
		}

		// Set GraphViz path (if not in your path)
		g.setGraphVizPath( "/usr/local/bin" );
		// Generate an SVG output
		g.output("svg", this.output);
	}

	buildIdToPositionMap(positions: Array<Position>): Map<number, Position> {
		const result = new Map();
		positions.forEach(pos => {
			result.set(pos.id, pos);
		});

		return result;
	}

	getPositionsFromIds(next: Array<number>): Array<Position> {
		const result: Array<Position> = [];
		next.forEach(index => {
			const position = this.idToPositionMap.get(index);
			if (position === undefined) {
				throw new Error(`position with id not found: ${index}`);
			}
			result.push(position);
		});

		return result;
	}

	renderNode(graph, node: Position, parent?: Position) {
		node.visited = true;

		const attributes = Attributes.getAttributes(node.type);
		const attr = {
			'color': attributes.color,
			'style': attributes.fillStyle,
			'xlabel': node.details
		};
		const n1 = graph.addNode(node.name, attr);
		if (parent === undefined) {
			return;
		}

		// add edge from parent to current node
		graph.addEdge(parent!.name, n1);

		return;
	}

}
