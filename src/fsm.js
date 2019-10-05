class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) throw new Error('error');
        this.config = config;
        this.stateChain = [];
        this.stateBuffer = [];
        this.stateChain.push(this.config.initial);
        this.redoLock = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.stateChain[this.stateChain.length - 1];
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.config.states[state]) throw new Error('change state errors');
        this.stateChain.push(state);
        this.redoLock = true;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (!this.config.states[this.stateChain[this.stateChain.length - 1]].transitions[event]) 
        throw new Error('trigger error');
        this.stateChain.push(this.config.states[this.stateChain[this.stateChain.length - 1]].transitions[event]);
        this.redoLock = true;
    }
    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.stateChain = this.stateChain.slice(0, 1);
        this.stateBuffer = [];
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (!event) {
            return Object.keys(this.config.states);
        } else {
            return Object.keys(this.config.states).filter(item => Object.keys(this.config.states[item].transitions).indexOf(event) >= 0);
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.stateChain.length > 1) {
            this.stateBuffer.push(this.stateChain.pop());
            this.redoLock = false;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.stateBuffer.length === 0 || this.redoLock === true) {
            return false;
        } else {
            this.stateChain.push(this.stateBuffer.pop());
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.stateChain = this.stateChain.slice(this.stateChain.length - 1, this.stateChain.length);
        this.currentStateIndex = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
