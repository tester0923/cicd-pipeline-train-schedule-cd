
import { _decorator, Component, Node, RigidBodyComponent, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

const v3_0 = new Vec3();
const v3_1 = new Vec3();
 
@ccclass('CharacterRigid')
export class CharacterRigid extends Component {
    private _curMaxSpeed: number = -1;//当前最大速度
    protected _stateX: number = 0;  // 1 positive, 0 static, -1 negative
    protected _stateZ: number = 0;
    private _rigidBody: RigidBodyComponent = null!;
    private _grounded = true;//是否着地
    private _velocity = new Vec3();//线性速度

    onLoad () {
        this._rigidBody = this.getComponent(RigidBodyComponent)!;
    }

    start () {
        // [3]
    }

    public initSpeed (moveSpeed: number,  ratio: number = 1) {
        this._curMaxSpeed = moveSpeed * ratio;
    }

    /**
     * 角色移动传入x和z
     *
     * @param {number} x
     * @param {number} z
     */
    public move (x: number, z: number) {
        if ((x > 0 && this._stateX < 0) || (x < 0 && this._stateX > 0) || (z > 0 && this._stateZ < 0) || (z < 0 && this._stateZ > 0)) {
            this.clearVelocity();
            // console.log("方向不一致则清除速度,避免惯性太大");
        }
        console.log(x,z)
        this._stateX = 1;
        this._stateZ = 1;
        // console.log("_stateX", this._stateX, "z", this._stateZ);
    }

    /**
     * 刚体停止移动
     *
     */
    public stopMove () {
        this._stateX = 0;
        this._stateZ = 0;
        this.clearVelocity();
    }

    get onGround () { return this._grounded; }
        /**
     * 清除移动速度
     */
    public clearVelocity () {
        this._rigidBody.clearVelocity();
    }
    update (deltaTime: number) {
        const dt = 1000 / 60;
        this._updateCharacter(dt);
    }


    

        /**
     * 刷新
     * @param dt 
     */
        public updateFunction (dt: number) {
            // if (GameManager.isGameStart && !GameManager.isGameOver && !GameManager.isGamePause) {
                this._saveState();
            // }
        }

           /**
     * 获取线性速度
     *
     * @private
     */
    private _saveState () {
        this._rigidBody.getLinearVelocity(this._velocity);
        // console.log('getLinearVelocity3' + this._velocity  + ":" + this._grounded);
    }
    /**
     * 刚体移动
     *
     * @param {Vec3} dir
     * @param {number} speed
     */
    public rigidMove (dir: Vec3, speed: number) {
        console.log(2222)
        this._rigidBody.getLinearVelocity(v3_1);
        Vec3.scaleAndAdd(v3_1, v3_1, dir, speed);

        const ms = this._curMaxSpeed;
        const len = v3_1.lengthSqr();
        if (len > ms) {
            v3_1.normalize();
            v3_1.multiplyScalar(ms);
        }
        this._rigidBody.setLinearVelocity(v3_1);

        // console.log('setLinearVelocity1' + v3_1);
    }


    /**
     * 更新刚体状态
     *
     * @private
     * @param {number} dt
     * @return {*} 
     */
    private _updateCharacter (dt: number) {
        this.updateFunction(dt);
        
        if (!this.onGround) return;
        if (this._stateX || this._stateZ) {
            console.log(33)
            v3_0.set(this._stateX, 0, this._stateZ);
            v3_0.normalize().negative();
            this.rigidMove(v3_0, 1);
        }
    }
}
