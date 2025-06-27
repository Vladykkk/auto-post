import type { LinkedInUser, Platform, SubstackUser, XUser } from "./api";

export interface PlatformInfo {
  id: Platform;
  name: string;
  icon: React.ReactElement;
  connected: boolean;
  user?: LinkedInUser | XUser | SubstackUser;
}
