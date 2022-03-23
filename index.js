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
let renderX = 600
let renderY = 600
renderer.setSize( renderX, renderY );
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
let ct = 0

let gl = renderer.glContext();
let pixelColor = new Uint8Array(4);
let currentShape = null;
let mouseX
let mouseY
let mouseTrack = false;
let animation_on = false

let p0
let p1
let p2
let numClicks = 0
let t = 0

if(mode==0){
	items0[0] = gui0.add(transformSettings, 'translateX', -1, 1).step(0.01).onChange(function ()
	{
		currentShape.transform.translate = [transformSettings.translateX,currentShape.transform.translate[1],currentShape.transform.translate[2]];
	});

	items0[1] = gui0.add(transformSettings, 'translateY', -1, 1).step(0.01).onChange(function ()
	{
		currentShape.transform.translate = [currentShape.transform.translate[0], transformSettings.translateY, currentShape.transform.translate[2]];
	});

	items0[2] = gui0.add(transformSettings, 'translateZ', -1, 1).step(0.01).onChange(function ()
	{
		currentShape.transform.translate = [currentShape.transform.translate[0], currentShape.transform.translate[1], transformSettings.translateZ];
	});

	items0[3] = gui0.add(transformSettings, 'rotateX', -Math.PI, Math.PI).step(0.01).onChange(function ()
	{
		currentShape.transform.rotationAngle_X = transformSettings.rotateX;
	});

	items0[4] = gui0.add(transformSettings, 'rotateY', -Math.PI, Math.PI).step(0.01).onChange(function ()
	{
		currentShape.transform.rotationAngle_Y = transformSettings.rotateY;
	});

	items0[5] = gui0.add(transformSettings, 'rotateZ', -Math.PI, Math.PI).step(0.01).onChange(function ()
	{
		currentShape.transform.rotationAngle_Z = transformSettings.rotateZ;
	});
}



document.addEventListener('keydown', function (event) {
	console.log("Key pressed = ", event.key);

	if(event.key=="m"){
		mode = (mode+=1)%2
		console.log("mode = ", mode)
		if(mode==0){
			console.log("top view")

			items0[0] = gui0.add(transformSettings, 'translateX', -1, 1).step(0.01).onChange(function ()
			{
				currentShape.transform.translate = [transformSettings.translateX,currentShape.transform.translate[1],currentShape.transform.translate[2]];
			});

			items0[1] = gui0.add(transformSettings, 'translateY', -1, 1).step(0.01).onChange(function ()
			{
				currentShape.transform.translate = [currentShape.transform.translate[0], transformSettings.translateY, currentShape.transform.translate[2]];
			});

			items0[2] = gui0.add(transformSettings, 'translateZ', -1, 1).step(0.01).onChange(function ()
			{
				currentShape.transform.translate = [currentShape.transform.translate[0], currentShape.transform.translate[1], transformSettings.translateZ];
			});

			items0[3] = gui0.add(transformSettings, 'rotateX', -Math.PI, Math.PI).step(0.01).onChange(function ()
			{
				currentShape.transform.rotationAngle_X = transformSettings.rotateX;
			});

			items0[4] = gui0.add(transformSettings, 'rotateY', -Math.PI, Math.PI).step(0.01).onChange(function ()
			{
				currentShape.transform.rotationAngle_Y = transformSettings.rotateY;
			});

			items0[5] = gui0.add(transformSettings, 'rotateZ', -Math.PI, Math.PI).step(0.01).onChange(function ()
			{
				currentShape.transform.rotationAngle_Z = transformSettings.rotateZ;
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
		currentShape.transform.scale = currentShape.transform.scale.map(x=>x*1.1)
	}

	else if(event.key=="-" && mode==0){
		currentShape.transform.scale = currentShape.transform.scale.map(x=>x/1.1)
	}

	else if(event.key == "a" && mode==0){
		if(animation_on){
			animation_on = false;
		} else {
			animation_on = true;
		}
	}

}, false );

let initialMousePosition

renderer.getDomElement().addEventListener('mousedown', (event) => {
	if(mode==0 && !animation_on){
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
			s.color = s.originalColor;

		if(currentShape == undefined){
			console.log("No shape selected");
		}
		else {
			currentShape.color = [0,0,0,1];
		}
	}
	
	else if(mode==0 && animation_on)
	{
		if(numClicks == 0)
		{
			numClicks++;
			p0 = [currentShape.getCenterX(), currentShape.getCenterY()];
			p0 = clipToWorld(p0)
			console.log(p0)
			p1 = mouseToWorld([event.clientX,event.clientY]);
		}
		else if(numClicks == 1)
		{
			numClicks = 0;
			p2 = mouseToWorld([event.clientX,event.clientY]);
		}
	}

	else if(mode ==1) {
		if(mouseTrack){
			mouseTrack = false;
		} else {
			mouseTrack = true;
		}
		initialMousePosition = event.clientX
	}
});

renderer.getDomElement().addEventListener('mousemove', (event) => {
	if(mouseTrack && mode==1){
		camera.transform.rotationAngle_Y = -0.002 * (event.clientX - initialMousePosition);
		camera.transform.updateViewTransformMatrix();
	}
});

function clipToWorld(point)
{
	let viewProjMat = mat4.create();
	mat4.multiply(viewProjMat,window.projMatrix,camera.transform.viewMatrix);

	let invViewProjMat = mat4.create();
	mat4.invert(invViewProjMat,viewProjMat);

	let pointIn3D = vec3.fromValues(point[0],point[1],0.964);
	let worldCoor = vec3.create();

	vec3.transformMat4(worldCoor,pointIn3D,invViewProjMat);

	return worldCoor;
}

function mouseToWorld(mouse)
{
	return clipToWorld([(mouse[0])/renderX*2-1,-mouse[1]/renderY*2+1]);
}

function animatingSelectedObject()
{
	if(currentShape == undefined)
		return;
	if(p0 == undefined || p1 == undefined || p2 == undefined)
		return;
	if(!animation_on)
		return;
	else if(animation_on)
	{
		if(t<1)
		{
			let a_x = 2*p0[0] + 2*p2[0] - 4*p1[0];
			let b_x = 4*p1[0] -   p2[0] - 3*p0[0];
			let c_x = p0[0];

			let a_y = 2*p0[1] + 2*p2[1] - 4*p1[1];
			let b_y = 4*p1[1] -   p2[1] - 3*p0[1];
			let c_y = p0[1];

			let a_z = 2*p0[2] + 2*p2[2] - 4*p1[2];
			let b_z = 4*p1[2] -   p2[2] - 3*p0[2];
			let c_z = p0[2];

			let tempX = currentShape.transform.translate[0];
			let tempY = currentShape.transform.translate[1];
			let tempZ = currentShape.transform.translate[2];

			tempX = a_x * t * t + b_x * t + c_x;
			tempY = a_y * t * t + b_y * t + c_y;
			tempZ = a_z * t * t + b_z * t + c_z;
	
			currentShape.transform.translate[0] = tempX;
			currentShape.transform.translate[1] = tempY;
			currentShape.transform.translate[2] = tempZ;

			t +=0.005;
		}
		else
		{
			t=0;
			animation_on = false;
			if(currentShape != undefined)
				currentShape.color = currentShape.original_color;
			currentShape = undefined;
			p0 = undefined;
			p1 = undefined;
			p2 = undefined;
		}
	}
}

renderer.setAnimationLoop( animation );

//Draw loop
function animation()
{
	renderer.clear(0.9,0.9,0.9,1);
	renderer.render(scene, shader);	
	animatingSelectedObject()
}