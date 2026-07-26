import { ApiClient, API_ENDPOINTS } from "@/lib/api";
import { authSessionSchema, type AuthSession, type LoginValues, type RegisterValues } from "../domain/auth.schema";

const apiClient = new ApiClient();

export function login(values: LoginValues): Promise<AuthSession> {
  return apiClient.post(API_ENDPOINTS.auth.login, {
    body: values,
    credentials: "include",
    schema: authSessionSchema,
  });
}

export function registerAccount(values: RegisterValues): Promise<AuthSession> {
  return apiClient.post(API_ENDPOINTS.auth.register, {
    body: {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    },
    credentials: "include",
    schema: authSessionSchema,
  });
}
