/**
 * @Author: qiancheng
 * @Date:   2020-05-16T18:46:51+08:00
 * @Last modified by:   qiancheng
 * @Last modified time: 2020-05-19T14:54:07+08:00
 */

interface Config {
  initial: string | number;
  states: {
    [key: string]: {
      transitions: {
        [key: string]: string | number
      },
      rule?: Array<(...rest: any) => string>
    }
  }
  // triggers: {
  //   [key: string]: (...rest: any[]) => void;
  // }
}

export default class FSM {

  CURRENT: string | number;

  STATES: Config['states'];

  // TRIGGERS: Config['triggers'];

  history: Array<string | number>;

  STATE_MAP: Set<string | number>;

  // TRIGGER_MAP: Set<string>;

  INIT_STATE: string | number;

  constructor(config?: Config){
    this.history = [];
    if(config){

      // init
      this.CURRENT = config.initial;
      this.INIT_STATE = config.initial;
      this.STATES = config.states || {};
      // this.TRIGGERS = config.triggers || {};

      // states
      this.STATE_MAP = new Set<string>();
      Object.keys(this.STATES).map((i) => this.STATE_MAP.add(i));

      // triggers
      // this.TRIGGER_MAP = new Set<string>();
      // Object.keys(this.TRIGGERS).map((i) => this.TRIGGER_MAP.add(i));
    }else {
      throw Error('need initial config for fsm');
    }
  }

  getState() {
    return this.CURRENT;
  }

  changeState(state: string | number) {
    if(this.STATE_MAP.has(state)){
      this.CURRENT = state;
      this.history.push(state);
    }else{
      console.error('invalid state for local fsm');
    }
  }


  trigger(events: Array<(state: string) => string | number | false>) {

    const conditionType = events.map((i) => {
      return i(this.CURRENT+'');
    }).filter((i) => i).toString();

    const { transitions = {} } = this.STATES[this.CURRENT] || {};

    if(Object.keys(transitions).includes(conditionType)){
      const nextState = transitions[conditionType];
      this.changeState(nextState);
    }else {
      console.error('invalid transitions way for local fsm');
    }
  }

  reset() {
    this.CURRENT = this.INIT_STATE;
  }

  getStates() {
    return this.STATES;
  }

  // undo() {
  //   if(this.history.length > 0){
  //     this.CURRENT = this.history.pop()!;
  //   }else {
  //     console.error('no history for local fsm to do undo action');
  //   }
  // }
  //
  // redo() {
  //   if(this.history.length > 0){
  //     this.CURRENT = this.history[this.history.length - 1];
  //   }else {
  //     console.error('no history for local fsm to do redo action');
  //   }
  // }

  clearHistory() {
    this.history = [];
  }

}
