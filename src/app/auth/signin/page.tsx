import LoginForm from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Sign In | Demo App",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <LoginForm />
    </div>
  );
}
