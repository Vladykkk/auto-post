import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { IoRocketOutline } from "react-icons/io5";
import { SiSubstack } from "react-icons/si";

export const PLATFORM_SELECTOR_OPTIONS = [
  {
    label: "Multi-Platform",
    value: "multi",
    icon: <IoRocketOutline size={24} className="text-purple-600" />,
  },
  {
    label: "LinkedIn",
    value: "linkedin",
    icon: <FaLinkedin size={24} className="text-blue-600" />,
  },
  {
    label: "X (Twitter)",
    value: "x",
    icon: <FaXTwitter size={24} className="text-black" />,
  },
  {
    label: "Substack",
    value: "substack",
    icon: <SiSubstack size={24} className="text-orange-600" />,
  },
];
