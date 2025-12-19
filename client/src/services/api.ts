const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Copy existing headers if any
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      // Ensure endpoint starts with /
      const endpointPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const fullUrl = `${API_BASE_URL}${endpointPath}`;
      console.log(`API Request: ${options.method || 'GET'} ${fullUrl}`);
      
      const response = await fetch(fullUrl, {
        ...options,
        headers: headers as HeadersInit,
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (!response.ok) {
          return { error: `Server error: ${response.status} ${response.statusText}` };
        }
        return { error: 'Invalid response format' };
      }

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || `Request failed: ${response.status}` };
      }

      return { data };
    } catch (error: any) {
      // Check if it's a JSON parse error
      if (error.message && error.message.includes('JSON')) {
        return { error: 'Server returned invalid response. Make sure the backend server is running.' };
      }
      return { error: error.message || 'Network error. Is the backend server running?' };
    }
  }

  // Auth
  async register(username: string, email: string, password: string) {
    return this.request('auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async login(username: string, password: string) {
    return this.request('auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // Workouts
  async getWorkouts() {
    return this.request('workouts');
  }

  async createWorkout(workout: { name: string; exercises: any[] }) {
    return this.request('workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
    });
  }

  async deleteWorkout(id: number) {
    return this.request(`workouts/${id}`, {
      method: 'DELETE',
    });
  }

  async logWorkout(id: number) {
    return this.request(`workouts/${id}/log`, {
      method: 'POST',
    });
  }

  // Goals
  async getGoals() {
    return this.request('goals');
  }

  async createGoal(title: string) {
    return this.request('goals', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async updateGoal(id: string, updates: { title?: string; isCompleted?: boolean }) {
    return this.request(`goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteGoal(id: string) {
    return this.request(`goals/${id}`, {
      method: 'DELETE',
    });
  }

  // Nutrition
  async getNutrition(filters?: { date?: string; startDate?: string; endDate?: string }) {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const query = params.toString();
    return this.request(`nutrition${query ? `?${query}` : ''}`);
  }

  async getNutritionSummary(startDate: string, endDate: string) {
    return this.request(`nutrition/summary?startDate=${startDate}&endDate=${endDate}`);
  }

  async createNutritionEntry(entry: {
    date: string;
    mealType: string;
    foodName: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  }) {
    return this.request('nutrition', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  async updateNutritionEntry(id: number, entry: any) {
    return this.request(`nutrition/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    });
  }

  async deleteNutritionEntry(id: number) {
    return this.request(`nutrition/${id}`, {
      method: 'DELETE',
    });
  }

  // Stats
  async getWorkoutStats(days: number = 30) {
    return this.request(`stats/workouts?days=${days}`);
  }

  async getNutritionStats(days: number = 30) {
    return this.request(`stats/nutrition?days=${days}`);
  }

  async getGoalStats() {
    return this.request('stats/goals');
  }
}

export const api = new ApiService();

