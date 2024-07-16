
import { _decorator, Component, Node ,UITransformComponent, Vec3} from 'cc';
import { GameManager } from './gameManager';
const { ccclass, property } = _decorator;


 
@ccclass('Joystick')
export class Joystick extends Component {

    @property(Node)
    public stick:Node = null;

    @property(Node)
    public ring:Node = null;

    public isMoving: boolean = false;//是否正在移动

    private _touchStartLocation: Vec3 = new Vec3();//开始触碰位置
    private _movePos: Vec3 = new Vec3();//移动坐标
    private _angle: number = 0;//当前的角度
    private _distanceRate: number = 0; //遥感移动距离比
    

    start () {
        this.stick.on(Node.EventType.TOUCH_MOVE,function(e){
            let touch = e.getUILocation();
            this._touchStartLocation.set(touch.x, touch.y, 0);
            let touchPos = this.ring.getComponent(UITransformComponent)?.convertToNodeSpaceAR(this._touchStartLocation) as Vec3;
            //触摸点与圆圈中心的距离
            let distance = touchPos.length();
            let width = this.ring.getComponent(UITransformComponent)?.contentSize.width as number;
            //圆圈半径
            let radius = width / 2;
            let rate = 0;
            //手指在圆圈内触摸,控杆跟随触摸点
            if (radius > distance) {
                rate = Number((distance / radius).toFixed(3));
                this.stick.setPosition(touchPos);
            }else{
                rate = 1;
                //控杆永远保持在圈内，并在圈内跟随触摸更新角度
                let radian = Math.atan2(touchPos.y, touchPos.x);
                
                let x = Math.cos(radian) * radius;
                let y = Math.sin(radian) * radius;
                this._movePos.set(x, y, 0);
                this.stick.setPosition(this._movePos);
            }

            // 更新角度
            this._updateAngle(touchPos);

            // 更新遥感移动距离百分比
            this._distanceRate = rate;
            console.log("百分比",this._distanceRate)

            this.isMoving = true;

        },this)

        this.stick.on(Node.EventType.TOUCH_END,function(e){
            this.stick.setPosition(new Vec3(0,0,0))
            this.isMoving = false;
        },this)

        this.stick.on(Node.EventType.TOUCH_CANCEL,function(e){
            this.stick.setPosition(new Vec3(0,0,0))
            this.isMoving = false;
        },this)

    }


    private _updateAngle (pos: Vec3) {
        this._angle = Math.round(Math.atan2(pos.y, pos.x) * 180 / Math.PI);
        console.log("角度",this._angle)
        return this._angle;
    }

    update (deltaTime: number) {
        if (this.isMoving) {
            GameManager.scriptPlayer.playAction({action: 1, value: this._angle});
        } else {
            this.isMoving = false;
            if (GameManager.scriptPlayer.isMoving) {
                GameManager.scriptPlayer.playAction({action: 2});
            }
        }
    }
}
