import { RegisterForm } from "@/features/auth/ui/RegisterForm";

export const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow">
        <h1 className="text-xl font-bold mb-4">Регистрация</h1>
        <RegisterForm />
      </div>
    </div>
  );
};