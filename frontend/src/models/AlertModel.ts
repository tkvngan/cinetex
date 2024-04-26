import {ViewModel} from "./ViewModel";

export interface Alert {
    readonly type: 'info' | 'warning' | 'error' | 'success';
    readonly message: string;
}

export interface AlertState {
    readonly alert: Alert | undefined;
    readonly history: Alert[];
}

export type AlertIntent = {
    readonly action: 'set';
    readonly alert: Alert
} | {
    readonly action: 'clear' | 'clearAll'
}

export class AlertModel extends ViewModel<AlertState, AlertIntent> {
    public constructor() {
        super({ alert: undefined, history: [] });
    }

    public async handle(intent: AlertIntent): Promise<void> {
        switch (intent.action) {
            case 'set':
                this.state = {
                    alert: intent.alert,
                    history: [...this.state.history, intent.alert]
                };
                break;
            case 'clear':
                this.state = {
                    alert: undefined,
                    history: this.state.history
                };
                break;
            case 'clearAll':
                this.state = {
                    alert: undefined,
                    history: []
                };
                break;
        }
    }
}