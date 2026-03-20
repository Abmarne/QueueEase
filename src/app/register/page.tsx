import { AuthForm } from "@/components/auth/auth-form";
import Logo from "@/components/Logo";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4 gap-8">
      <Link href="/">
        <Logo size={48} className="scale-125" />
      </Link>
      <AuthForm mode="register" />
    </div>
  );
}
