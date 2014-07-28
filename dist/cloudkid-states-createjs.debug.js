!function() {
    "use strict";
    var Animator = cloudkid.Animator, StateManager = (cloudkid.PixiAnimator, cloudkid.StateManager), BaseState = function(panel) {
        this.initialize(panel);
    }, p = BaseState.prototype;
    p.addEventListener = null, p.removeEventListener = null, p.removeAllEventListeners = null, 
    p.dispatchEvent = null, p.hasEventListener = null, p._listeners = null, createjs.EventDispatcher && createjs.EventDispatcher.initialize(p), 
    p.stateId = null, p.manager = null, p.panel = null, p._destroyed = !1, p._active = !1, 
    p._isLoading = !1, p._canceled = !1, p._onEnterStateProceed = null, p._onLoadingComplete = null, 
    p._enabled = !1, p._isTransitioning = !1, p.initialize = function(panel) {
        this.panel = panel;
    }, p.getCanceled = function() {
        return this._canceled;
    }, p._internalExitState = function() {
        if (this._isTransitioning) {
            this._isTransitioning = !1;
            var animator = Animator;
            animator.stop(this.panel);
        }
        this._enabled = !1, this.panel.visible = !1, this._active = !1, this.exitState();
    }, p.exitState = function() {}, p._internalExitStateStart = function() {
        this.exitStateStart();
    }, p.exitStateStart = function() {}, p._internalEnterState = function(proceed) {
        if (this._isTransitioning) {
            this._isTransitioning = !1;
            var animator = Animator;
            animator.stop(this.panel);
        }
        this._enabled = !1, this._active = !0, this._canceled = !1, this._onEnterStateProceed = proceed, 
        this.enterState(), this._onEnterStateProceed && (this._onEnterStateProceed(), this._onEnterStateProceed = null);
    }, p.loadingStart = function() {
        return this._isLoading ? (Debug.warn("loadingStart() was called while we're already loading"), 
        void 0) : (this._isLoading = !0, this.manager.loadingStart(), this._onLoadingComplete = this._onEnterStateProceed, 
        this._onEnterStateProceed = null, void 0);
    }, p.loadingDone = function() {
        return this._isLoading ? (this._isLoading = !1, this.manager.loadingDone(), this._onLoadingComplete && (this._onLoadingComplete(), 
        this._onLoadingComplete = null), void 0) : (Debug.warn("loadingDone() was called without a load started, call loadingStart() first"), 
        void 0);
    }, p._internalCancel = function() {
        this._active = !1, this._canceled = !0, this._isLoading = !1, this._internalExitState(), 
        this.cancel();
    }, p.cancel = function() {}, p.enterState = function() {}, p._internalEnterStateDone = function() {
        this._canceled || (this.setEnabled(!0), this.enterStateDone());
    }, p.enterStateDone = function() {}, p.update = function() {}, p.getActive = function() {
        return this._active;
    }, p.transitionIn = function(callback) {
        this._isTransitioning = !0;
        var s = this, animator = Animator;
        animator.play(this.panel, StateManager.TRANSITION_IN, function() {
            s._isTransitioning = !1, callback();
        });
    }, p.transitionOut = function(callback) {
        this._enabled = !1, this._isTransitioning = !0;
        var s = this, animator = Animator;
        animator.play(this.panel, StateManager.TRANSITION_OUT, function() {
            s._isTransitioning = !1, callback();
        });
    }, p.getDestroyed = function() {
        return this._destroyed;
    }, p.setEnabled = function(enabled) {
        this._enabled = enabled;
    }, p.getEnabled = function() {
        return this._enabled;
    }, p.destroy = function() {
        this.exitState(), this.panel = null, this.manager = null, this._destroyed = !0, 
        this._onEnterStateProceed = null, this._onLoadingComplete = null;
    }, namespace("cloudkid").BaseState = BaseState;
}(), function(undefined) {
    "use strict";
    var StateEvent = function(type, currentState, visibleState) {
        this.initialize(type, currentState, visibleState);
    }, p = StateEvent.prototype;
    StateEvent.TRANSITION_IN = "onTransitionStateIn", StateEvent.TRANSITION_IN_DONE = "onTransitionStateInDone", 
    StateEvent.TRANSITION_OUT = "onTransitionStateOut", StateEvent.TRANSITION_OUT_DONE = "onTransitionStateOutDone", 
    StateEvent.VISIBLE = "onVisible", StateEvent.HIDDEN = "onHidden", p.currentState = null, 
    p.visibleState = null, p.type = null, p.initialize = function(type, currentState, visibleState) {
        this.type = type, this.visibleState = visibleState === undefined ? currentState : visibleState, 
        this.currentState = currentState;
    }, namespace("cloudkid").StateEvent = StateEvent;
}(), function(undefined) {
    "use strict";
    var Audio = cloudkid.Audio || cloudkid.Sound, OS = cloudkid.OS, Animator = cloudkid.Animator, BaseState = cloudkid.BaseState, StateEvent = (cloudkid.PixiAnimator, 
    cloudkid.StateEvent), EventDispatcher = createjs.EventDispatcher, MovieClip = createjs.MovieClip, Touch = createjs.Touch, StateManager = function(transition, audio) {
        this.initialize(transition, audio);
    }, p = StateManager.prototype;
    p.addEventListener = null, p.removeEventListener = null, p.removeAllEventListeners = null, 
    p.dispatchEvent = null, p.hasEventListener = null, p._listeners = null, EventDispatcher && EventDispatcher.initialize(p), 
    StateManager.VERSION = "1.1.4", p._transition = null, p._transitionSounds = null, 
    p._states = null, p._state = null, p._stateId = null, p._oldState = null, p._isLoading = !1, 
    p._isTransitioning = !1, p._destroyed = !1, p._queueStateId = null, StateManager.TRANSITION_IN = "onTransitionIn", 
    StateManager.TRANSITION_IN_DONE = "onTransitionInDone", StateManager.TRANSITION_OUT = "onTransitionOut", 
    StateManager.TRANSITION_OUT_DONE = "onTransitionOutDone", StateManager.DIALOG_SHOW = "onBlockerShow", 
    StateManager.DIALOG_SHOW_DONE = "onBlockerShowDone", StateManager.DIALOG_HIDE = "onBlockerHide", 
    StateManager.DIALOG_HIDE_DONE = "onBlockerHideDone", StateManager.TRANSITION_INIT = "onInit", 
    StateManager.TRANSITION_INIT_DONE = "onInitDone", StateManager.LOADING_START = "onLoadingStart", 
    StateManager.LOADING_DONE = "onLoadingDone", p.initialize = function(transition, transitionSounds) {
        Debug.assert(transition instanceof MovieClip, "transition needs to subclass createjs.MovieClip"), 
        this._transition = transition, this._transition.stop(), this.hideBlocker(), this._states = {}, 
        this._transitionSounds = transitionSounds || null, this._loopTransition = this._loopTransition.bind(this);
    }, p.addState = function(id, state) {
        Debug.assert(state instanceof BaseState, "State (" + id + ") needs to subclass cloudkid.BaseState"), 
        this._states[id] = state, state.stateId = id, state.manager = this, state._internalExitState();
    }, p.changeTransition = function(clip) {
        Debug.assert(clip instanceof MovieClip, "Transition needs to subclass createjs.MovieClip"), 
        this._transition = clip;
    }, p.getState = function() {
        return this._stateId;
    }, p.getCurrentState = function() {
        return this._state;
    }, p.getStateById = function(id) {
        return Debug.assert(this._states[id] !== undefined, "No alias matching " + id), 
        this._states[id];
    }, p.isBusy = function() {
        return this._isLoading || this._isTransitioning;
    }, p.loadingStart = function() {
        this._destroyed || this.dispatchEvent(StateManager.LOADING_START);
    }, p.loadingDone = function() {
        this._destroyed || this.dispatchEvent(StateManager.LOADING_DONE);
    }, p.showBlocker = function() {
        var stage = OS.instance.stage;
        stage.enableMouseOver(!1), stage.enableDOMEvents(!1), Touch.disable(stage);
    }, p.hideBlocker = function() {
        var os = OS.instance, stage = os.stage;
        stage.enableMouseOver(os.options.mouseOverRate), stage.enableDOMEvents(!0), Touch.enable(stage);
    }, p.refresh = function() {
        Debug.assert(!!this._state, "No current state to refresh!"), this.setState(this._stateId);
    }, p.setState = function(id) {
        if (Debug.assert(this._states[id] !== undefined, "No current state mattching id '" + id + "'"), 
        this._isTransitioning) return this._queueStateId = id, void 0;
        this._stateId = id, this.showBlocker(), this._oldState = this._state, this._state = this._states[id];
        var sm;
        this._oldState ? this._isLoading ? (this._oldState._internalCancel(), this._isLoading = !1, 
        this._state._internalEnterState(this._onStateLoaded)) : (this._isTransitioning = !0, 
        this._oldState._internalExitStateStart(), sm = this, this.dispatchEvent(new StateEvent(StateEvent.TRANSITION_OUT, this._state, this._oldState)), 
        this._oldState.transitionOut(function() {
            sm.dispatchEvent(new StateEvent(StateEvent.TRANSITION_OUT_DONE, sm._state, sm._oldState)), 
            sm.dispatchEvent(StateManager.TRANSITION_OUT), sm._transitioning(StateManager.TRANSITION_OUT, function() {
                sm.dispatchEvent(StateManager.TRANSITION_OUT_DONE), sm._isTransitioning = !1, sm.dispatchEvent(new StateEvent(StateEvent.HIDDEN, sm._state, sm._oldState)), 
                sm._oldState.panel.visible = !1, sm._oldState._internalExitState(), sm._oldState = null, 
                sm._loopTransition(), sm._processQueue() || (sm._isLoading = !0, sm._state._internalEnterState(sm._onStateLoaded.bind(sm)));
            });
        })) : (this._isTransitioning = !0, this._transition.visible = !0, sm = this, this._loopTransition(), 
        sm.dispatchEvent(StateManager.TRANSITION_INIT_DONE), sm._isLoading = !0, sm._state._internalEnterState(sm._onStateLoaded.bind(sm)));
    }, p._onStateLoaded = function() {
        this._isLoading = !1, this._isTransitioning = !0, this.dispatchEvent(new StateEvent(StateEvent.VISIBLE, this._state)), 
        this._state.panel.visible = !0, this.dispatchEvent(StateManager.TRANSITION_IN);
        var sm = this;
        this._transitioning(StateManager.TRANSITION_IN, function() {
            sm._transition.visible = !1, sm.dispatchEvent(StateManager.TRANSITION_IN_DONE), 
            sm.dispatchEvent(new StateEvent(StateEvent.TRANSITION_IN, sm._state)), sm._state.transitionIn(function() {
                sm.dispatchEvent(new StateEvent(StateEvent.TRANSITION_IN_DONE, sm._state)), sm._isTransitioning = !1, 
                sm.hideBlocker(), sm._processQueue() || sm._state._internalEnterStateDone();
            });
        });
    }, p._processQueue = function() {
        if (this._queueStateId) {
            var queueStateId = this._queueStateId;
            return this._queueStateId = null, this.setState(queueStateId), !0;
        }
        return !1;
    }, p._loopTransition = function() {
        var audio;
        this._transitionSounds && (audio = this._transitionSounds.loop, Audio.instance.soundLoaded === !1 && (audio = null)), 
        Animator.instanceHasAnimation(this._transition, "transitionLoop") && Animator.play(this._transition, "transitionLoop", this._loopTransition, null, null, null, audio);
    }, p.showTransitionOut = function(callback) {
        this.showBlocker();
        var sm = this, func = function() {
            sm._loopTransition(), callback && callback();
        };
        this._transitioning(StateManager.TRANSITION_OUT, func);
    }, p.showTransitionIn = function(callback) {
        var sm = this;
        this._transitioning(StateManager.TRANSITION_IN, function() {
            sm.hideBlocker(), callback && callback();
        });
    }, p._transitioning = function(event, callback) {
        var clip = this._transition;
        clip.visible = !0;
        var audio;
        this._transitionSounds && (audio = event == StateManager.TRANSITION_IN ? this._transitionSounds.in : this._transitionSounds.out, 
        Audio.instance.soundLoaded === !1 && (audio = null)), Animator.play(this._transition, event, callback, null, null, null, audio);
    }, p.update = function(elapsed) {
        this._state && this._state.update(elapsed);
    }, p.destroy = function() {
        if (this._destroyed = !0, Animator.stop(this._transition), this._transition = null, 
        this._state = null, this._oldState = null, this._states) for (var id in this._states) this._states[id].destroy(), 
        delete this._states[id];
        this._states = null;
    }, namespace("cloudkid").StateManager = StateManager;
}();