
import { Component } from "../../../components/Component";
import { Matrix4x4 } from "../../../maths/Matrix4x4";
import { Quaternion } from "../../../maths/Quaternion";
import { Vector3 } from "../../../maths/Vector3";
import { TextResource } from "../../../resource/TextResource";
import { NavModifleData } from "../../common/data/NavModifleData";
import { NavigationUtils } from "../../common/NavigationUtils";
import { NavTileData } from "../../common/NavTileData";
import { NavigationManager, NavObstaclesMeshType } from "../NavigationManager";
import { BaseNav3DModifle } from "./BaseNav3DModifle";



/**
 * <code>NavMeshObstacles</code> 常用形状。
 */
export class NavMeshObstacles extends BaseNav3DModifle {

    /**@internal */
    static _boundMin:Vector3 = new Vector3(-0.5, -0.5, -0.5);

    /**@internal */
    static _boundMax:Vector3 = new Vector3(0.5, 0.5, 0.5);
    
    /**@internal */
    static _TempVec3: Vector3 = new Vector3();


    /**@internal */
    private _meshType: NavObstaclesMeshType = NavObstaclesMeshType.BOX;
    /**@internal */
    private _localMat: Matrix4x4;
    /**@internal */
    private _center: Vector3 = new Vector3(0, 0, 0);
    /**@internal */
    private _size: Vector3 = new Vector3(1, 1, 1);
    /**@internal */
    private _height: number = 1;
    /**@internal */
    private _radius: number = 0.5;


    /**@internal load*/
    _oriTiles: NavTileData;

    set meshType(value: NavObstaclesMeshType) {
        if (this._meshType == value)
            return;
        this._meshType = value;
        this._changeData();
        this._onWorldMatNeedChange();
    }

    get meshType() {
        return this._meshType;
    }

    /**
     * 中心偏移
     */
    set center(value: Vector3) {
        value.cloneTo(this._center);
        this._onWorldMatNeedChange();
    }

    get center() {
        return this._center;
    }

    /**
     * box size
     */
    set size(value: Vector3) {
        value.cloneTo(this.size);
        if (this._meshType == NavObstaclesMeshType.BOX) {
            this._onWorldMatNeedChange();
        }
    }

    get size() {
        return this._size;
    }

    /**
     * 圆柱高
     */
    set height(value: number) {
        this._height = value;
        if (this._meshType == NavObstaclesMeshType.CYLINDER) {
            this._onWorldMatNeedChange();
        }
    }

    get height() {
        return this._height;
    }

    /**
     * 圆柱半径
     */
    set radius(value: number) {
        this._radius = value;
        if (this._meshType == NavObstaclesMeshType.CYLINDER) {
            this._onWorldMatNeedChange();
        }
    }

    get radius() {
        return this._radius;
    }

    
    /**
     * obstracle resource 
     */
    set datas(value: TextResource) {
        if(this._oriTiles){
            this._oriTiles.destroy();
            this._oriTiles = null;
        }
        if(value != null){
            this._oriTiles = new NavTileData(value);
        }
        this._changeData();
        this._onWorldMatNeedChange();
    }

    get datas(): TextResource {
        if(this._oriTiles) return this._oriTiles._res;
        return null;
    }
    
    constructor() {
        super();
        this._localMat = new Matrix4x4();
        this._modifierData = new NavModifleData();
    }

    /**@internal */
    protected _onEnable(): void {
        // this._dtNavTileCache.init(BaseNavigationManager.getNavMeshData(this._meshType).bindData);
        this._changeData();
        super._onEnable();
        let min = this._modifierData._min;
        let max = this._modifierData._max;
        let surface = this._manager.getNavMeshSurfacesByBound(min,max,this._modifierData.agentType);
        (<NavModifleData>this._modifierData)._initSurface(surface);
    }


    /**
     * @internal
     */
    _refeashTranfrom(mat: Matrix4x4, min:Vector3,max:Vector3) {
        if (this._meshType == NavObstaclesMeshType.BOX) {
            Matrix4x4.createAffineTransformation(this._center, Quaternion.DEFAULT, this._size, this._localMat);
        } else {
            NavMeshObstacles._TempVec3.setValue(this.radius, this.height, this.radius);
            Matrix4x4.createAffineTransformation(this._center, Quaternion.DEFAULT, NavMeshObstacles._TempVec3, this._localMat);
        }
        Matrix4x4.multiply(mat, this._localMat, this._modifierData._transfrom);
        let data = this._modifierData as NavModifleData;
        if(data.datas == null) return;
        let boundmin = data.datas._boundMin;
        let boundmax = data.datas._boundMax;
        NavigationUtils.transfromBoundBox(boundmin,boundmax,this._modifierData._transfrom,min,max);
        this._modifierData._refeahTransfrom();
    }

     /**@internal */
    _changeData() {
        if(!this._enabled) return;
        let modiferData = this._modifierData as NavModifleData;
        switch (this._meshType) {
            case NavObstaclesMeshType.BOX:
                modiferData.datas = NavigationManager.getObstacleData(NavObstaclesMeshType.BOX);
                break;
            case NavObstaclesMeshType.CYLINDER:
                modiferData.datas = NavigationManager.getObstacleData(NavObstaclesMeshType.CYLINDER);
                break;
            case NavObstaclesMeshType.CUSTOMER:
                if(this._oriTiles){
                    modiferData.datas = this._oriTiles.getNavData(0);
                }else{
                    modiferData.datas = null;
                }
                break;
            default:
                console.error("NavMesh2DObstacles:meshType error");
                break;
        }
    }

    /**@internal */
    protected _onDestroy(): void {
        super._onDestroy();
    }

    /**@internal */
    _cloneTo(dest: Component): void {
        let obstacles = dest as NavMeshObstacles;
        this._center.cloneTo(obstacles.center);
        obstacles._meshType = this._meshType;
        this.size.cloneTo(obstacles.size);
        obstacles.radius = this.radius;
        obstacles.height = this.height;
        super._cloneTo(dest);
    }

}