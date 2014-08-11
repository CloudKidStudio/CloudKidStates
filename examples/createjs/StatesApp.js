(function() {
	
	// Imports
	var Application = cloudkid.Application,
		Touch = createjs.Touch,
		TestPanel = cloudkid.TestPanel,
		TestState = cloudkid.TestState,
		StateManager = cloudkid.StateManager;
	
	var StatesApp = function(options)
	{
		Application.call(this, options);
	}
	
	// Extend the createjs container
	var p = StatesApp.prototype = Object.create(Application.prototype);
	
	// The name of this app
	p.name = "StatesApp";
	
	//A state manager
	var manager;
	
	/**
	* @protected
	*/
	p.init = function()
	{
		var stage = this.display.stage;
		var transition = new lib.Chick();
		transition.stop();
		transition.x = (this.display.width - 120) / 2;
		transition.y = (this.display.height - 250) / 2;
		
		manager = new StateManager(this.display, transition);
		
		var panel = new TestPanel();
		stage.addChild(panel);
		manager.addState("state1", new TestState(panel, "State1"));
		
		panel = new TestPanel();
		stage.addChild(panel);
		manager.addState("state2", new TestState(panel, "State2"));
		
		panel = new TestPanel();
		stage.addChild(panel);
		manager.addState("state3", new TestState(panel, "State3"));

		stage.addChild(transition);
		
		manager.setState("state1");
	}
	
	/**
	*  Destroy this app, don't use after this
	*/
	p.destroy = function()
	{
		this.display.stage.removeAllChildren();
		
		manager.destroy();
		manager = null;
	}
	
	namespace('cloudkid').StatesApp = StatesApp;
}());