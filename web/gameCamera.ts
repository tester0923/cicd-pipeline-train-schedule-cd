import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('GameCamera')
export class GameCamera extends Component {

    @property(Node)
    public ndFollowTarget: Node = null!;//相机跟随的目标节点

    private _oriCameraWorPos: Vec3 = new Vec3();//初始相机世界坐标
    private _targetCameraWorPos: Vec3 = new Vec3();//目标相机世界坐标
    private _curCameraWorPos: Vec3 = new Vec3();//目标相机世界坐标
    private _orindFollowTargetWorPos: Vec3 = new Vec3();
    private offset: Vec3 = new Vec3(); //差值

    start () {
        this._oriCameraWorPos = this.node.worldPosition.clone();
        this._orindFollowTargetWorPos = this.ndFollowTarget.worldPosition.clone();
        
        this.offset = this._oriCameraWorPos.subtract(this._orindFollowTargetWorPos);
        this.resetCamera()
    }

    public resetCamera () {
        this._targetCameraWorPos.set(this._oriCameraWorPos);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    lateUpdate () {
        if (!this.ndFollowTarget || !this.ndFollowTarget.worldPosition) {
            return;
        }

        this._orindFollowTargetWorPos = this.ndFollowTarget.worldPosition.clone();
        this._targetCameraWorPos = this._targetCameraWorPos.lerp(this._orindFollowTargetWorPos.add(this.offset), 0.5);
        this.node.setWorldPosition(this._targetCameraWorPos);
    }
}