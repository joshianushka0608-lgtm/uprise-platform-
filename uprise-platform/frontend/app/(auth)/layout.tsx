import "./auth.css";
import { Providers } from "../providers";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-dark">UpRise</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </Providers>
  );
}
