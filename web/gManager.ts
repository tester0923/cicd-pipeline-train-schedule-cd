
import { _decorator, Component, Node } from 'cc';
import { Player } from './player';
const { ccclass, property } = _decorator;

 
@ccclass('GameManager')
export class GameManager extends Component {

    public static scriptPlayer: Player = null!;//玩家脚本

    @property(Node)
    public p:Node = null

    public static ndPlayer: Node = null!;//玩家节点

    start () {
        GameManager.ndPlayer = this.p;
        let scriptPlayer = GameManager.ndPlayer?.getComponent(Player) as Player;
        GameManager.scriptPlayer = scriptPlayer;
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
