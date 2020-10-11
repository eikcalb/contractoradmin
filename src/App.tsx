import React, { useContext, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { APPLICATION_CONTEXT, DEFAULT_APPLICATION, VIEW_CONTEXT } from './lib';
import Toolbar from './components/toolbar';
import { Loading } from './components/util';
import { Footer } from './components/footer';
import { NotificationList } from './components/notification';
import { Switch, Route, useHistory, Redirect, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import links from './lib/links';
import { Jobs } from './pages/jobs';
import { Settings } from './pages/settings';
import { AuthGuard } from './components/guard';
import { User } from './lib/user';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Logout } from './pages/logout';

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
                <AuthGuard component={Jobs} path={links.activeJobs} />
                <AuthGuard component={Jobs} path={links.inactiveJobs} />
                <AuthGuard component={Dashboard} path={links.dashboard} exact />

                <Route path={links.home} strict={false} exact={true}>
                  {ctx.signedIn() && viewContext.signedIn ? <Redirect to={links.dashboard} /> : <Redirect to={links.login} />}
                </Route>
              </Switch>
            </div>
          </div>
          {showFooter ? <Footer /> : null}
        </> :
        <Loading />
      }
    </VIEW_CONTEXT.Provider>
  );
}

export default App;
