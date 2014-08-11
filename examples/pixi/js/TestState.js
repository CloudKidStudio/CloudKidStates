(function() {
	
	// Imports
	var BaseState = cloudkid.BaseState,
		Application = cloudkid.Application,
		Texture = PIXI.Texture,
		Button = cloudkid.Button;
	
	var TestState = function(panel)
	{
		BaseState.call(this, panel);
	}

	// Extend BaseState
	var p = TestState.prototype = Object.create(BaseState.prototype);
	
	p.BaseState_destroy = p.destroy;
	
	/** The next button */
	p.button = null;
	
	/**
	*  Enter the state  
	*/
	p.enterState = function()
	{
		this.button = new Button(
			// the button states, from the button data loaded
			{
				up : Texture.fromFrame("button_up.png"),
				over : Texture.fromFrame("button_over.png"),
				down : Texture.fromFrame("button_down.png"),
				disabled : Texture.fromFrame("button_disabled.png")
			}, 
			// The text field
			{
				text : this.stateId,
				style : {
					font : '20px Arial',
					fill : "#ffffff"
				}
			}
		);
		
		this.button.position.x = (Application.instance.display.width - this.button.width) / 2;
		this.button.position.y = (Application.instance.display.height - this.button.height) / 2;
		this.button.releaseCallback = this._nextState.bind(this);
		this.button.visible = false;
		
		this.panel.addChild(this.button);
	}
	
	/**
	*   Transition is done 
	*/
	p.enterStateDone = function()
	{
		this.button.visible = true;
	};
	
	/**
	*  On button click go to the next state 
	*/
	p._nextState = function()
	{
		switch(this.stateId)
		{
			case "state1" : this.manager.setState("state2"); break;
			case "state2" : this.manager.setState("state3"); break;
			case "state3" : this.manager.setState("state1"); break;
		}
	};
	
	/**
	*   Start the transition out 
	*/
	p.exitStateStart = function()
	{
		this.button.visible = false;
	};
	
	/**
	*  Exit the state  
	*/
	p.exitState = function()
	{
		if (this.button)
		{
			this.panel.removeChild(this.button);
			this.button.destroy();
			this.button = null;
		}
	};
	
	/**
	* Destroy, don't use after this  
	*/
	p.destroy = function()
	{
		this.panel.destroy();
		this.BaseState_destroy();
	}
	
	namespace('cloudkid').TestState = TestState;
}());