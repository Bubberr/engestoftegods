import './globals.css';

export const metadata = {
  title: 'Standbooking — Julemarked på Engestofte Gods',
  description:
    'Ansøg om en stand til julemarkedet på Engestofte Gods 5.-6. december 2026.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="da">
      <body className="min-h-screen bg-jule-cream">
        {children}
      </body>
    </html>
  );
}
