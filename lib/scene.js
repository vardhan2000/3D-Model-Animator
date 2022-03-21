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
}