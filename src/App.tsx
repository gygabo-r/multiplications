import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import Home from './pages/Home'
import NumberPicker from './pages/NumberPicker'
import SessionPage from './pages/SessionPage'
import Stats from './pages/Stats'
import Animals from './pages/Animals'

export default function App() {
  return (
    <BrowserRouter basename="/multiplications">
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="play/:mode" element={<NumberPicker />} />
          <Route path="play/:mode/:n" element={<SessionPage />} />
          <Route path="stats" element={<Stats />} />
          <Route path="collection" element={<Animals />} />
          {/* Legacy redirects */}
          <Route path="memorize" element={<Navigate to="/" replace />} />
          <Route path="memorize/:table" element={<Navigate to="/" replace />} />
          <Route path="animals" element={<Navigate to="/collection" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
