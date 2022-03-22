import { Scene, Cube, WebGLRenderer, Shader, Camera, Shape } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';
import * as dat from 'https://cdn.skypack.dev/dat.gui';
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';

let camera = new Camera();

const scene = new Scene(camera);

async function meshObject(filePath){
	const response = await fetch(filePath);
	const text = await response.text();
	return new objLoader.Mesh(text);
}


let mesh_AxisX = await meshObject('./arrowX.obj');
let axisX = new Shape(mesh_AxisX,[1,0,0,1]); // Red=X

let mesh_AxisY = await meshObject('./arrowY.obj');
let axisY = new Shape(mesh_AxisY,[0,1,0,1]); // Green=Y

let mesh_AxisZ = await meshObject('./arrowZ.obj');
let axisZ = new Shape(mesh_AxisZ,[0,0,1,1]); // Blue=Z


axisX.transform.scale = [0.424,0.424,0.424];
axisY.transform.scale = [0.424,0.424,0.424];
axisZ.transform.scale = [0.424,0.424,0.424];

scene.add(axisX);
scene.add(axisY);
scene.add(axisZ);

const renderer = new WebGLRenderer();
renderer.setSize( 600, 600 );
document.body.appendChild( renderer.domElement );

window.projMatrix = mat4.create();
mat4.perspective(window.projMatrix,45*Math.PI/180,1,0.1,1000);

const shader = new Shader(renderer.glContext(), vertexShaderSrc, fragmentShaderSrc);
shader.use();

let mode = 0

const transformSettings = {
	translateX: 0,
	translateY: 0,
	translateZ: 0,
	rotateX: 0,
	rotateY: 0,
	rotateZ: 0
}


const gui0 = new dat.GUI();
let items0 = new Array(3)

const cameraSettings = {
	rotateX: 0,
	rotateY: 0,
	rotateZ: 0,
}

const gui1 = new dat.GUI();
let items1 = new Array(3);

if(mode==0){
	items0[0] = gui0.add(transformSettings, 'translateX', -1, 1).step(0.01).onChange(function ()
	{
		axisZ.transform.translate = [transformSettings.translateX,axisZ.transform.translate[1],axisZ.transform.translate[2]];
	});

	items0[1] = gui0.add(transformSettings, 'translateY', -1, 1).step(0.01).onChange(function ()
	{
		axisZ.transform.translate = [axisZ.transform.translate[0], transformSettings.translateY, axisZ.transform.translate[2]];
	});

	items0[2] = gui0.add(transformSettings, 'translateZ', -1, 1).step(0.01).onChange(function ()
	{
		axisZ.transform.translate = [axisZ.transform.translate[0], axisZ.transform.translate[1], transformSettings.translateZ];
	});

	items0[3] = gui0.add(transformSettings, 'rotateX', -Math.PI, Math.PI).step(0.01).onChange(function ()
	{
		axisZ.transform.rotationAngle_X = transformSettings.rotateX;
	});

	items0[4] = gui0.add(transformSettings, 'rotateY', -Math.PI, Math.PI).step(0.01).onChange(function ()
	{
		axisZ.transform.rotationAngle_Y = transformSettings.rotateY;
	});

	items0[5] = gui0.add(transformSettings, 'rotateZ', -Math.PI, Math.PI).step(0.01).onChange(function ()
	{
		axisZ.transform.rotationAngle_Z = transformSettings.rotateZ;
	});
}



document.addEventListener('keydown', function (event) {
	console.log("Key pressed = ", event.key);

	if(event.key=="m"){
		mode = (mode+=1)%2
		console.log("mode = ", mode)
		if(mode==0){
			console.log("top view")
			for(let i=0; i<3; i++){
				gui1.remove(items1[i]);
			}

			items0[0] = gui0.add(transformSettings, 'translateX', -1, 1).step(0.01).onChange(function ()
			{
				axisZ.transform.translate = [transformSettings.translateX,axisZ.transform.translate[1],axisZ.transform.translate[2]];
			});

			items0[1] = gui0.add(transformSettings, 'translateY', -1, 1).step(0.01).onChange(function ()
			{
				axisZ.transform.translate = [axisZ.transform.translate[0], transformSettings.translateY, axisZ.transform.translate[2]];
			});

			items0[2] = gui0.add(transformSettings, 'translateZ', -1, 1).step(0.01).onChange(function ()
			{
				axisZ.transform.translate = [axisZ.transform.translate[0], axisZ.transform.translate[1], transformSettings.translateZ];
			});

			items0[3] = gui0.add(transformSettings, 'rotateX', -Math.PI, Math.PI).step(0.01).onChange(function ()
			{
				axisZ.transform.rotationAngle_X = transformSettings.rotateX;
			});

			items0[4] = gui0.add(transformSettings, 'rotateY', -Math.PI, Math.PI).step(0.01).onChange(function ()
			{
				axisZ.transform.rotationAngle_Y = transformSettings.rotateY;
			});

			items0[5] = gui0.add(transformSettings, 'rotateZ', -Math.PI, Math.PI).step(0.01).onChange(function ()
			{
				axisZ.transform.rotationAngle_Z = transformSettings.rotateZ;
			});

			camera.transform.eye = [0,0,6];

		} else {
			console.log("3D view")
			for(let i=0; i<6; i++){
				gui0.remove(items0[i]);
			}

			items1[0] = gui1.add(cameraSettings, 'rotateX', 1, Math.PI).step(0.01).onChange(function ()
			{
				camera.transform.rotationAngle_X = cameraSettings.rotateX * 0.05;
				camera.transform.updateViewTransformMatrix();
			});

			items1[1] = gui1.add(cameraSettings, 'rotateY', 1, Math.PI).step(0.01).onChange(function ()
			{
				camera.transform.rotationAngle_Y = cameraSettings.rotateY * 0.05;
				camera.transform.updateViewTransformMatrix();
			});

			items1[2] = gui1.add(cameraSettings, 'rotateZ', 1, Math.PI).step(0.01).onChange(function ()
			{
				camera.transform.rotationAngle_Z = cameraSettings.rotateZ * 0.05;
				camera.transform.updateViewTransformMatrix();
			});
			camera.transform.eye = [5,-5,5];
		}		
	}

	else if(event.key=="+" && mode==0){
		axisZ.transform.scale = axisZ.transform.scale.map(x=>x*1.1)
	}

	else if(event.key=="-" && mode==0){
		axisZ.transform.scale = axisZ.transform.scale.map(x=>x/1.1)
	}
}, false );

renderer.setAnimationLoop( animation );

//Draw loop
function animation()
{
	renderer.clear(0.9,0.9,0.9,1);
	renderer.render(scene, shader);	
}