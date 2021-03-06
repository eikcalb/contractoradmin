import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import { Footer } from './components/footer';
import { AuthGuard } from './components/guard';
import Toolbar from './components/toolbar';
import { Loading } from './components/util';
import { APPLICATION_CONTEXT, VIEW_CONTEXT } from './lib';
import './lib/firebase';
import links from './lib/links';
import { User } from './lib/user';
import { Dashboard } from './pages/dashboard';
import { Jobs } from './pages/jobs';
import { Login } from './pages/login';
import { Logout } from './pages/logout';
import { Messages } from './pages/messages';
import { Profile } from './pages/profile';
import { Register } from './pages/register';
import { Settings } from './pages/settings';
import { NotificationProvider } from './components/notification';
import { ChatListProvider } from './components/messages';
import { Invoices } from './pages/invoices';

function App() {
  const ctx = useContext(APPLICATION_CONTEXT)
  const [state, setState] = useState({ ready: false, })
  const [showFooter, setShowFooter] = useState(true)
  const [_showToolbar, showToolbar] = useState(true)
  const [signedIn, setSignedIn] = useState<null | User>(null)

  const viewContext = {
    signedIn,
    setSignedIn,
    setAppReady: (ready) => setState({ ...state, ready }),
    showToolbar,
    showFooter: (showFooter) => setShowFooter(showFooter)
  }

  useEffect(() => {
    ctx.loginListener = () => {
      if (ctx.signedIn()) {
        viewContext.setSignedIn(ctx.user as User)
      }
    }

    ctx.logoutListener = () => viewContext.setSignedIn(null)

    ctx.ready.then((ready) => {
      if (!ready) {
        return console.log('Failed to start application due to an internal error.', 'Please contact application admin')
      }
      setState({ ...state, ready: true })
    })
      .catch(e => {
        console.log(e)
      })
  }, [])

  return (
    <NotificationProvider>
      <ChatListProvider>
        <VIEW_CONTEXT.Provider value={viewContext}>
          {state.ready ?
            <>
              {_showToolbar ? <Toolbar /> : null}
              <div className='App-Body'>
                <div className='is-fullheight'>
                  <Switch>
                    <Route component={Login} path={links.login} exact />
                    <Route component={Register} path={links.register} exact />
                    <Route component={Logout} path={links.logout} exact />

                    <AuthGuard component={Settings} path={links.settings} />
                    <AuthGuard render={(props) => {
                      return <Redirect to={{ pathname: links.activeJobs, state: props.location.state }} />
                    }} path={links.jobs} exact />
                    <AuthGuard component={Jobs} path={links._jobItem.active} />
                    <AuthGuard component={Jobs} path={links._jobItem.inactive} />
                    <AuthGuard component={Messages} path={links._messages} />
                    <AuthGuard component={Profile} path={links._profile} />
                    <AuthGuard component={Invoices} path={links.invoices} exact />
                    <AuthGuard component={Dashboard} path={links.dashboard} exact />

                    <Route path={links.home} strict={false} exact={true}>
                      {ctx.signedIn() && viewContext.signedIn ? <Redirect to={links.dashboard} /> : <Redirect to={links.login} />}
                    </Route>
                    <AuthGuard />
                  </Switch>
                </div>
              </div>
              {showFooter ? <Footer /> : null}
            </> :
            <Loading />
          }
        </VIEW_CONTEXT.Provider>
      </ChatListProvider>
    </NotificationProvider>
  );
}

export default App;
