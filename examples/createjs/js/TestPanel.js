(function() {
	var TestPanel = function()
	{
		this.initialize();
	}
	
	// Extend Sprite
	var p = TestPanel.prototype = new createjs.Container();
	
	p.Container_initialize = p.initialize;
	
	p.panelText = null;
	
	/**
	* @protected
	*/
	p.initialize = function()
	{
		this.Container_initialize();
		this.panelText = new createjs.Text("blank", "Arial");
		this.addChild(this.panelText);
		this.panelText.x = 200;
		this.panelText.y = 50;
		this.panelText.scaleX = 2;
		this.panelText.scaleY = 2;
	}

	p.destroy = function()
	{
		this.removeAllChildren();
		this.panelText = null;
	}

	namespace('cloudkid').TestPanel = TestPanel;
}());