(function() {
	
	// Imports
	var BaseState = cloudkid.BaseState,
		MediaLoader = cloudkid.MediaLoader,
		Application = cloudkid.Application,
		Button = cloudkid.Button;
	
	var TestState = function(panel)
	{
		this.initialize(panel);
	}

	// Extend BaseState
	var p = TestState.prototype = new BaseState();
	
	p.BaseState_initialize = p.initialize;
	p.BaseState_destroy = p.destroy;
	
	/** The button */
	p.button = null;
	
	/**
	* @protected
	*/
	p.initialize = function(panel)
	{
		this.BaseState_initialize(panel);
		this.panel.panelText.text = this.stateId;
	}
	
	/**
	*   Enter the state, start load 
	*/
	p.enterState = function()
	{
		this.loadingStart();
		
		MediaLoader.instance.load(
			'../shared/images/button.png', 
			this._onButtonLoaded.bind(this)
		);		
	};
	
	/**
	*  Callback for the button  
	*/
	p._onButtonLoaded = function(result)
	{		
		this.button = new Button(result.content, {
			text: this.stateId,
			font: "20px Arial",
			color: "#ffffff"
		});
		this.button.x = (Application.instance.display.width - this.button.width) / 2;
		this.button.y = (Application.instance.display.height - this.button.height) / 2;
		this.button.label.y -= 3;
		this.button.addEventListener('click', this._nextState.bind(this));
		this.button.visible = false;
		this.panel.addChild(this.button);
		this.loadingDone();
	};
	
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
	*  Don't use after this  
	*/
	p.destroy = function()
	{
		this.panel.destroy();
		this.BaseState_destroy();
	}
	
	namespace('cloudkid').TestState = TestState;
}());