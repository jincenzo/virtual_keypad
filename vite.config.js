import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from local .env files
  const env = loadEnv(mode, process.cwd(), '')

  // Prioritize non-empty process.env (passed via Docker build args) over .env file values
  const apiEndpoint = process.env.VITE_API_ENDPOINT || env.VITE_API_ENDPOINT || 'http://localhost:3000/api/unlock'
  const labelSystemSecured = process.env.VITE_LABEL_SYSTEM_SECURED || env.VITE_LABEL_SYSTEM_SECURED || 'System Secured'
  const labelEnterPasscode = process.env.VITE_LABEL_ENTER_PASSCODE || env.VITE_LABEL_ENTER_PASSCODE || 'Enter Passcode'

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_ENDPOINT': JSON.stringify(apiEndpoint),
      'import.meta.env.VITE_LABEL_SYSTEM_SECURED': JSON.stringify(labelSystemSecured),
      'import.meta.env.VITE_LABEL_ENTER_PASSCODE': JSON.stringify(labelEnterPasscode),
    }
  }
})
