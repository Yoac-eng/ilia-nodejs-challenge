export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute left-[-5%] top-[-10%] h-[500px] w-[500px] bg-primary glow-blob" />
      <div className="pointer-events-none absolute right-[-10%] top-[30%] h-[400px] w-[400px] glow-blob glow-blob-accent" />
      <div className="pointer-events-none absolute bottom-[-10%] left-[30%] h-[600px] w-[600px] glow-blob glow-blob-soft" />

      <main className="relative z-10 mx-auto w-full max-w-4xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}

