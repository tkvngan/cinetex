
export abstract class ViewModel<State, Intent> {

    private _state: State;
    private readonly _callbacks: ((state: State) => void)[] = [];

    protected constructor(initialState: State) {
        this._state = initialState;
    }

    get state(): State {
        return this._state;
    }

    protected set state(state: State) {
        this._state = state;
        for (const callback of this._callbacks) {
            callback(state);
        }
    }

    public subscribe(callback: (state: State) => void): { dispose: () => void } {
        this._callbacks.push(callback);
        return {
            dispose: () => {
                const index = this._callbacks.indexOf(callback);
                if (index !== -1) {
                    this._callbacks.splice(index, 1);
                }
            }
        }
    }

    public close() {
        this._callbacks.splice(0, this._callbacks.length);
    }

    public abstract handle(intent: Intent): Promise<void>;
}
