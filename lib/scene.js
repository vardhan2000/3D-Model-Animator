export class Scene
{
	constructor(camera)
	{
		this.camera = camera;
		this.primitives = []
	}

	add(primitive)
	{
		if( this.primitives && primitive )
		{
			this.primitives.push(primitive)
		}
	}

	centroid()
	{
		// @ToDo : Return the centroid of all the primitives in the scene
	}

	selectShape(pixelColor)
	{
		let min = 10000;
		let pixelCol = new Float32Array(pixelColor);
		let color = pixelCol.map(function(x) {return x/255.0;})

		if(this.colorDiff([1,1,1,1],color) < 0.002){
			return null;
		}

		let selectedShape;
		for(let i=0;i<this.primitives.length;i++)
		{
			if(!this.primitives[i].selectable)
				continue;

			if(this.colorDiff(this.primitives[i].color,color) < 0.002){
				selectedShape = this.primitives[i]
			}
		}
		return selectedShape;
	}

	colorDiff(color1, color2){
		let dist=0
		for(let i=0; i<color1.length; i++){
			dist += (color1[i]-color2[i])*(color1[i]-color2[i])
		}
		return Math.sqrt(dist)
	}
}