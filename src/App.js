import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle'
import { Toaster } from 'react-hot-toast';

import { Routes, Route, BrowserRouter } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import Home from './pages/Home';



function App() {



  return (
    <>
      <div>
        <Toaster
          position='top-right' toastOptions={{
            success: {
              theme: {
                primary: "4aed88"
              }
            }
          }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
        </Routes>
      </BrowserRouter>








    </>
  );
}

export default App;
