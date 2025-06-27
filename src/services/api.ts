import type {
  ApiResponse,
  BackendUserResponse,
  CreatePostError,
  CreatePostRequest,
  CreatePostResponse,
  CreateSubstackPostRequest,
  CreateSubstackPostResponse,
  CreateSubstackSessionResponse,
  CreateTweetRequest,
  CreateTweetResponse,
  LinkedInUser,
  MediaUploadResponse,
  StartSubstackLoginRequest,
  StartSubstackLoginResponse,
  SubstackPublication,
  SubstackUser,
  SubstackUserResponse,
  VerifySubstackCodeRequest,
  VerifySubstackCodeResponse,
  WaitSubstackVerifyRequest,
  WaitSubstackVerifyResponse,
  XUser,
  XUserResponse,
} from "@/types/api";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    let token: string | null = null;

    if (
      config.url?.includes("/linkedin/") ||
      config.url?.includes("/auth/linkedin/")
    ) {
      token = localStorage.getItem("linkedinAuthToken");
    } else if (
      config.url?.includes("/x/") ||
      config.url?.includes("/auth/x/") ||
      config.url?.includes("/posts/x/")
    ) {
      token = localStorage.getItem("xAuthToken");
    } else if (config.url?.includes("/api/substack/")) {
      if (config.url?.includes("/api/substack/user")) {
        token = localStorage.getItem("substackAuthToken");
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const linkedInApi = {
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
        "/api/posts/linkedin/upload",
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

  async createPost(postData: CreatePostRequest): Promise<CreatePostResponse> {
    try {
      const response = await api.post<CreatePostResponse>(
        "/api/posts/linkedin/post",
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

  async logout(): Promise<boolean> {
    try {
      const response = await api.post<ApiResponse>("/api/auth/linkedin/logout");
      localStorage.removeItem("linkedinAuthToken");
      return response.data.success;
    } catch {
      return false;
    }
  },
};

export const xApi = {
  async checkAuth(): Promise<XUser | null> {
    try {
      const response = await api.get<XUserResponse>("/api/x/user");

      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("Error in X checkAuth:", error);
      return null;
    }
  },

  async createTweet(
    tweetData: CreateTweetRequest,
  ): Promise<CreateTweetResponse> {
    try {
      const response = await api.post<CreateTweetResponse>(
        "/api/posts/x/tweet",
        tweetData,
      );

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to create tweet");
      }
    } catch (error) {
      console.error("Error creating tweet:", error);

      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as CreatePostError;
        throw new Error(errorData.message || "Failed to create tweet");
      }

      throw new Error("Network error occurred while creating tweet");
    }
  },

  async logout(): Promise<boolean> {
    try {
      const response = await api.post<ApiResponse>("/api/auth/x/logout");
      localStorage.removeItem("xAuthToken");
      return response.data.success;
    } catch {
      return false;
    }
  },
};

export const substackApi = {
  async createSession(): Promise<CreateSubstackSessionResponse> {
    try {
      const response = await api.post<CreateSubstackSessionResponse>(
        "/api/substack/session",
      );

      if (response.data.success && response.data.data.sessionId) {
        localStorage.setItem("substackSessionId", response.data.data.sessionId);
        return response.data;
      } else {
        throw new Error("Failed to create session");
      }
    } catch (error) {
      console.error("Error creating Substack session:", error);

      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as CreatePostError;
        throw new Error(errorData.message || "Failed to create session");
      }

      throw new Error("Network error occurred while creating session");
    }
  },

  async startLogin(
    loginData: StartSubstackLoginRequest,
  ): Promise<StartSubstackLoginResponse> {
    try {
      const response = await api.post<StartSubstackLoginResponse>(
        "/api/substack/login",
        loginData,
      );

      if (response.data.success) {
        localStorage.setItem("substackUserEmail", loginData.email);
        localStorage.setItem("substackLoginStatus", response.data.status);
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to start login");
      }
    } catch (error) {
      console.error("Error starting Substack login:", error);

      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as CreatePostError;
        throw new Error(errorData.message || "Failed to start login");
      }

      throw new Error("Network error occurred while starting login");
    }
  },

  async verifyCode(
    verifyData: VerifySubstackCodeRequest,
  ): Promise<VerifySubstackCodeResponse> {
    try {
      const response = await api.post<VerifySubstackCodeResponse>(
        "/api/substack/verify",
        verifyData,
      );

      if (response.data.success) {
        localStorage.setItem("substackUserName", response.data.userData.name);
        localStorage.setItem("substackUserEmail", response.data.userData.email);
        localStorage.setItem("substackLoginStatus", response.data.status);
        return response.data;
      } else {
        throw new Error("Failed to verify code");
      }
    } catch (error) {
      console.error("Error verifying Substack code:", error);

      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as CreatePostError;
        throw new Error(errorData.message || "Failed to verify code");
      }

      throw new Error("Network error occurred while verifying code");
    }
  },

  async waitVerify(
    verifyData: WaitSubstackVerifyRequest,
  ): Promise<WaitSubstackVerifyResponse> {
    try {
      const requestData = {
        sessionId: verifyData.sessionId,
        timeoutSeconds: verifyData.timeoutSeconds || 300,
      };

      const response = await api.post<WaitSubstackVerifyResponse>(
        "/api/substack/wait-verify",
        requestData,
      );

      if (response.data.success && response.data.data) {
        if (response.data.data.substackAuthToken) {
          localStorage.setItem(
            "substackAuthToken",
            response.data.data.substackAuthToken,
          );
          console.log("✅ Substack auth token stored successfully");
        } else {
          console.warn("⚠️ No substackAuthToken found in response");
        }

        return response.data;
      } else {
        throw new Error("Failed to verify via email link");
      }
    } catch (error) {
      console.error("Error waiting for Substack verification:", error);

      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as CreatePostError;
        throw new Error(errorData.message || "Failed to verify via email link");
      }

      throw new Error("Network error occurred while waiting for verification");
    }
  },

  async getSessionStatus(
    sessionId: string,
  ): Promise<{ status: string; userData?: { email: string; name: string } }> {
    try {
      const response = await api.get<{
        success: boolean;
        status: string;
        userData?: { email: string; name: string };
      }>(`/api/substack/session/${sessionId}`);

      if (response.data.success) {
        return {
          status: response.data.status,
          userData: response.data.userData,
        };
      } else {
        throw new Error("Failed to get session status");
      }
    } catch (error) {
      console.error("Error getting session status:", error);
      throw error;
    }
  },

  async getPublications(sessionId: string): Promise<SubstackPublication[]> {
    try {
      const response = await api.get<{
        success: boolean;
        data: SubstackPublication[];
      }>(`/api/substack/publications?sessionId=${sessionId}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to get publications");
      }
    } catch (error) {
      console.error("Error getting publications:", error);
      return [];
    }
  },

  async createPost(
    sessionId: string,
    postData: CreateSubstackPostRequest,
  ): Promise<CreateSubstackPostResponse> {
    try {
      const response = await api.post<CreateSubstackPostResponse>(
        "/api/substack/post",
        { ...postData, sessionId },
      );

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating Substack post:", error);

      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as CreatePostError;
        throw new Error(errorData.message || "Failed to create post");
      }

      throw new Error("Network error occurred while creating post");
    }
  },

  async checkAuth(): Promise<SubstackUser | null> {
    try {
      if (this.isAuthenticated()) {
        try {
          return await this.getCurrentUser();
        } catch (error) {
          console.warn("Token-based auth failed:", error);
          this.clearSessionData();
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error("Error checking Substack auth:", error);
      return null;
    }
  },

  async getCurrentUser(): Promise<SubstackUser> {
    const token = localStorage.getItem("substackAuthToken");
    if (!token) {
      throw new Error("No auth token available");
    }

    try {
      const response =
        await api.get<SubstackUserResponse>("/api/substack/user");

      if (response.data.success) {
        const apiData = response.data.data;
        const mappedUser: SubstackUser = {
          id: apiData.email,
          email: apiData.email,
          name: apiData.name,
          profileUrl: apiData.profileUrl,
          provider: apiData.provider,
          isLoggedIn: apiData.isLoggedIn,
          loginTime: apiData.loginTime,
          tokenIssuedAt: apiData.tokenIssuedAt,
          tokenExpiresAt: apiData.tokenExpiresAt,
          status: "logged_in",
          publications: [],
          authTokens: apiData.authTokens,
        };

        return mappedUser;
      } else {
        throw new Error(response.data.message || "Failed to get user info");
      }
    } catch (error) {
      console.error("Error getting current user:", error);

      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as CreatePostError;
        throw new Error(errorData.message || "Failed to get user info");
      }

      throw new Error("Network error occurred while getting user info");
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("substackAuthToken");
  },

  clearSessionData() {
    localStorage.removeItem("substackAuthToken");

    localStorage.removeItem("substackUserEmail");
    localStorage.removeItem("substackUserName");
    localStorage.removeItem("substackLoginStatus");
  },

  async logout(): Promise<boolean> {
    try {
      const sessionId = localStorage.getItem("substackSessionId");

      if (sessionId) {
        try {
          await api.delete(`/api/substack/session/${sessionId}`);
        } catch (error) {
          console.warn("Could not close session on backend:", error);
        }
      }

      this.clearSessionData();
      localStorage.removeItem("substackSessionId");
      return true;
    } catch (error) {
      console.error("Error logging out:", error);
      return false;
    }
  },
};

export const redirectToLinkedInAuth = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/linkedin`;
};

export const redirectToXAuth = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/x`;
};

export default api;
