import {
  IoDocumentTextOutline,
  IoImageOutline,
  IoVideocamOutline,
} from "react-icons/io5";

export const LINKEDIN_POST_TYPE_OPTIONS = [
  {
    id: 0,
    label: "Text",
    value: "TEXT",
    icon: <IoDocumentTextOutline size={24} />,
  },
  {
    id: 1,
    label: "Image",
    value: "IMAGE",
    icon: <IoImageOutline size={24} />,
  },
  {
    id: 2,
    label: "Video",
    value: "VIDEO",
    icon: <IoVideocamOutline size={24} />,
  },
];

export const LINKEDIN_VISIBILITY_OPTIONS = [
  {
    id: 0,
    label: "🌍 Public - Anyone can see this post",
    value: "PUBLIC",
  },
  {
    id: 1,
    label: "👥 Connections Only - Only your connections can see this",
    value: "CONNECTIONS",
  },
];
