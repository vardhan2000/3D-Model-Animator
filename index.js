import { Scene, Cube, WebGLRenderer, Shader } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';
import * as dat from 'https://cdn.skypack.dev/dat.gui';
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

const scene = new Scene();

const cube = new Cube(0,0);

scene.add(cube);

const renderer = new WebGLRenderer();
renderer.setSize( 600, 600 );
document.body.appendChild( renderer.domElement );

window.viewMatrix = mat4.create();
window.eye = [0,0,6]; // 
window.up = [0,1,0];

mat4.lookAt(window.viewMatrix,eye,[0,0,0],up);

window.projMatrix = mat4.create();
mat4.perspective(window.projMatrix,45*Math.PI/180,1,0.1,1000);

const shader = new Shader(renderer.glContext(), vertexShaderSrc, fragmentShaderSrc);
shader.use();

let mode = 0

const transformSettings = {
	translateX: 0.0,
	translateY: 0.0,
	translateZ: 0.0,
	rotate_X: 0,
	rotate_Y: 0,
	rotate_Z: 0,
	scale: 1
}

const gui = new dat.GUI();
let items = new Array(6) 

if(mode==0){
	items[0] = gui.add(transformSettings, 'translateX', -1.0, 1.0).step(0.01).onChange(function ()
	{
		cube.transform.translate = [transformSettings.translateX,cube.transform.translate[1],cube.transform.translate[2]]
	});

	items[1] = gui.add(transformSettings, 'translateY', -1.0, 1.0).step(0.01).onChange(function ()
	{
		cube.transform.translate = [cube.transform.translate[0],transformSettings.translateY,cube.transform.translate[2]]
	});

	items[2] = gui.add(transformSettings, 'translateZ', -1.0, 1.0).step(0.01).onChange(function ()
	{
		cube.transform.translate = [cube.transform.translate[0],cube.transform.translate[1],transformSettings.translateZ]
	});

	items[3] = gui.add(transformSettings, 'rotate_X', -Math.PI, Math.PI).step(0.01).onChange(function ()
	{
		cube.transform.rotationAngle_X = transformSettings.rotate_X;
	});

	items[4] = gui.add(transformSettings, 'rotate_Y', -Math.PI, Math.PI).step(0.01).onChange(function ()
	{
		cube.transform.rotationAngle_Y = transformSettings.rotate_Y;
	});

	items[5] = gui.add(transformSettings, 'rotate_Z', -Math.PI, Math.PI).step(0.01).onChange(function ()
	{
		cube.transform.rotationAngle_Z = transformSettings.rotate_Z;
	});
}


window.onload = () => {
	renderer.getDomElement().addEventListener('click', (event) => {
    });

	window.addEventListener('keydown', function (event) {
        console.log("Key pressed = ", event.key);

		if(event.key=="m"){
			mode = (mode+=1)%2
			if(mode==0){
				items[0] = gui.add(transformSettings, 'translateX', -1.0, 1.0).step(0.01).onChange(function ()
				{
					cube.transform.translate = [transformSettings.translateX,cube.transform.translate[1],cube.transform.translate[2]]
				});

				items[1] = gui.add(transformSettings, 'translateY', -1.0, 1.0).step(0.01).onChange(function ()
				{
					cube.transform.translate = [cube.transform.translate[0],transformSettings.translateY,cube.transform.translate[2]]
				});

				items[2] = gui.add(transformSettings, 'translateZ', -1.0, 1.0).step(0.01).onChange(function ()
				{
					cube.transform.translate = [cube.transform.translate[0],cube.transform.translate[1],transformSettings.translateZ]
				});

				items[3] = gui.add(transformSettings, 'rotate_X', -Math.PI, Math.PI).step(0.01).onChange(function ()
				{
					cube.transform.rotationAngle_X = transformSettings.rotate_X;
				});

				items[4] = gui.add(transformSettings, 'rotate_Y', -Math.PI, Math.PI).step(0.01).onChange(function ()
				{
					cube.transform.rotationAngle_Y = transformSettings.rotate_Y;
				});

				items[5] = gui.add(transformSettings, 'rotate_Z', -Math.PI, Math.PI).step(0.01).onChange(function ()
				{
					cube.transform.rotationAngle_Z = transformSettings.rotate_Z;
				});

				window.eye = [0,0,6];

			} else {
				for(let i=0; i<6; i++){
					gui.remove(items[i]);
				}
				window.eye = [0,0,5];

			}		
		
			console.log("mode = ", mode)
		}

		else if(event.key=="+"){
			cube.transform.scale = cube.transform.scale.map(x=>x*1.1)
		}

		else if(event.key=="-"){
			cube.transform.scale = cube.transform.scale.map(x=>x/1.1)
		}
	}, true
	);
	window.addEventListener
}


renderer.setAnimationLoop( animation );

//Draw loop
function animation()
{
	renderer.clear(0.9,0.9,0.9,1);
	renderer.render(scene, shader);	
}