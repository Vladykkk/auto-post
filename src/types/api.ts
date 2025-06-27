export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    type?: string;
    field?: string;
  };
}

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

export interface XUser {
  id: string;
  username: string;
  name: string;
  email: string | null;
  provider: "x";
  profileImageUrl?: string;
  verified?: boolean;
  description?: string;
  createdAt?: string;
  publicMetrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
}

export type LinkedInVisibility = "PUBLIC" | "CONNECTIONS" | "LOGGED_IN_MEMBERS";
export type MediaType = "TEXT" | "IMAGE" | "VIDEO";

export interface MediaAsset {
  assetUrn: string;
  title: string;
  description: string;
}

export interface CreatePostRequest {
  text: string;
  visibility?: LinkedInVisibility;
  mediaType?: MediaType;
  articleUrl?: string;
  articleTitle?: string;
  articleDescription?: string;
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

export interface CreateTweetRequest {
  text: string;
  reply?: {
    in_reply_to_tweet_id: string;
    exclude_reply_user_ids?: string[];
  };
  poll?: {
    options: string[];
    duration_minutes: number;
  };
  reply_settings?: "following" | "mentionedUsers" | null;
  geo?: {
    place_id: string;
  };
  for_super_followers_only?: boolean;
}

export interface CreateTweetResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    text: string;
    author: {
      id: string;
      name: string;
      username: string;
    };
    platform: "X";
    createdAt: string;
  };
  meta: {
    author: string;
    platform: "X";
    textLength: number;
    hasMedia: boolean;
  };
}

export interface XUserResponse {
  success: boolean;
  message: string;
  data: XUser;
  meta?: {
    refreshed?: boolean;
    timestamp?: string;
    platform?: "X";
  };
}

export type Platform = "linkedin" | "x" | "substack";
export type PlatformUser = LinkedInUser | XUser | SubstackUser;

export interface SubstackUser {
  id: string;
  email: string;
  name: string | null;
  profileUrl?: string;
  provider: "substack";
  isLoggedIn: boolean;
  loginTime: string;
  tokenIssuedAt?: string;
  tokenExpiresAt?: string;
  sessionId?: string;
  status: "logged_in" | "awaiting_verification";
  publications?: SubstackPublication[];
  authTokens?: {
    cookies?: Record<string, string>;
    localStorage?: Record<string, string>;
    domain?: string;
    extractedAt?: string;
  };
}

export interface SubstackUserResponse {
  success: boolean;
  data: {
    provider: "substack";
    email: string;
    name: string | null;
    profileUrl: string;
    isLoggedIn: boolean;
    loginTime: string;
    tokenIssuedAt: string;
    tokenExpiresAt: string;
    authTokens: {
      cookies: Record<string, string>;
      localStorage: Record<string, string>;
      domain: string;
      extractedAt: string;
    };
  };
  message: string;
}

export interface SubstackPublication {
  id: string;
  name: string;
  url: string;
  description?: string;
  subdomain: string;
}

export interface CreateSubstackSessionResponse {
  success: boolean;
  data: {
    sessionId: string;
    success: boolean;
  };
  message: string;
  meta: {
    sessionId: string;
    timestamp: string;
  };
}

export interface StartSubstackLoginRequest {
  sessionId: string;
  email: string;
}

export interface StartSubstackLoginResponse {
  status: "awaiting_verification";
  message: string;
  success: boolean;
}

export interface VerifySubstackCodeRequest {
  sessionId: string;
  verificationCode: string;
}

export interface VerifySubstackCodeResponse {
  status: "logged_in";
  userData: {
    email: string;
    name: string;
  };
  success: boolean;
}

export interface WaitSubstackVerifyRequest {
  sessionId: string;
  timeoutSeconds?: number;
}

export interface WaitSubstackVerifyResponse {
  success: boolean;
  data: {
    success: boolean;
    status: "logged_in";
    userData: {
      email: string;
      name: string | null;
      profileUrl?: string;
      isLoggedIn?: boolean;
      loginTime?: string;
      authTokens?: {
        cookies?: Record<string, string>;
        localStorage?: Record<string, string>;
        domain?: string;
        extractedAt?: string;
      };
    };
    substackAuthToken?: string;
    message?: string;
    verificationMethod?: string;
  };
  message?: string;
  status?: "logged_in";
  userData?: {
    email: string;
    name: string;
  };
  substackAuthToken?: string;
}

export interface CreateSubstackPostRequest {
  title: string;
  content: string;
  subtitle?: string;
  isDraft?: boolean;
}

export interface CreateSubstackPostResponse {
  success: boolean;
  data: {
    success: boolean;
    title: string;
    subtitle?: string;
    content: string;
    isDraft: boolean;
    postUrl: string;
    currentUrl: string;
    message: string;
    createdAt: string;
  };
  message: string;
}

export interface MultiPlatformPostRequest {
  platforms: Platform[];
  content: {
    text: string;
    media?: File;
    mediaType?: MediaType;
  };
  platformSpecific: {
    linkedin?: {
      visibility: LinkedInVisibility;
      articleData?: {
        url: string;
        title: string;
        description?: string;
      };
    };
    x?: Record<string, never>;
    substack?: {
      title: string;
      subtitle?: string;
      isDraft?: boolean;
    };
  };
}

export interface MultiPlatformPostResponse {
  success: boolean;
  results: {
    platform: Platform;
    success: boolean;
    data?:
      | CreatePostResponse
      | CreateTweetResponse
      | CreateSubstackPostResponse;
    error?: string;
  }[];
  message: string;
}

export interface PlatformPostResult {
  platform: Platform;
  success: boolean;
  data?: CreatePostResponse | CreateTweetResponse | CreateSubstackPostResponse;
  error?: string;
}
