import type {
  ApiResponse,
  BackendUserResponse,
  CreatePostError,
  CreatePostRequest,
  CreatePostResponse,
  LinkedInUser,
  MediaUploadResponse,
} from "@/types/api";
import axios from "axios";

// Simple axios instance with cookies and token support
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to include Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// LinkedIn API functions
export const linkedInApi = {
  // Auth check with Bearer token
  async checkAuth(): Promise<LinkedInUser | null> {
    try {
      const response = await api.get<BackendUserResponse>("/api/linkedin/user");

      if (
        response.data &&
        response.data.success &&
        response.data.data &&
        response.data.data.id
      ) {
        const backendUser = response.data.data;

        // Transform backend user to frontend user format
        const [firstName, ...lastNameParts] = backendUser.name.split(" ");
        const lastName = lastNameParts.join(" ") || "";

        const transformedUser = {
          id: backendUser.id,
          firstName: firstName || "",
          lastName,
          email: backendUser.email,
          loginTime: backendUser.loginTime,
          tokenExpires: backendUser.tokenExpires,
        };

        return transformedUser;
      }
      return null;
    } catch (error) {
      console.error("Error in checkAuth:", error);
      return null;
    }
  },

  // Upload media (images/videos)
  async uploadMedia(
    file: File,
    title: string,
    description: string,
  ): Promise<MediaUploadResponse> {
    try {
      const formData = new FormData();
      formData.append("media", file);
      formData.append(
        "mediaType",
        file.type.startsWith("image/") ? "image" : "video",
      );
      formData.append("title", title);
      formData.append("description", description);

      const response = await api.post<MediaUploadResponse>(
        "/api/linkedin/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to upload media");
      }
    } catch (error) {
      console.error("Error uploading media:", error);

      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as CreatePostError;
        throw new Error(errorData.message || "Failed to upload media");
      }

      throw new Error("Network error occurred while uploading media");
    }
  },

  // Create LinkedIn post
  async createPost(postData: CreatePostRequest): Promise<CreatePostResponse> {
    try {
      const response = await api.post<CreatePostResponse>(
        "/api/linkedin/post",
        postData,
      );

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating LinkedIn post:", error);

      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as CreatePostError;
        throw new Error(errorData.message || "Failed to create post");
      }

      throw new Error("Network error occurred while creating post");
    }
  },

  // Simple logout
  async logout(): Promise<boolean> {
    try {
      const response = await api.post<ApiResponse>("/api/auth/linkedin/logout");
      // Clear token on logout
      localStorage.removeItem("authToken");
      return response.data.success;
    } catch {
      return false;
    }
  },
};

// Simple LinkedIn OAuth redirect
export const redirectToLinkedInAuth = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/linkedin`;
};

export default api;
