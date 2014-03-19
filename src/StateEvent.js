(function(undefined){
	
	/**
	*   A gamestate-related event
	*   
	*   @class cloudkid.StateEvent
	*   @constructor
	*   @param {String} type See flash.events.Event
	*   @param {cloudkid.BaseState} currentState The currentState of the state manager
	*   @param {cloudkid.BaseState} visibleState The current state being transitioned or changing visibility, default to currentState
	*/
	var StateEvent = function(type, currentState, visibleState)
	{
		this.initialize(type, currentState, visibleState);
	};
	
	var p = StateEvent.prototype;
	
	/** 
	* The name of the event for when the state starts transitioning in
	* 
	* @event onTransitionStateIn
	*/
	StateEvent.TRANSITION_IN = "onTransitionStateIn";
	
	/**
	* The name of the event for when the state finishes transition in
	* 
	* @event {String} onTransitionStateInDone
	*/
	StateEvent.TRANSITION_IN_DONE = "onTransitionStateInDone";
	
	/**
	* The name of the event for when the state starts transitioning out
	* 
	* @event {String} onTransitionStateOut
	*/
	StateEvent.TRANSITION_OUT = "onTransitionStateOut";
	
	/**
	* The name of the event for when the state is done transitioning out
	* 
	* @event {String} onTransitionStateOutDone
	*/
	StateEvent.TRANSITION_OUT_DONE = "onTransitionStateOutDone";
	
	/**
	* When the state besome visible
	* 
	* @event {String} onVisible
	*/
	StateEvent.VISIBLE = "onVisible";
	
	/**
	* When the state becomes hidden
	* 
	* @event {String} onHidden
	*/
	StateEvent.HIDDEN = "onHidden";
	
	/**
	* A reference to the current state of the state manager
	* 
	* @property {cloudkid.BaseState} currentState
	*/
	p.currentState = null;
	
	/**
	* A reference to the state who's actually being transitioned or being changed
	* 
	* @property {cloudkid.BaseState} visibleState
	*/
	p.visibleState = null;
	
	/** The type of event
	 * 
	 * @property {String} type
	*/
	p.type = null;
	
	/**
	*  Initialize the event
	*  
	*  @function initialize
	*  @param {String} type The type of event
	*  @param {cloudkid.BaseState} currentState The currentState of the state manager
	*  @param {cloudkid.BaseState} visibleState The current state being transitioned or changing visibility
	*/
	p.initialize = function(type, currentState, visibleState)
	{
		this.type = type;
		
		this.visibleState = visibleState === undefined ? currentState : visibleState;
		this.currentState = currentState;
	};
	
	// Add to the name space
	namespace('cloudkid').StateEvent = StateEvent;
	
}());