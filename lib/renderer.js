export class WebGLRenderer
{
	constructor()
	{
		this.domElement = document.createElement("canvas");		

		this.gl = this.domElement.getContext("webgl",{preserveDrawingBuffer: true}) || this.domElement.getContext("experimental-webgl");
		if (!this.gl) throw new Error("WebGL is not supported");
		this.setSize(50,50);
		this.clear(1.0,1.0,1.0,1.0);
	}
	
	getDomElement(){
		return this.domElement;
	}

	setSize(width, height)
	{
		this.domElement.width = width;
		this.domElement.height = height;
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	}

	clear(r,g,b,a)
	{
		this.gl.clearColor(r, g, b, a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	setAnimationLoop(animation) 
	{
		function renderLoop()
		{
			animation();
			window.requestAnimationFrame(renderLoop);
		}	

		renderLoop();
		  
	}

	render(scene, shader) 
	{

		scene.primitives.forEach( function (primitive) {
			primitive.transform.updateModelTransformMatrix();

			shader.bindArrayBuffer(shader.vertexAttributesBuffer, primitive.vertexPositions);
			shader.bindIndexBuffer(shader.indexBuffer, primitive.indexData);
			shader.fillAttributeData("aPosition", 3,  3 * primitive.vertexPositions.BYTES_PER_ELEMENT, 0);		
					
			shader.setUniform4f("uColor", primitive.color);				
			shader.setUniformMatrix4fv("uModelTransformMatrix", primitive.transform.modelTransformMatrix);
			shader.setUniformMatrix4fv("viewMatrix", scene.camera.transform.viewMatrix);
			shader.setUniformMatrix4fv("projMatrix", window.projMatrix);
			
			
			// Draw
			// shader.drawArrays(primitive.vertexPositions.length / 3);
			
			shader.drawElements(primitive.indexData.length);
		});
	}

	glContext()
	{
		return this.gl;
	}

	mouseToClipCoord(mouseX,mouseY,offset) {
		// @ToDo
		// convert the position from pixels to 0.0 to 1.0
		mouseX -= offset;
		mouseX = mouseX / this.domElement.width;
		mouseY = mouseY / this.domElement.height;

		// convert from 0->1 to 0->2
		mouseX = mouseX * 2;
		mouseY = mouseY * 2;

		// convert from 0->2 to -1->1
		mouseX = mouseX - 1;
		mouseY = mouseY - 1;

		// flip the axis	
		mouseY = -mouseY; // Coordinates in clip space

		return [mouseX, mouseY]
	}
}