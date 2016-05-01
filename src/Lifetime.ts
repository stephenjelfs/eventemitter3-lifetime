import * as EventEmitter from "eventemitter3";

const END_OF_LIFE: string = "endOfLife";

export interface EventEmitterLike {
  on(event: string, fn: Function, life: Lifetime, context?: any): EventEmitterLike;
  off(event: string, fn?: Function, context?: any, once?: boolean): EventEmitterLike;
}

export class Lifetime {

    private eventEmitter: EventEmitter3.EventEmitter = new EventEmitter();

    constructor(parentLife?: Lifetime) {
      if (parentLife) {
        parentLife.onEndOfLife(() => this.endLife(), this);
      }
    }

    /**
     * Register an end of life listener.
     *
     * @param {Function} fn Callback function.
     * @param {Mixed} [context=this] The context of the function.
     * @api public
     */
    onEndOfLife(fn: Function, context: any): void {
        if (this.eventEmitter == null) {
            throw "Life already ended.";
        }
        this.eventEmitter.addListener(END_OF_LIFE, fn, context);
    }


    /**
     * Fires an end of life event.
     *
     * @api public
     */
    endLife(): void {
        this.eventEmitter.emit(END_OF_LIFE);
        this.eventEmitter.removeAllListeners(END_OF_LIFE);
        this.eventEmitter = null;
    }

    /**
     * Register a new EventListener with an {EventEmitter} for the given event,
     * until this life is ended.
     *
     * @param {EventEmitter} eventEmitter Name of the event.
     * @param {String} event Name of the event.
     * @param {Function} fn Callback function.
     * @param {Mixed} [context=this] The context of the function.
     * @api public
     */
    on(eventEmitter: EventEmitterLike, event: string, fn: Function, context?: any): Lifetime {
      eventEmitter.on(event, fn, context);
      this.onEndOfLife(() => eventEmitter.off(event, fn, context), context);
      return this;
    }
}
