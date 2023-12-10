/** @jsxImportSource @emotion/react */

import {css as cssJs} from "@emotion/css";
import bg from "./assets/svg/bg.svg";

const darkBodyStyle = cssJs({
    backgroundAttachment: 'fixed',
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.217) 0%, var(--cinetex-solid-dark-color)), url(${bg})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#e26fe4ba',
    backgroundSize: '100% auto',
})

const lightBodyStyle = cssJs({
})

export class AppThemeManager {
    private _theme: 'light' | 'dark'
    private observers: {
        readonly callback: (theme: 'light' | 'dark') => void,
        readonly unsubscribe: () => void
    }[] = []

    constructor(theme?: 'light' | 'dark') {
        this._theme = theme ?? 'light'
        this.updateTheme(this._theme)
    }

    get theme() {
        return this._theme
    }

    private updateTheme(theme: 'light' | 'dark') {
        console.log("ThemeManager.updateTheme: ", theme)
        const html = document.documentElement as HTMLHtmlElement
        const body = document.body as HTMLBodyElement
        if (theme === "dark") {
            html.setAttribute('data-bs-theme', 'dark')
            body.classList.remove(lightBodyStyle)
            body.classList.add(darkBodyStyle)
        } else {
            html.setAttribute('data-bs-theme', 'light')
            body.classList.remove(darkBodyStyle)
            body.classList.add(lightBodyStyle)
        }
    }

    setTheme(theme: 'light' | 'dark') {
        if (this._theme !== theme) {
            this._theme = theme
            this.updateTheme(theme)
            this.notifyObservers(theme)
        }
    }

    subscribe(callback: (theme: 'light' | 'dark') => void): { unsubscribe: () => void } {
        const observer = {
            callback: callback,
            unsubscribe: () => {
                const index = this.observers.indexOf(observer)
                if (index !== -1) {
                    this.observers.splice(index, 1)

                }
            }
        }
        this.observers.push(observer)
        return observer
    }

    protected notifyObservers(theme: 'light' | 'dark') {
        this.observers.forEach(observer => {
            console.log("ThemeManager.notifyObservers: ", theme)
            try {
                observer.callback(theme)
            } catch (error) {
                console.error(error)
            }
        })
    }
}

export default AppThemeManager
