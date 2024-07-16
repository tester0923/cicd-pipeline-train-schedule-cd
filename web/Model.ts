
import { _decorator, Component, Node, SkeletalAnimationState, Vec3, SkeletalAnimationComponent ,AnimationClip} from 'cc';
import { GameManager } from './gameManager';
const { ccclass, property } = _decorator;


@ccclass('PlayerModel')
export class PlayerModel extends Component {
    private _aniType: string = "";//动画类型
    private _aniState: SkeletalAnimationState = null!;//动画播放状态
    private _stepIndex: number = 0;//脚步
    public looseEulerAngles: Vec3 = new Vec3();//射箭时的角度
    public isAniPlaying: boolean = false;//当前动画是否正在播放

    // @property(Node)
    // public ndArrow: Node = null!;//攻击时候展示的弓箭

    @property(SkeletalAnimationComponent)
    public aniComPlayer: SkeletalAnimationComponent = null!;//动画播放组件

    //是否正在跑
    public get isRunning() {
        return this._aniType === "run" && this.isAniPlaying === true;
    }

    //是否站立
    public get isIdle() {
        return this._aniType === "idle" && this.isAniPlaying === true;
    }

    //是否正在攻击
    public get isAttacking() {
        return this._aniType === "attack" && this.isAniPlaying === true;
    }

    start() {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    /**
        * 播放玩家动画
        *
        * @param {string} aniType 动画类型
        * @param {boolean} [isLoop=false] 是否循环
        * @param {Function} [callback] 回调函数
        * @param {number} [callback] 调用播放动画的位置，方便用于测试
        * @returns
        * @memberof Player
        */
    public playAni(aniType: string, isLoop: boolean = false, callback?: Function, pos?: number) {
        this._aniState = this.aniComPlayer?.getState(aniType) as SkeletalAnimationState;
        console.log(this._aniState)

        if (this._aniState && this._aniState.isPlaying) {
            return;
        }

        this._aniType = aniType;

        if (this._aniType !== "attack") {
            this.hideArrow();
        }

        this.aniComPlayer?.play(aniType);
        this.isAniPlaying = true;

        if (this._aniState) {
            if (isLoop) {
                this._aniState.wrapMode = AnimationClip.WrapMode.Loop;
            } else {
                this._aniState.wrapMode = AnimationClip.WrapMode.Normal;
            }

            switch (aniType) {
                case "attack":
                    this._aniState.speed = 1;
                    GameManager.scriptPlayer.hideRunSmoke();
                    break;
                case "run":
                    this._aniState.speed = 1 * (GameManager.scriptPlayer.curMoveSpeed / 7);
                    console.log("动画",this._aniState.speed)
                    GameManager.scriptPlayer.playRunSmoke();
                    break;
                case "idle":
                    this._aniState.speed = 1;
                    break;
                default:
                    this._aniState.speed = 1;
                    break;
            }
        }

        if (!isLoop) {
            this.aniComPlayer.once(SkeletalAnimationComponent.EventType.FINISHED, () => {
                this.isAniPlaying = false;
                callback && callback();
            })
        }
    }

    public hideArrow () {
        // this.ndArrow.active = false;
        console.log("隐藏弓箭")
    }

    
}
