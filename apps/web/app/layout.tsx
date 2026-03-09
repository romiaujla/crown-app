import "./globals.css";

export const metadata = {
  title: "Crown Workspaces",
  description: "Platform control plane and tenant workspaces powered by Crown"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
