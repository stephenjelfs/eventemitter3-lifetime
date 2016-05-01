import {Lifetime} from "../src/Lifetime";
import * as EventEmitter from "eventemitter3";
import createSpy = jasmine.createSpy;
import Spy = jasmine.Spy;

describe("Lifetime", function() {

    it("should notify end of life listeners", function() {
        let life: Lifetime = new Lifetime();

        let listener1: Spy = createSpy("listener1");
        let listener2: Spy = createSpy("listener2");

        life.onEndOfLife(listener1, this);
        life.onEndOfLife(listener2, this);

        expect(listener1).not.toHaveBeenCalled();
        expect(listener2).not.toHaveBeenCalled();

        life.endLife();

        expect(listener1).toHaveBeenCalled();
        expect(listener2).toHaveBeenCalled();
    });

    it("should not allow new listeners after life is ended", function() {
        let life: Lifetime = new Lifetime();

        expect(() => life.onEndOfLife(() => {}, this)).not.toThrow();
        life.endLife();
        expect(() => life.onEndOfLife(() => {}, this)).toThrow();
    });

    it("should end when parent life end", function() {
        let parentLife: Lifetime = new Lifetime();
        let life: Lifetime = new Lifetime(parentLife);

        expect(() => life.onEndOfLife(() => {}, this)).not.toThrow();
        parentLife.endLife();
        expect(() => life.onEndOfLife(() => {}, this)).toThrow();
    });

    it("should remove event emitter listeners on end of life", function() {
        let life: Lifetime = new Lifetime();
        let eventEmitter: EventEmitter3.EventEmitter = new EventEmitter();

        let listener1: Spy = createSpy("listener1");
        let listener2: Spy = createSpy("listener2");

        life.on(eventEmitter, "change", listener1, this);
        life.on(eventEmitter, "change", listener2, this);
        expect(eventEmitter.listeners("change").length).toBe(2);

        expect(listener1).not.toHaveBeenCalled();
        expect(listener2).not.toHaveBeenCalled();

        eventEmitter.emit("change");
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(1);

        life.endLife();
        expect(eventEmitter.listeners("change").length).toBe(0);

        eventEmitter.emit("change");
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(1);
    });

});
