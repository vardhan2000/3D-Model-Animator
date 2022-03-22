import {Transform} from './transform.js';


export class Shape{
    constructor(meshObj,color){
        this.meshObj = meshObj;
        this.vertexPositions = new Float32Array(this.meshObj.vertices);
        this.indexData = new Uint16Array(this.meshObj.indices);
        this.centerX = 0;
		this.centerY = 0;
        this.centerZ = 0;
        this.color = color;
        this.originalColor = color;
		this.transform = new Transform();
    }


    getCenterX(){
        return this.centerX;
    }

    getCenterY(){
        return this.centerY;
    }

    setCenterX(c){
        this.centerX = c;
    }

    setCenterY(c){
        this.centerY = c;
    }
}