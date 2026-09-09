"use client";

type AuthFormNoticeProps = {
  message?: string;
  tone?: "error" | "success";
};

export function AuthFormNotice({ message, tone = "error" }: AuthFormNoticeProps) {
  if (!message) return null;

  return (
    <p
      className={`rounded-md border px-4 py-3 text-sm ${
        tone === "success"
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
          : "border-red-400/30 bg-red-400/10 text-red-200"
      }`}
      role={tone === "error" ? "alert" : "status"}
    >
      {message}
    </p>
  );
}
