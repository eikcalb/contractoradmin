import React, { createContext } from "react"
import CONFIG from "./config"
import { Redirect } from "react-router-dom"
import { User, DUMMY_USER } from "./user"

class Application {
    config: Config
    user?: User

    constructor(config: Config) {
        this.config = config
    }

    signedIn(): boolean {
        return this.user && this.user.token
    }

    authGuard(redirectTo) {
        if (!this.signedIn()) {
            return <Redirect to={redirectTo} />
        }
    }
}

export const DEFAULT_APPLICATION = new Application(CONFIG)
DEFAULT_APPLICATION.user = DUMMY_USER
/**
 * This is the application context used within the web application.
 * 
 * This context provided the application engine and is not tied to any view rendering.
 * 
 * The underlying aplication object exposes the required functions and do not modify the view.
 * This underlying object is made available to all React components via the application context.
 * 
 * All view rendering is managed in React.
 * 
 * **VIEW RENDERING SHOULD NOT DEPEND ON ANY PROPERTY OF THIS CONTEXT**
 */
export const APPLICATION_CONTEXT = createContext<Application>(DEFAULT_APPLICATION)

/**
 * This context is used for managing the views within the web app.
 * Activities such as loading and splashscreen are implemented using this context.
 */
export const VIEW_CONTEXT = createContext<any>({
    setAppReady: (ready: boolean) => { },
    showToolbar: (show: boolean) => { }
})

export interface Config {
    appName: string
    version: string
    description: string

}
