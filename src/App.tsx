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

function App() {
  const ctx = useContext(APPLICATION_CONTEXT)
  const [state, setState] = useState({ ready: false, showToolbar: true })

  useEffect(() => {
    setState({ ...state, ready: true })
  }, [])

  const viewContext = {
    setAppReady: (ready) => setState({ ...state, ready }),
    showToolbar: (showToolbar) => setState({ ...state, showToolbar })

  }

  return (
    <APPLICATION_CONTEXT.Provider value={DEFAULT_APPLICATION}>
      <VIEW_CONTEXT.Provider value={viewContext}>
        {state.ready ?
          <>
            {state.showToolbar ? <Toolbar /> : null}
            <div className='App-Body'>
              <div className='is-fullheight'>
                <Switch>

                  <Route component={Jobs} path={links.activeJobs} />
                  <Route component={Jobs} path={links.inactiveJobs} />
                  <Route render={(props) => {
                    return <Redirect to={{ pathname: links.activeJobs, state: props.location.state }} />
                  }} path={links.jobs} exact />
                  <Route component={Dashboard} path={links.dashboard} exact />
                </Switch>
              </div>
            </div>
            <Footer />
          </> :
          <Loading />
        }
      </VIEW_CONTEXT.Provider>
    </APPLICATION_CONTEXT.Provider >
  );
}

export default App;
