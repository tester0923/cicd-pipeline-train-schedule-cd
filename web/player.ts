
import { _decorator, Component, Node, Vec3, macro ,Quat ,geometry, RigidBodyComponent, CapsuleColliderComponent} from 'cc';
import { CharacterRigid } from './CharacterRigid';
import { PlayerModel } from './playerModel';
const { ccclass, property } = _decorator;

let qt_0 = new Quat();
let v3_0 = new Vec3();
let v3_1 = new Vec3();
let v3_2 = new Vec3();
const ray: geometry.Ray = new geometry.Ray();

 
@ccclass('Player')
export class Player extends Component {

    private _isDie: boolean = false;//主角是否阵亡
    private _curAngleY: number = 0;//当前Y分量旋转角度
    public isMoving: boolean = false;//玩家是否正在移动
    private _horizontal: number = 0;//水平移动距离
    private _vertical: number = 0;//垂直移动距离
    private _targetAngle: Vec3 = new Vec3();//目标旋转角度
    private _ndTarget: Node = null!;//目标小怪
    private _throwArrowSpeed: number = 30;//弓箭速30
    private _arrowPos: Vec3 = new Vec3();//箭初始化位置
    private _bloodTipOffsetPos: Vec3 = new Vec3(-10, 150, 0);//血量提示和玩家间距
    private _playerMonsterOffset: Vec3 = new Vec3();//小怪和玩家间距
    private _isUseFullAngle: boolean = true;//是否使用360度旋转，否则使用8方向旋转
    private _oriPlayerPos: Vec3 = new Vec3(0, 1.7, 0);//玩家初始世界坐标
    private _oriPlayerScale: Vec3 = new Vec3(4, 4, 4);//玩家初始缩放倍数
    private _oriPlayerAngle: Vec3 = new Vec3(0, -90, 0);//玩家初始角度
    private _curAngle: Vec3 = new Vec3()//当前玩家旋转的角度
    private _curAngle_2: Vec3 = new Vec3();//玩家角度
    private _rotateDirection: Vec3 = new Vec3();//旋转方向
    private _curWorPos: Vec3 = new Vec3();//玩家当前世界坐标
    private _ndRunSmokeEffect: Node = null!;//烟雾特效
    private _originAngle: Vec3 = new Vec3(0, -90, 0);//玩家开始角度
    private _tempAngle: Vec3 = new Vec3();//临时变量，玩家角度
    private _forWard: Vec3 = new Vec3();//朝向
    private _range: number = 0.01;//
    private _curMoveSpeed: number = 0;//当前玩家移动速度

    public scriptCharacterRigid: CharacterRigid = null!;

    public isPlayRotate: boolean = false;//是否旋转

    @property(PlayerModel)
    public scriptPlayerModel: PlayerModel = null!;//玩家动画组件播放脚本

    @property(RigidBodyComponent)
    public rigidComPlayer: RigidBodyComponent = null!;

    @property(CapsuleColliderComponent)
    public colliderComPlayer: CapsuleColliderComponent = null!;
    

    public set curMoveSpeed (v: number) {
        this._curMoveSpeed = v;
        this.scriptCharacterRigid.initSpeed(v);
    }

    public get curMoveSpeed () {
        return this._curMoveSpeed;
    }
    start () {
        // [3]
        this.scriptCharacterRigid = this.node.getComponent(CharacterRigid) as CharacterRigid;
    }

    /**
     * 玩家行为
     *
     * @param {*} obj
     * @memberof Player
     */
    public playAction (obj: any) {
        if (this.isDie) {
            return;
        }

        switch (obj.action) {
            case 1:
                let angle = obj.value + 135;
                let radian = angle * macro.RAD;
                this._horizontal = Math.round(Math.cos(radian) * 1);
                this._vertical = Math.round(Math.sin(radian) * 1);  
                this.isMoving = true;
                this._curAngleY = obj.value;
                this._curAngleY = this._curAngleY < 0 ? this._curAngleY + 360 : this._curAngleY > 360 ? this._curAngleY - 360 : this._curAngleY;
                console.log("移动")
                break;
            case 2:
                this._horizontal = 0;
                this._vertical = 0;
                this._onPlayerStopMove();
                this.isMoving = false;
                break;
            default:
                break;
        }
    }

    public get isDie () {
        return this._isDie;
    }


    private _onPlayerStopMove () {
        
    }


