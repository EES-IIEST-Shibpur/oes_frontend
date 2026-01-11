import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { AuthProvider } from '@/context/AuthContext';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import './globals.css';

export const metadata = {
  title: 'AptiCrack | Online Examination System',
  description: 'Welcome to the Online Examination System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <AdminAuthProvider>
              {children}
            </AdminAuthProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}