import { useEffect, useState } from 'react';
import {Route, Routes} from 'react-router-dom';
import TestAPI from './components/TestAPI';
import './App.css'
function App() {
  
  return (
    <Routes>
      <Route path='/test_api' element={<TestAPI/>}/>
    </Routes>
  )
}
export default App