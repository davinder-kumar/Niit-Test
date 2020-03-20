import React from 'react';
import { Route, Switch } from 'react-router-dom'
import { routes } from './routes'
import FileUploader from './containers/FileUploader/FileUploader'
import Homepage from './containers/Homepage/Homepage'
import Layout from './hoc/Layout/Layout'
function App() {
  return (
    <div>
      <Layout>
        <Switch>

          <Route path={routes.upload} component={FileUploader} />
          <Route exact path={routes.home} component={Homepage} />
        </Switch>
      </Layout>

    </div>
  );

}

export default App;
