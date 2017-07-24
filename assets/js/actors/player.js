import Actor from '../actor';
import ROT from '../../../vendor/rot';
import Game from './../game';

export default class Player extends Actor{
	act(){
		Game.engine.lock();
		window.addEventListener('keydown',this);
	}
	handleEvent(e){
		let code = e.keyCode;
		let x = this.x;
		let y = this.y;
		switch(code){
			case ROT.VK_UP:
				super.move(x,y-1);
				break;
			case ROT.VK_RIGHT:
				super.move(x+1,y);
				break;
			case ROT.VK_DOWN:
				super.move(x,y+1);
				break;
			case ROT.VK_LEFT:
				super.move(x-1,y);
				break;
		}
		window.removeEventListener('keydown',this);
		Game.engine.unlock();
	}
}