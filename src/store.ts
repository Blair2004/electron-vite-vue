import { BehaviorSubject, Observable, Subject, distinctUntilChanged, map, scan, shareReplay } from "rxjs";
import { State } from "./interfaces/State";
import { produce } from "immer";

class Store {

    private _state$: BehaviorSubject<any>;
    private _history$: BehaviorSubject<any>;
    private _action$: Subject<any>;
    private _initialState: any;

    constructor(initialState: any) {
        this._initialState = initialState;
        this._state$ = new BehaviorSubject(initialState);
        this._history$ = new BehaviorSubject([initialState]);
        this._action$ = new Subject();

        this._action$
            .pipe(
                scan((state, reducer) => reducer(state), this._initialState),
                shareReplay(1)
            )
            .subscribe(this._state$);

        this._state$
            .pipe(
                scan((history, state) => [...history, state], [initialState]),
                shareReplay(1)
            )
            .subscribe(this._history$);
    }

    getState$() {
        return this._state$.asObservable();
    }

    getHistory$() {
        return this._history$.asObservable();
    }

    dispatch(updater: Function) {
        this._action$.next((state: State) => produce(state, <any>updater));
    }

    /**
     * to listen specific state change.
     * @param selector callback
     * @returns Observable
     */
    select(selector: (value: any, index: number) => any) {
        return this._state$.pipe(
          map(selector),
          distinctUntilChanged()
        );
      }
}

export const store = new Store({});