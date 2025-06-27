import {
  IoDocumentTextOutline,
  IoImageOutline,
  IoVideocamOutline,
} from "react-icons/io5";

import type { MediaType } from "@/types/api";

export const MULTI_PLATFORM_POST_TYPE_OPTIONS = [
  {
    id: 0,
    value: "TEXT" as MediaType,
    icon: <IoDocumentTextOutline size={24} />,
    label: "Text",
  },
];

export const SINGLE_PLATFORM_POST_TYPE_OPTIONS = [
  {
    id: 0,
    value: "TEXT" as MediaType,
    icon: <IoDocumentTextOutline size={24} />,
    label: "Text",
  },
  {
    id: 1,
    value: "IMAGE" as MediaType,
    icon: <IoImageOutline size={24} />,
    label: "Image",
  },
  {
    id: 2,
    value: "VIDEO" as MediaType,
    icon: <IoVideocamOutline size={24} />,
    label: "Video",
  },
];
