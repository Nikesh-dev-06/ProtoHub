export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg px-4 overflow-hidden">
      <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-15%] right-[5%] w-[400px] h-[400px] bg-info/10 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="relative z-10 w-full max-w-[400px] animate-fade-in">
        {children}
      </div>
    </div>
  );
}
