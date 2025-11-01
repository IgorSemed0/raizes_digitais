const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/"

export type ApiResponse<T> = {
  success: true 
  data: T 
  message?: string 
}

export type ApiError = {
  success: false 
  error: string 
  details?: unknown 
  statusCode?: number 
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json", 
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json()

    if (!response.ok) {
      const error:  ApiError = {
        success: false,
        error: data.error || "Erro desconhecido",
        details: data.details,
        statusCode: response.status,
      }
      throw error
    }

    return data
  }

  async get<T>(
    endpoint: string, 
    token?: string, 
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(token), 
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(
    endpoint: string, 
    body: unknown,
    token?: string, 
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(token),
      body: JSON.stringify(body), 
    })

    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, body: unknown, token?: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(token),
      body: JSON.stringify(body),
    })

    return this.handleResponse<T>(response)
  }

  async patch<T>(endpoint: string, body: unknown, token?: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(token),
      body: JSON.stringify(body),
    })

    return this.handleResponse<T>(response)
  }
  async delete<T>(endpoint: string, token?: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(token),
    })

    return this.handleResponse<T>(response)
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
