// API response interfaces
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    type?: string;
    field?: string;
  };
}

// Backend user response interface (matches actual backend response)
export interface BackendUserResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    loginTime: string;
    tokenExpires: string;
  };
  message: string;
}

export interface LinkedInUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  loginTime?: string;
  tokenExpires?: string;
}

// LinkedIn Post Creation Types
export type LinkedInVisibility = "PUBLIC" | "CONNECTIONS" | "LOGGED_IN_MEMBERS";
export type MediaType = "TEXT" | "ARTICLE" | "IMAGE" | "VIDEO";

export interface MediaAsset {
  assetUrn: string;
  title: string;
  description: string;
}

export interface CreatePostRequest {
  text: string;
  visibility?: LinkedInVisibility;
  mediaType?: MediaType;
  // For article posts
  articleUrl?: string;
  articleTitle?: string;
  articleDescription?: string;
  // For media posts
  media?: MediaAsset[];
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  data: {
    postId: string;
    postUrl: string;
    text: string;
    visibility: LinkedInVisibility;
    mediaType?: MediaType;
    article?: {
      url: string;
      title: string;
      description: string;
    };
    createdAt: string;
  };
  meta: {
    author: string;
    platform: string;
    textLength: number;
  };
}

export interface MediaUploadResponse {
  success: boolean;
  message: string;
  data: {
    assetUrn: string;
    mediaType: "image" | "video";
    title: string;
    description: string;
    fileName: string;
    fileSize: number;
    uploadedAt: string;
  };
}

export interface CreatePostError {
  success: false;
  message: string;
  error: {
    field?: string;
    provided?: boolean;
    length?: number;
    maxLength?: number;
    error?: string;
    action?: string;
  };
}
