export const metadata = {
  title: "ARPY6 apply",
  description: "Upload ZIP and export Excel"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#f5f7fb" }}>
        {children}
      </body>
    </html>
  );
}
