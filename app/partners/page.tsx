import dynamic from "next/dynamic";

const PartnersInteractive = dynamic(
  () => import("@/components/partners/PartnersInteractive"),
  { ssr: true },
);

export default function PartnersPage() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,#1a1f3d_0%,#101322_40%,#0a0a0f_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(120,140,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(120,140,255,0.10) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)",
          }}
        />
        <div className="absolute -top-32 left-1/2 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/[0.13] blur-[130px]" />
        <div className="absolute left-[-8%] top-[35%] h-[380px] w-[520px] rounded-full bg-brand/[0.08] blur-[130px]" />
        <div className="absolute right-[-8%] top-[45%] h-[380px] w-[520px] rounded-full bg-brand/[0.08] blur-[130px]" />
        <div className="absolute bottom-[-10%] left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-white/[0.045] blur-[130px]" />
      </div>
      <PartnersInteractive />
    </div>
  );
}
