import { IoDocumentTextOutline, IoMailOutline } from "react-icons/io5";

export const SUBSTACK_POST_TYPE_OPTIONS = [
  {
    id: "post",
    label: "Post",
    value: "post",
    icon: <IoDocumentTextOutline size={20} />,
  },
  {
    id: "newsletter",
    label: "Newsletter",
    value: "newsletter",
    icon: <IoMailOutline size={20} />,
  },
];

export const SUBSTACK_PUBLISH_OPTIONS = [
  {
    id: "draft",
    label: "Save as Draft",
    value: true,
  },
  {
    id: "publish",
    label: "Publish Now",
    value: false,
  },
];
