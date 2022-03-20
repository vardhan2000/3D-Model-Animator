import { Scene, Cube, WebGLRenderer, Shader } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';
import * as dat from 'https://cdn.skypack.dev/dat.gui';

const scene = new Scene();

const cube = new Cube(0,0);

scene.add(cube);

const renderer = new WebGLRenderer();
renderer.setSize( 600, 600 );
document.body.appendChild( renderer.domElement );

const shader = new Shader(renderer.glContext(), vertexShaderSrc, fragmentShaderSrc);
shader.use();

const gui = new dat.GUI();

const transformSettings = {
	translateX: 0.0,
	translateY: 0.0,
	translateZ: 0.0,
	rotate_X: 0,
	rotate_Y: 0,
	rotate_Z: 0
}

gui.add(transformSettings, 'translateX', -1.0, 1.0).step(0.01).onChange(function ()
{
	cube.transform.translate = [transformSettings.translateX,cube.transform.translate[1],cube.transform.translate[2]]
});

gui.add(transformSettings, 'translateY', -1.0, 1.0).step(0.01).onChange(function ()
{
	cube.transform.translate = [cube.transform.translate[0],transformSettings.translateY,cube.transform.translate[2]]
});

gui.add(transformSettings, 'translateZ', -1.0, 1.0).step(0.01).onChange(function ()
{
	cube.transform.translate = [cube.transform.translate[0],cube.transform.translate[1],transformSettings.translateZ]
});

gui.add(transformSettings, 'rotate_X', -Math.PI, Math.PI).step(0.01).onChange(function ()
{
	cube.transform.rotationAngle_X = transformSettings.rotate_X;
});

gui.add(transformSettings, 'rotate_Y', -Math.PI, Math.PI).step(0.01).onChange(function ()
{
	cube.transform.rotationAngle_Y = transformSettings.rotate_Y;
});

gui.add(transformSettings, 'rotate_Z', -Math.PI, Math.PI).step(0.01).onChange(function ()
{
	cube.transform.rotationAngle_Z = transformSettings.rotate_Z;
});


// // mouseX and mouseY are in CSS display space relative to canvas
// let mouseX = -1;
// let mouseY = -1;

// renderer.gl.canvas.addEventListener('mousemove', (e) => {
// 	const rect = renderer.gl.canvas.getBoundingClientRect();
// 	mouseX = e.clientX - rect.left;
// 	mouseY = e.clientY - rect.top;
// });

// const pixelX = mouseX * renderer.gl.canvas.width / renderer.gl.canvas.clientWidth;
// const pixelY = renderer.gl.canvas.height - mouseY * renderer.gl.canvas.height / renderer.gl.canvas.clientHeight - 1;
// const data = new Uint8Array(4);
// renderer.gl.readPixels(
//     pixelX,            // x
//     pixelY,            // y
//     1,                 // width
//     1,                 // height
//     renderer.gl.RGBA,           // format
//     renderer.gl.UNSIGNED_BYTE,  // type
//     data);             // typed array to hold result



renderer.setAnimationLoop( animation );

//Draw loop
function animation()
{
	renderer.clear(0.9,0.9,0.9,1);
	renderer.render(scene, shader);	
}