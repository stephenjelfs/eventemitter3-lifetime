import * as EventEmitter from "eventemitter3";

const END_OF_LIFE: string = "endOfLife";

export interface Lifetime {
    onEndOfLife(listener: Function, context: any): void;
}

export class LifetimeImpl implements Lifetime {

    private eventEmitter: EventEmitter3.EventEmitter = new EventEmitter();

    onEndOfLife(listener: () => void, context: any): void {
        if (this.eventEmitter == null) {
            throw "Life already ended.";
        }
        this.eventEmitter.addListener(END_OF_LIFE, listener, context);
    }

    endLife(): void {
        this.eventEmitter.emit(END_OF_LIFE);
        this.eventEmitter.removeAllListeners(END_OF_LIFE);
        this.eventEmitter = null;
    }
}
