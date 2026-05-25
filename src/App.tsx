import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import Home from './pages/Home'
import Memorize from './pages/Memorize'
import Stats from './pages/Stats'
import Animals from './pages/Animals'

export default function App() {
  return (
    <BrowserRouter basename="/multiplications">
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="memorize" element={<Memorize />} />
          <Route path="memorize/:table" element={<Memorize />} />
          <Route path="stats" element={<Stats />} />
          <Route path="animals" element={<Animals />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
