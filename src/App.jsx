import { Route, Routes } from 'react-router-dom';
import TestAPI from './components/TestAPI';
import Items from './components/Items';
import ItemDetail from './components/ItemDetail';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path='/test_api' element={<TestAPI />} />
      <Route path='/items' element={<Items />} />
      <Route path='/items/:id' element={<ItemDetail />} />
    </Routes>
  );
}

export default App;
