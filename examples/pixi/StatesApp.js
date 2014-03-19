(function() {
	
	// Imports
	var PixiAnimator = cloudkid.PixiAnimator,
		Spine = PIXI.Spine,
		StateManager = cloudkid.StateManager,
		TestPanel = cloudkid.TestPanel,
		TestState = cloudkid.TestState,
		AssetLoader = PIXI.AssetLoader,
		Application = cloudkid.Application,
		OS = cloudkid.OS,
		DisplayObjectContainer = PIXI.DisplayObjectContainer;
	
	var StatesApp = function()
	{
		Application.call(this);
	}
	
	// Extend the createjs container
	var p = StatesApp.prototype = Object.create(Application.prototype);
	
	// The name of this app
	p.name = "StatesApp";
	
	/** The current stage */
	var stage;
	
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
		stage = OS.instance.stage;
		
		assetLoader = new AssetLoader([
			"images/loader.png",
			"js/transition.json",
			"../shared/images/button.json"
		]);
		assetLoader.onComplete = onAssetsLoaded.bind(this);
		assetLoader.load();
		
		cloudkid.PixiAnimator.init();
	}
	
	/**
	*   Callback when the assets have been loaded 
	*/
	function onAssetsLoaded()
	{
		transition = new Spine("transition.json");
		this.addChild(transition);
		
		transition.position.x = (OS.instance.stageWidth - 200) / 2;
		transition.position.y = (OS.instance.stageHeight - 200) / 2;
		
		manager = new StateManager(transition);
		
		var panel = new DisplayObjectContainer();
		this.addChild(panel);
		manager.addState("state1", new TestState(panel));
		
		panel = new DisplayObjectContainer();
		this.addChild(panel);
		manager.addState("state2", new TestState(panel));
		
		panel = new DisplayObjectContainer();
		this.addChild(panel);
		manager.addState("state3", new TestState(panel));
		
		manager.setState("state1");
	}
	
	/**
	*  Destroy this app, don't use after this
	*/
	p.destroy = function()
	{
		this.removeChildren();
		stage.click = null;
		stage = null;
		assetLoader.onComplete = null;
		assetLoader = null;
		manager.destroy();
		manager = null;
	}
	
	namespace('cloudkid').StatesApp = StatesApp;
}());