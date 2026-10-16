import { lazy, Suspense } from 'react'
import { LoaderCircle } from 'lucide-react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/auth'
import { LoginPage } from './pages/LoginPage'
const UsersPage = lazy(() =>
  import('./pages/UsersPage').then((module) => ({ default: module.UsersPage })),
)
function ProtectedUsers() {
  const { session } = useAuth()
  return session ? <UsersPage /> : <Navigate to="/login" replace />
}
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="route-loading" role="status">
              <div>
                <LoaderCircle size={22} className="spin" />
                Loading your workspace…
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/users" element={<ProtectedUsers />} />
            <Route path="*" element={<Navigate to="/users" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
