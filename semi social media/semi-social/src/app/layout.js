import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'UNIVERA — Premium University Ecosystem',
  description: 'A high-fidelity university-exclusive platform for synchronized campus communication and academic collaboration.',
  keywords: 'univera, university, campus, social ecosystem, students, faculty, education',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
