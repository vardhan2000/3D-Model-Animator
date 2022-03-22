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

let mesh_monkey = await meshObject('./monkey.obj');
let monkey = new Shape(mesh_monkey,[1,0.062,0.94,1]); // pink

let mesh_torus = await meshObject('./torus.obj');
let torus = new Shape(mesh_torus,[1,0.647,0,1]); // orange

let mesh_cube = await meshObject('./cube.obj');
let cube = new Shape(mesh_cube,[0.039, 0.796, 0.933,1]); // light blue


axisX.transform.scale = [0.424,0.3,0.3];
axisY.transform.scale = [0.3,0.424,0.3];
axisZ.transform.scale = [0.3,0.3,0.424];

axisX.selectable = false;
axisY.selectable = false;
axisZ.selectable = false;

monkey.transform.scale = [0.3,0.3,0.3]
torus.transform.scale = [0.3,0.3,0.3]
cube.transform.scale = [0.3,0.3,0.3]

monkey.transform.translate = [0.7,0.7,0]
torus.transform.translate = [-0.7,0.7,0]
cube.transform.translate = [0.7,-0.7,0]

scene.add(axisX);
scene.add(axisY);
scene.add(axisZ);
scene.add(monkey)
scene.add(torus)
scene.add(cube)

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

let eye_3DView = [0,0,0];
const gui1 = new dat.GUI();
let items1 = new Array(3);
let ct = 0

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

			
			console.log("eye = ", camera.transform.eye);
			
			eye_3DView = camera.transform.eye;
			
			camera.transform.eye = [0,0,6];
			camera.transform.rotationAngle_X = 0
			camera.transform.rotationAngle_Y = 0
			camera.transform.rotationAngle_Z = 0
			camera.transform.updateViewTransformMatrix();

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

			if(ct == 0){
				camera.transform.eye = [-5,5,-5]
				ct = 1
			}
			else {
				camera.transform.eye = eye_3DView;
				camera.transform.rotationAngle_X = 0;
				camera.transform.rotationAngle_Y = 0;
				camera.transform.rotationAngle_Z = 0;
			}
			
			camera.transform.updateViewTransformMatrix();
		}		
	}

	else if(event.key=="+" && mode==0){
		axisZ.transform.scale = axisZ.transform.scale.map(x=>x*1.1)
	}

	else if(event.key=="-" && mode==0){
		axisZ.transform.scale = axisZ.transform.scale.map(x=>x/1.1)
	}
}, false );

let canvas = renderer.getDomElement();
let gl = renderer.glContext();
let pixelColor = new Uint8Array(4);
let currentShape = null;
let mouseX
let mouseY

renderer.getDomElement().addEventListener('mousedown', (event) => {
	if(mode==0){
		const rect = renderer.getDomElement().getBoundingClientRect();

		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;

		const pixelX = mouseX * gl.canvas.width / gl.canvas.clientWidth;
		const pixelY = gl.canvas.height - mouseY * gl.canvas.height / gl.canvas.clientHeight - 1;

		renderer.render(scene,shader);

		gl.readPixels(
			pixelX,            // x
			pixelY,            // y
			1,                 // width
			1,                 // height
			gl.RGBA,           // format
			gl.UNSIGNED_BYTE,  // type
			pixelColor         // typed array to hold result
		);
		console.log("pixelColor = ",pixelColor)

		let s = currentShape;
		currentShape = scene.selectShape(pixelColor);

		if(s != undefined)
			s.color = temp.originalColor;

		if(currentShape == undefined){
			console.log("No shape selected");
		}
		else {
			currentShape.color = [0,0,0,1];
		}
	}
});

renderer.setAnimationLoop( animation );

//Draw loop
function animation()
{
	renderer.clear(0.9,0.9,0.9,1);
	renderer.render(scene, shader);	
}