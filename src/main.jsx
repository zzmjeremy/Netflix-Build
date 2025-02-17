import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux' // ✅ 新增
import { store } from './app/store'    // ✅ 新增
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> {/* ✅ 包裹 App 组件 */}
      <App />
    </Provider>
  </StrictMode>,
)