    update (deltaTime: number) {
        //玩家旋转
        if (this.isPlayRotate) {
            //当前玩家角度
            this._tempAngle.set(this.node.eulerAngles);
            this._tempAngle.y = this._tempAngle.y < 0 ? this._tempAngle.y + 360 : this._tempAngle.y;

            this.node.eulerAngles = this._tempAngle;

            this._curAngle.set(0, this._tempAngle.y, 0);

            if (this._horizontal === 0 && this._vertical === 0) {
                this._range = 0.1;
            } else {
                this._range = 0.01;
            }

            //第二个参数越小朝向敌人越精确
            let isEqual = this._curAngle.equals(this._targetAngle, this._range);

            if (!isEqual) {
                Vec3.lerp(this._curAngle, this._curAngle, this._targetAngle, 0.167);
                this.node.eulerAngles = this._curAngle;
            } else {
                this.isPlayRotate = false;
                this.node.eulerAngles = this._targetAngle;
            }
        }

        if (this._horizontal !== 0 || this._vertical !== 0) {
            //计算出旋转角度
            this._rotateDirection.set(this._horizontal, 0, -this._vertical);
            this._rotateDirection.normalize();
            Quat.fromViewUp(qt_0, this._rotateDirection);
            Quat.toEuler(v3_0, qt_0);
            v3_0.y = v3_0.y < 0 ? v3_0.y + 360 : v3_0.y;

            // console.log("v3_0", v3_0.y);

            this.isPlayRotate = true;
            
            //设置当前玩家角度为正数
            this._curAngle_2.set(this.node.eulerAngles);
            if (this._curAngle_2.y < 0) {
                this._curAngle_2.y += 360;
                this.node.eulerAngles = this._curAngle_2; // 转为0~360
            } else if (this._curAngle_2.y > 360) {
                this._curAngle_2.y -= 360;
                this.node.eulerAngles = this._curAngle_2; // 转为0~360
            }

            //设置目标旋转角度
            if (!v3_0.equals(this.node.eulerAngles, 0.01)) {
                    this._targetAngle.y = this._curAngleY + 225; 
                    this._targetAngle.y = this._targetAngle.y < 0 ? this._targetAngle.y + 360 : this._targetAngle.y > 360 ? this._targetAngle.y - 360 : this._targetAngle.y;
                    this._targetAngle.set(0, this._targetAngle.y, 0);

                    if (Math.abs(this._targetAngle.y - this._curAngle_2.y) > 180) {
                        if (this._targetAngle.y > this._curAngle_2.y) {
                            this._targetAngle.y -= 360;
                        } else {
                            this._targetAngle.y += 360;
                        }
                    }

                    // console.log("this._targetAngle.y", this._targetAngle.y);
            } else {
                this.isPlayRotate = false;
                this.node.eulerAngles = v3_0;
            }

            if (!this.isMoving) {
                return;
            }

            this.scriptCharacterRigid.move(this._rotateDirection.x * this.curMoveSpeed * 0.5 * deltaTime, this._rotateDirection.z * this.curMoveSpeed * 0.5 * deltaTime);
            console.log("是在跑move",this.scriptPlayerModel.isRunning)
            if (!this.scriptPlayerModel.isRunning && !this.isDie) {
                console.log("是在跑")
                this.scriptPlayerModel.playAni("run", true);
            }
        } else {
            if (!this.isDie && !this.scriptPlayerModel.isIdle && !this.scriptPlayerModel.isAttacking) {
                this.scriptPlayerModel.playAni("idle", true);
                this.scriptCharacterRigid.stopMove();
            }
        }
    }

        /**
     * 攻击的时候隐藏烟雾
     *
     * @memberof Player
     */
        public hideRunSmoke () {
            // if (this._ndRunSmokeEffect && this._ndRunSmokeEffect.active) {
            //     this._ndRunSmokeEffect.active = false;
                console.log("隐藏烟雾");
            // }
       }

     /**
     * 奔跑的时候加个烟雾
     *
     * @memberof Player
     */
     public playRunSmoke () {
        console.log("展示烟雾");

        // if (!this._ndRunSmokeEffect) {
        //     resourceUtil.loadEffectRes("runSmoke/runSmoke").then((pf: any)=>{
        //         this._ndRunSmokeEffect = poolManager.instance.getNode(pf, this.node);
        //         this._ndRunSmokeEffect.active = true;    
        //         EffectManager.instance.playTrail(this._ndRunSmokeEffect);
        //     });
        // } else {
        //     this._ndRunSmokeEffect.active = true;
        //     EffectManager.instance.playTrail(this._ndRunSmokeEffect);
        // }
    }
}