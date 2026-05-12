import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify';

import store from './store'
import RutasConfig from './components/config/RutasConfig'

function App() {
  return (
    <>
      <Provider store={store}>{/* Provider is used to pass the Redux store to the components */}
        <RutasConfig />{/* RutasConfig is used to define the routes of the application */}
      </Provider>
      <ToastContainer />{/* ToastContainer is used to display toast notifications */}
    </>
  )
}

export default App
