import { LoginForm } from "@/features/auth/ui/LoginForm";

export const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow">
        <h1 className="text-xl font-bold mb-4">Вход</h1>
        <LoginForm />
      </div>
    </div>
  );
};