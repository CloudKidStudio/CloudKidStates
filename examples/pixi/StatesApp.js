(function() {
	
	// Imports
	var PixiAnimator = cloudkid.PixiAnimator,
		Spine = PIXI.Spine,
		StateManager = cloudkid.StateManager,
		TestPanel = cloudkid.TestPanel,
		TestState = cloudkid.TestState,
		AssetLoader = PIXI.AssetLoader,
		Application = cloudkid.Application,
		DisplayObjectContainer = PIXI.DisplayObjectContainer;
	
	var StatesApp = function(options)
	{
		Application.call(this, options);
	}
	
	// Extend the createjs container
	var p = StatesApp.prototype = Object.create(Application.prototype);
	
	// The name of this app
	p.name = "StatesApp";
	
	/** Instance of the state manager */
	var manager;
	
	/** The Spine transition */
	var transition;
	
	/** The PIXI asset loader */
	var assetLoader;
	
	/**
	* @protected
	*/
	p.init = function()
	{
		assetLoader = new AssetLoader([
			"images/loader.png",
			"js/transition.json",
			"../shared/images/button.json"
		]);
		assetLoader.onComplete = onAssetsLoaded.bind(this);
		assetLoader.load();
	}
	
	/**
	*   Callback when the assets have been loaded 
	*/
	function onAssetsLoaded()
	{
		var stage = this.display.stage;
		transition = new Spine("transition.json");
		transition.position.x = (this.display.width - 200) / 2;
		transition.position.y = (this.display.height - 200) / 2;
		
		manager = new StateManager(this.display, transition);
		
		var panel = new DisplayObjectContainer();
		stage.addChild(panel);
		manager.addState("state1", new TestState(panel));
		
		panel = new DisplayObjectContainer();
		stage.addChild(panel);
		manager.addState("state2", new TestState(panel));
		
		panel = new DisplayObjectContainer();
		stage.addChild(panel);
		manager.addState("state3", new TestState(panel));

		stage.addChild(transition);
		
		manager.setState("state1");
	}
	
	/**
	*  Destroy this app, don't use after this
	*/
	p.destroy = function()
	{
		this.removeChildren();
		assetLoader.onComplete = null;
		assetLoader = null;
		manager.destroy();
		manager = null;
	}
	
	namespace('cloudkid').StatesApp = StatesApp;
}());