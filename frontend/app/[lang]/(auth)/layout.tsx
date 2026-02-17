export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background isolate">
      <div className="pointer-events-none absolute inset-x-0 bottom-[-40%] h-screen z-0 bottom-glow" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-md items-start px-6 pt-24 pb-12 md:items-center">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}

