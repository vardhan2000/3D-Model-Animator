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
	rotateX: 0,
	rotateY: 0,
	rotateZ: 0,
}

const gui0 = new dat.GUI();
let items0 = new Array(3) 

if(mode==0){
	items0[0] = gui0.add(transformSettings, 'rotateX', -Math.PI, Math.PI).step(0.01).onChange(function ()
	{
		cube.transform.rotationAngle_X = transformSettings.rotateX;
	});

	items0[1] = gui0.add(transformSettings, 'rotateY', -Math.PI, Math.PI).step(0.01).onChange(function ()
	{
		cube.transform.rotationAngle_Y = transformSettings.rotateY;
	});

	items0[2] = gui0.add(transformSettings, 'rotateZ', -Math.PI, Math.PI).step(0.01).onChange(function ()
	{
		cube.transform.rotationAngle_Z = transformSettings.rotateZ;
	});
}


window.onload = () => {
	renderer.getDomElement().addEventListener('click', (event) => {
    });

	window.addEventListener('keydown', function (event) {
        console.log("Key pressed = ", event.key);

		if(event.key=="m"){
			mode = (mode+=1)%2
			console.log("mode = ", mode)
			if(mode==0){
				console.log("top view")
				items0[0] = gui0.add(transformSettings, 'rotateX', -Math.PI, Math.PI).step(0.01).onChange(function ()
				{
					cube.transform.rotationAngle_X = transformSettings.rotateX;
				});

				items0[1] = gui0.add(transformSettings, 'rotateY', -Math.PI, Math.PI).step(0.01).onChange(function ()
				{
					cube.transform.rotationAngle_Y = transformSettings.rotateY;
				});

				items0[2] = gui0.add(transformSettings, 'rotateZ', -Math.PI, Math.PI).step(0.01).onChange(function ()
				{
					cube.transform.rotationAngle_Z = transformSettings.rotateZ;
				});

				window.eye = [0,0,6];
				mat4.lookAt(viewMatrix,eye,[0,0,0],up);

			} else {
				console.log("3D view")
				for(let i=0; i<3; i++){
					gui0.remove(items0[i]);
				}
				window.eye = [5,-5,5];
				mat4.lookAt(viewMatrix,eye,[0,0,0],up);

			}		
		}

		else if(event.key=="+" && mode==0){
			cube.transform.scale = cube.transform.scale.map(x=>x*1.1)
		}

		else if(event.key=="-" && mode==0){
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