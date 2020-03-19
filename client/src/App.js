import React from 'react';
import { Route , Switch } from 'react-router-dom'
import {routes} from './routes'
import FileUploader from './containers/FileUploader'
function App() {
  // const endpoint = "http://127.0.0.1:8080"
  

 

  // const { response } = userState;
  return (
    <div>
      <Switch>
        <Route path={routes.upload} component={FileUploader} />
        {/* <Route path={} component={UploadFile} /> */}
      </Switch>
      {/* {response
        ? <p>
          The temperature in Florence is: {response} °F
            </p>
        : <p>Loading...</p>} */}
    </div>
  );

}

export default App;
