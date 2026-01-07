export const metadata = {
  title: 'AptiCrack | Online Examination System',
  description: 'Welcome to the Online Examination System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Trebuchet MS', backgroundColor: '#f5f5f5' }}>
        {children}
      </body>
    </html>
  );
}