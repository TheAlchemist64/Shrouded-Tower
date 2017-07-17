import Enum from './enum';

export let TileTypes = new Enum('EMPTY','FLOOR','WALL');

export class Tile {
	constructor(x, y, chr){
		this.x = x;
		this.y = y;
		this.chr = chr;
	}
	draw(){
		
	}
}