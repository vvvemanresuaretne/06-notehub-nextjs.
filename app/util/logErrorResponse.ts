import { AxiosError } from "axios";

export function logErrorResponse(error: AxiosError): void {
  console.error("API Error:", {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    data: error.response?.data,
  });
}
