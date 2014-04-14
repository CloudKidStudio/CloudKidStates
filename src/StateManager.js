(function(undefined){
	
	// Imports
	var Audio = cloudkid.Audio || cloudkid.Sound,
		OS = cloudkid.OS,
		Animator = cloudkid.Animator,
		BaseState = cloudkid.BaseState,
		PixiAnimator = cloudkid.PixiAnimator,
		StateEvent = cloudkid.StateEvent,
		EventDispatcher = createjs.EventDispatcher;
	
	// Create js only
	if (CONFIG_CREATEJS)
	{
		var MovieClip = createjs.MovieClip,
			Touch = createjs.Touch;
	}
	
	/**
	*  The State Manager used for manaing the different states of a game or site
	*  
	*  @class cloudkid.StateManager
	*  @constructor
	*  @param {createjs.MovieClip|PIXI.MovieClip|PIXI.Spine} transition The transition MovieClip to play between transitions
	*  @param {object} audio Data object with aliases and start times (seconds) for transition in, loop and out sounds: {in:{alias:"myAlias", start:0.2}}.
	*		These objects are in the format for Animator or PixiAnimator from CloudKidAnimation, so they can be the alias instead of an object.
	*/

	StateManager = function(transition, audio)
	{
		this.initialize(transition, audio);
	};
	
	var p = StateManager.prototype;
	
	/**
	* Adds the specified event listener
	* @function addEventListener
	* @param {String} type The string type of the event
	* @param {function|object} listener An object with a handleEvent method, or a function that will be called when the event is dispatched
	* @return {function|object} Returns the listener for chaining or assignment
	*/
	p.addEventListener = null;
	/**
	* Removes the specified event listener
	* @function removeEventListener
	* @param {String} type The string type of the event
	* @param {function|object} listener The listener function or object
	*/
	p.removeEventListener = null;
	/**
	* Removes all listeners for the specified type, or all listeners of all types
	* @function removeAllEventListeners
	* @param {String} type The string type of the event. If omitted, all listeners for all types will be removed.
	*/
	p.removeAllEventListeners = null;
	/**
	* Dispatches the specified event
	* @function dispatchEvent
	* @param {Object|String} enventObj An object with a "type" property, or a string type
	* @param {object} target The object to use as the target property of the event object
	* @return {bool} Returns true if any listener returned true
	*/
	p.dispatchEvent = null;
	/**
	* Indicates whether there is at least one listener for the specified event type
	* @function hasEventListener
	* @param {String} type The string type of the event
	* @return {bool} Returns true if there is at least one listener for the specified event
	*/
	p.hasEventListener = null;
	/**
	* Createjs EventDispatcher method
	* @property {Array} _listeners description
	* @private
	*/
	p._listeners = null;
	
	// we only use EventDispatcher if it's available:
	if (EventDispatcher) EventDispatcher.initialize(p); 
	
	/**
	* The current version of the state manager
	*  
	* @property {String} VERSION
	* @static
	* @final
	*/
	StateManager.VERSION = '${version}';
	
	/**
	* The click to play in between transitioning states
	* 
	* @property {createjs.MovieClip} _transition
	* @private
	*/
	p._transition = null;
	
	/**
	* The sounds for the transition
	* 
	* @property {object} _transitionSounds
	* @private
	*/
	p._transitionSounds = null;
	
	/**
	* The collection of states map
	* 
	* @property {Array} _states
	* @private
	*/
	p._states = null;
	
	/**
	* The currently selected state
	* 
	* @property {cloudkid.BaseState} _state
	* @private
	*/
	p._state = null;
	
	/** 
	* The currently selected state id
	* 
	* @property {String} _stateID
	* @private
	*/
	p._stateId = null;
	
	/**
	* The old state
	* 
	* @property {cloudkid.BaseState} _oldState
	* @private
	*/
	p._oldState = null;
	
	/**
	* If the manager is loading a state
	* 
	* @property {bool} name description
	* @private
	*/
	p._isLoading = false;
	
	/** 
	* If the state or manager is current transitioning
	* 
	* @property {bool} _isTransitioning
	* @private
	*/
	p._isTransitioning = false;
	
	/**
	* If the current object is destroyed
	* 
	* @property {bool} _destroyed
	* @private
	*/
	p._destroyed = false;
	
	/**
	* If we're transitioning the state, the queue the id of the next one
	* 
	* @property {String} _queueStateId
	* @private
	*/
	p._queueStateId = null;
	
	/**
	* The name of the Animator label and event for transitioning state in
	* 
	* @event onTransitionIn
	*/
	StateManager.TRANSITION_IN = "onTransitionIn";
	
	/**
	* The name of the event for done with transitioning state in
	* 
	* @event onTransitionInDone
	*/
	StateManager.TRANSITION_IN_DONE = "onTransitionInDone";
	
	/**
	* The name of the Animator label and event for transitioning state out
	* 
	* @event onTransitionOut
	*/
	StateManager.TRANSITION_OUT = "onTransitionOut";
	
	/**
	* The name of the event for done with transitioning state out
	* 
	* @event onTransitionOutDone
	*/
	StateManager.TRANSITION_OUT_DONE = "onTransitionOutDone";
	
	/**
	* The name of the Animator label for showing the blocker
	* 
	* @event onBlockerShow
	*/
	StateManager.DIALOG_SHOW = "onBlockerShow";
	
	/**
	* The name of the Animator label for showing the blocker
	* 
	* @event onBlockerShowDone
	*/
	StateManager.DIALOG_SHOW_DONE = "onBlockerShowDone";
	
	/**
	* The name of the Animator label and event for hiding the blocker
	* 
	* @event onBlockerHide
	*/
	StateManager.DIALOG_HIDE = "onBlockerHide";
	
	/**
	* The name of the Animator label and event for hiding the blocker
	* 
	* @event onBlockerHideDone
	*/
	StateManager.DIALOG_HIDE_DONE = "onBlockerHideDone";
	
	/** 
	* The name of the Animator label and event for initializing
	* 
	* @event onInit
	*/
	StateManager.TRANSITION_INIT = "onInit";
	
	/**
	* The name of the event for done with initializing
	* 
	* @event onInitDone
	*/
	StateManager.TRANSITION_INIT_DONE = "onInitDone";
	
	/**
	* Event when the state transitions the first time
	* 
	* @event onLoadingStart
	*/
	StateManager.LOADING_START = "onLoadingStart";
	
	/**
	* Event when the state transitions the first time
	* 
	* @event onLoadingDone
	*/
	StateManager.LOADING_DONE = "onLoadingDone";
	
	/**
	*  Initialize the State Manager
	*  
	*  @function intialize
	*  @param {createjs.MovieClip|PIXI.MovieClip|PIXI.Spine} transition The transition MovieClip to play between transitions
	*  @param {object} transitionSounds Data object with aliases and start times (seconds) for transition in, loop and out sounds: {in:{alias:"myAlias", start:0.2}}
	*/
	p.initialize = function(transition, transitionSounds)
	{
		if(CONFIG_CREATEJS)
		{
			if (DEBUG) Debug.assert(transition instanceof MovieClip, "transition needs to subclass createjs.MovieClip");
		}
		
		this._transition = transition;
		
		if(CONFIG_CREATEJS) 
		{
			this._transition.stop();
		}
		
		this.hideBlocker();
		this._states = {};
		
		this._transitionSounds = transitionSounds || null;

		this._loopTransition = this._loopTransition.bind(this);
	};
	
	/**
	*  Register a state with the state manager, done initially
	*  
	*  @function addState
	*  @param {String} id The string alias for a state
	*  @param {cloudkid.BaseState} state State object reference
	*/
	p.addState = function(id, state)
	{
		if (DEBUG) 
		{
			Debug.assert(state instanceof BaseState, "State ("+id+") needs to subclass cloudkid.BaseState");
		}
		
		// Add to the collection of states
		this._states[id] = state;
		
		// Give the state a reference to the id
		state.stateId = id;
		
		// Give the state a reference to the manager
		state.manager = this;
		
		// Make sure the state ie exited initially
		state._internalExitState();
	};
	
	/**
	*  Dynamically change the transition
	*  
	*  @function changeTransition
	*  @param {createjs.MovieClip|PIXI.MovieClip|PIXI.Spine} Clip to swap for transition
	*/
	p.changeTransition = function(clip)
	{
		if(CONFIG_CREATEJS)
		{
			if (DEBUG) Debug.assert(clip instanceof MovieClip, "Transition needs to subclass createjs.MovieClip");
		}
		this._transition = clip;
	};
	
	/**
	*  Get the currently selected state
	*  
	*  @function getState
	*  @return {String} The id of the current state
	*/
	p.getState = function()
	{
		return this._stateId;
	};
	
	/**
	*   Get the current selected state (state object)
	*   
	*   @function getCurrentState
	*   @return {cloudkid.BaseState} The Base State object
	*/
	p.getCurrentState = function()
	{
		return this._state;
	};
	
	/**
	*   Access a certain state by the ID
	*   
	*   @function getStateById
	*   @param {String} id State alias
	*   @return {cloudkid.BaseState} The base State object
	*/
	p.getStateById = function(id)
	{
		Debug.assert(this._states[id] !== undefined, "No alias matching " + id);
		return this._states[id];
	};
	
	/** 
	* If the StateManager is busy because it is currently loading or transitioning.
	* 
	* @function isBusy
	* @return {bool} If StateManager is busy
	*/
	p.isBusy = function()
	{
		return this._isLoading || this._isTransitioning;
	};
	
	/**
	*   If the state needs to do some asyncronous tasks,
	*   The state can tell the manager to stop the animation
	*   
	*   @function loadingStart
	*/
	p.loadingStart = function()
	{
		if (this._destroyed) return;
		
		//this.showLoader();
		this.dispatchEvent(StateManager.LOADING_START);
		
		if(CONFIG_PIXI)
		{
			this._loopTransition();
		}
	};
	
	/**
	*   If the state has finished it's asyncronous task loading
	*   Lets enter the state
	*   
	*   @function loadingDone
	*/
	p.loadingDone = function()
	{
		if (this._destroyed) return;
		
		//this.hideLoader();
		this.dispatchEvent(StateManager.LOADING_DONE);
	};
	
	/**
	*   Show, enable the blocker clip to disable mouse clicks
	*   
	*   @function showBlocker
	*/
	p.showBlocker = function()
	{
		var stage = OS.instance.stage;
		
		if(CONFIG_CREATEJS)
		{
			stage.enableMouseOver(false);
			stage.enableDOMEvents(false);
			Touch.disable(stage);
		}
		else if(CONFIG_PIXI)
		{
			stage.setInteractive(false);
			// force an update that disables the whole stage (the stage doesn't 
			// update the interaction manager if interaction is false)
			stage.forceUpdateInteraction();
		}
	};
	
	
	/**
	*   Re-enable interaction with the stage
	*   
	*   @function hideBlocker
	*/
	p.hideBlocker = function()
	{
		var stage = OS.instance.stage;
		
		if(CONFIG_CREATEJS) 
		{
			stage.enableMouseOver(true);
			stage.enableDOMEvents(true);
			Touch.enable(stage);
		}
		else if(CONFIG_PIXI) 
		{
			stage.setInteractive(true);
		}
	};
	
	/**
	*   This transitions out of the current state and 
	*   enters it again. Can be useful for clearing a state
	*   
	*   @function refresh
	*/
	p.refresh = function()
	{
		Debug.assert(!!this._state, "No current state to refresh!");
		this.setState(this._stateId);
	};
	
	/**
	*  Set the current State
	*  
	*  @function setState
	*  @param {String} id The state id
	*/
	p.setState = function(id)
	{
		Debug.assert(this._states[id] !== undefined, "No current state mattching id '"+id+"'");
		
		// If we try to transition while the transition or state
		// is transition, then we queue the state and proceed
		// after an animation has played out, to avoid abrupt changes
		if (this._isTransitioning)
		{
			this._queueStateId = id;
			return;
		}
		
		this._stateId = id;
		this.showBlocker();
		this._oldState = this._state;
		this._state = this._states[id];
		
		var sm;
		if (!this._oldState)
		{
			// There is not current state
			// this is only possible if this is the first
			// state we're loading
			this._isTransitioning = true;
			this._transition.visible = true;
			sm = this;
			this._loopTransition();
			sm.dispatchEvent(StateManager.TRANSITION_INIT_DONE);
			sm._isLoading = true;
			sm._state._internalEnterState(sm._onStateLoaded.bind(sm));
		}
		else
		{
			// Check to see if the state is currently in a load
			// if so cancel the state
			if (this._isLoading)
			{
				this._oldState._internalCancel();
				this._isLoading = false;
				this._state._internalEnterState(this._onStateLoaded);
			}
			else
			{
				this._isTransitioning = true;
				this._oldState._internalExitStateStart();
				if(CONFIG_PIXI) this.showBlocker();
				sm = this;
								
				this.dispatchEvent(new StateEvent(StateEvent.TRANSITION_OUT, this._state, this._oldState));
				this._oldState.transitionOut(
					function()
					{
						sm.dispatchEvent(new StateEvent(StateEvent.TRANSITION_OUT_DONE, sm._state, sm._oldState));
						sm.dispatchEvent(StateManager.TRANSITION_OUT);
						
						sm._transitioning(
							StateManager.TRANSITION_OUT,
							function()
							{
								sm.dispatchEvent(StateManager.TRANSITION_OUT_DONE);
								
								sm._isTransitioning = false;
								
								sm.dispatchEvent(new StateEvent(StateEvent.HIDDEN, sm._state, sm._oldState));
								sm._oldState.panel.visible = false;
								sm._oldState._internalExitState();
								sm._oldState = null;
								
								if (!sm._processQueue())
								{
									sm._isLoading = true;
									sm._state._internalEnterState(sm._onStateLoaded.bind(sm));
								}	
							}
						);
					}
				);
			}
		}
	};
	
	/**
	*   When the state has completed it's loading sequence
	*   this should be treated as an asyncronous process
	*   
	*   @function _onStateLoaded
	*   @private
	*/
	p._onStateLoaded = function()
	{
		this._isLoading = false;
		this._isTransitioning = true;
		
		this.dispatchEvent(new StateEvent(StateEvent.VISIBLE, this._state));
		this._state.panel.visible = true;
		
		this.dispatchEvent(StateManager.TRANSITION_IN);
		var sm = this;
		this._transitioning(
			StateManager.TRANSITION_IN,
			function()
			{
				sm._transition.visible = false;
				sm.dispatchEvent(StateManager.TRANSITION_IN_DONE);
				sm.dispatchEvent(new StateEvent(StateEvent.TRANSITION_IN, sm._state));
				sm._state.transitionIn(
					function()
					{
						sm.dispatchEvent(new StateEvent(StateEvent.TRANSITION_IN_DONE, sm._state));
						sm._isTransitioning = false;
						sm.hideBlocker();
						
						if (!sm._processQueue())
						{
							sm._state._internalEnterStateDone();
						}
					}
				);
			}
		);
	};
	
	/**
	*  Process the state queue
	*  
	*  @function _processQueue
	*  @return If there is a queue to process
	*  @private
	*/
	p._processQueue = function()
	{
		// If we have a state queued up
		// then don't start loading the new state
		// enter a new one
		if (this._queueStateId)
		{
			var queueStateId = this._queueStateId;
			this._queueStateId = null;
			this.setState(queueStateId);
			return true;
		}
		return false;
	};

	/**
	*  Plays the animation "transitionLoop" on the transition. Also serves as the animation callback.
	*  Manually looping the animation allows the animation to be synced to the audio while looping.
	*  
	*  @function _loopTransition
	*  @private
	*/
	p._loopTransition = function()
	{
		var audio;
		if(this._transitionSounds)
		{
			audio = this._transitionSounds.loop;
			if(Audio.instance.soundLoaded === false)//if soundLoaded is defined and false, then the AudioSprite is not yet loaded
				audio = null;
		}
		if(CONFIG_CREATEJS)
		{
			if(Animator.instanceHasAnimation(this._transition, "transitionLoop"))
				Animator.play(this._transition, "transitionLoop", this._loopTransition, null, null, null, audio);
		}
		else if(CONFIG_PIXI)
		{
			if(PixiAnimator.instance.instanceHasAnimation(this._transition, "transitionLoop"))
			{
				PixiAnimator.instance.play(
					this._transition,
					"transitionLoop", 
					this._loopTransition,
					false,
					1,
					0,
					audio
				);
			}
		}
	};
	
	/**
	 * Displays the transition out animation, without changing states.
	 * 
	 * @function showTransitionOut
	 * @param {function} callback The function to call when the animation is complete.
	 */
	p.showTransitionOut = function(callback)
	{
		this.showBlocker();
		var sm = this;
		var func = function() {
			
			sm._loopTransition();

			if(callback)
				callback();
		};
		this._transitioning(StateManager.TRANSITION_OUT, func);
	};

	/**
	 * Displays the transition in animation, without changing states.
	 * 
	 * @function showTransitionIn
	 * @param {function} callback The function to call when the animation is complete.
	 */
	p.showTransitionIn = function(callback)
	{
		var sm = this;
		this._transitioning(StateManager.TRANSITION_IN, function() { sm.hideBlocker(); if(callback) callback(); });
	};
	
	/**
	*   Generalized function for transitioning with the manager
	*   
	*   @function _transitioning
	*   @param {String} The animator event to play
	*   @param {Function} The callback function after transition is done
	*   @private
	*/
	p._transitioning = function(event, callback)
	{
		var clip = this._transition;
		clip.visible = true;
		var audio;
		if(this._transitionSounds)
		{
			audio = event == StateManager.TRANSITION_IN ? this._transitionSounds.in : this._transitionSounds.out;
			if(Audio.instance.soundLoaded === false)//if soundLoaded is defined and false, then the AudioSprite is not yet loaded
				audio = null;
		}
		if(CONFIG_CREATEJS)
		{
			Animator.play(this._transition, event, callback, null, null, null, audio);
		}
		else if(CONFIG_PIXI)
		{
			PixiAnimator.instance.play(
				clip,
				event, 
				callback,
				false,
				1,
				0,
				audio
			);
		}
	};
	
	/**
	*   The frame update function
	*   
	*   @function update
	*   @param {int} elasped The ms since the last frame
	*/
	p.update = function(elapsed)
	{
		if (this._state)
		{
			this._state.update(elapsed);
		}
	};
	
	/**
	*   Remove the state manager
	*   
	*   @function destroy
	*/
	p.destroy = function()
	{
		this._destroyed = true;
		
		if(CONFIG_CREATEJS)
			Animator.stop(this._transition);
		else if(CONFIG_PIXI)
			PixiAnimator.instance.stop(this._transition);
		
		this._transition = null;
		//this._loader = null;
		
		this._state = null;
		this._oldState = null;
		
		if (this._states)
		{
			for(var id in this._states)
			{
				this._states[id].destroy();
				delete this._states[id];
			}
		}
		this._states = null;
	};
	
	// Add to the name space
	namespace('cloudkid').StateManager = StateManager;
})();