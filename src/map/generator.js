import ROT from '../../vendor/rot';

import { distance } from '../utils';
import TileMap from './map';
import Tile from './tile';
import FloorPicker from '../floorpicker';
import TileTypes from './tiletypes';
import ItemFactory from '../itemfactory';

const distFromExit = 20;

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
	map.exitKey = rooms[Math.floor(ROT.RNG.getUniform() * rooms.length)].getCenter();
	delete map.floors[map.exitKey.join(',')];
	ItemFactory.createItem('EXIT_KEY', map, ...map.exitKey);
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
	//map.set(new Tile(map.exit[0], map.exit[1], TileTypes.EXIT));
	//Create start location
	FloorPicker.setMap(map);
	let [eX, eY] = [null, null];
	let done = [];
	while(!FloorPicker.empty()){
		let pick = FloorPicker.pick();
		[eX, eY] = pick.split(',').map(x => Number(x));
		if(distance(map.exitKey[0], map.exitKey[1], eX, eY) >= distFromExit){
			break;
		}
		else{
			done.push(pick);
		}
	}
	map.exit = [eX, eY];
	delete map.floors[map.exit.join(',')];
	done.forEach(pick => FloorPicker.put(pick));
	let f = FloorPicker.pick();
	let [rX, rY] = f.split(',').map(x => Number(x));
	map.start = { x: rX, y: rY };
	return map;
}
