import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4">
      <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" aria-hidden />
      <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-brand-dark/20 blur-[120px]" aria-hidden />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size={72} href="/" />
        </div>
        <div className="cyber-panel p-8">{children}</div>
      </div>
    </div>
  );
}
