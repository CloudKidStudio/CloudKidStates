(function() {
	
	// Imports
	var Application = cloudkid.Application,
		Touch = createjs.Touch,
		OS = cloudkid.OS,
		TestPanel = cloudkid.TestPanel,
		TestState = cloudkid.TestState,
		StateManager = cloudkid.StateManager;
	
	var StatesApp = function()
	{
		this.initialize();
	}
	
	// Extend the createjs container
	var p = StatesApp.prototype = new Application();
	
	// The name of this app
	p.name = "StatesApp";
	
	//A state manager
	var manager;
	
	/**
	* @protected
	*/
	p.init = function()
	{		
		if (!Touch.isSupported())
		{
			OS.instance.stage.enableMouseOver();
		}
		
		var transition = new lib.Chick();
		this.addChild(transition);
		transition.stop();
		
		transition.x = (OS.instance.stageWidth - 120) / 2;
		transition.y = (OS.instance.stageHeight - 250) / 2;
		
		manager = new StateManager(transition);
		
		var panel = new TestPanel();
		this.addChild(panel);
		manager.addState("state1", new TestState(panel, "State1"));
		
		panel = new TestPanel();
		this.addChild(panel);
		manager.addState("state2", new TestState(panel, "State2"));
		
		panel = new TestPanel();
		this.addChild(panel);
		manager.addState("state3", new TestState(panel, "State3"));
		
		manager.setState("state1");
	}
	
	/**
	*  Destroy this app, don't use after this
	*/
	p.destroy = function()
	{
		this.removeAllChildren();
		
		manager.destroy();
		manager = null;
	}
	
	namespace('cloudkid').StatesApp = StatesApp;
}());