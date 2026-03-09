import "./globals.css";

export const metadata = {
  title: "Crown Control Plane",
  description: "Crown platform control plane for tenant management systems"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
