import { authApi } from "@/shared/api/authApi";

export const useAuth = () => {
  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login({ email, password });
      console.log("Успешный вход:", res);
    } catch (e) {
      console.error("Ошибка авторизации", e);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const res = await authApi.register({ email, password });
      console.log("Успешная регистрация:", res);
    } catch (e) {
      console.error("Ошибка регистрации", e);
    }
  };

  return { login, register };
};
