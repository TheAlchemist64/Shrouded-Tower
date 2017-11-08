import ROT from '../../vendor/rot';
import PriorityQueue from '../../vendor/priority-queue.min';

import { randFloor, distance } from '../game';
import TileMap from './map';
import Tile from './tile';
import TileTypes from './tiletypes';
import Item from '../item';
import Items from '../items';

const distFromExit = 25;

export default function generateMap(w,h){
	let map = new TileMap(w, h);
	let generator = new ROT.Map.Digger(w-1, h-1, { dugPercentage: 0.8});
	//Create Floor and Sky tiles
	generator.create((x, y, wall)=>{
		let SKY = TileTypes.SKY;
		let FLOOR = TileTypes.FLOOR;
		//let WALL = TileTypes.WALL;
		map.set(new Tile(x, y+1, wall ? SKY: FLOOR));
	});
	//Create Exit Key
	let rooms = generator.getRooms();
	let exitKey = rooms[Math.floor(ROT.RNG.getUniform() * rooms.length)].getCenter();
	delete map.floors[exitKey.join(',')];
	map.dropItem(new Item(
		Items.EXIT_KEY.name,
		Items.EXIT_KEY.glyph,
		Items.EXIT_KEY.event,
		Items.EXIT_KEY.slot,
		...exitKey));
	//Create Treasure Rooms;
	/*let numTreasureRooms = Math.floor(rooms.length/2);
	for(let i = 0; i < numTreasureRooms; i++){
		//Place Treasure
		let center = rooms[i].getCenter();
		map.dropItem(new Item(TileTypes.GOLD.name, TileTypes.GOLD.glyph, ...center));
		//Place Door
		rooms[i].getDoors((x, y)=>{
			map.set(new Tile(x, y+1, TileTypes.DOOR));
		});
	}*/
	//Create exit
	map.exit = randFloor(map);
	delete map.floors[map.exit.join(',')];
	//map.set(new Tile(map.exit[0], map.exit[1], TileTypes.EXIT));
	//Create start location
	let queue = new PriorityQueue({
		comparator: (a,b) => ROT.RNG.getUniform() * 2 - 1,
		initialValues: Object.keys(map.floors)
	});
	let [rX, rY] = [null, null];
	while(queue.length > 0){
		let f = queue.dequeue();
		[rX, rY] = f.split(',').map(x => Number(x));
		let dist = distance(...map.exit, rX, rY);
		if(dist >= distFromExit){
			break;
		}
	}
	map.start = { x: rX, y: rY };
	return map;
}
