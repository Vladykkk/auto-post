import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router";

import { useLinkedInAuth } from "@/hooks/useLinkedInAuth";

import ConnectionStatus from "./ConnectionStatus";
import PostForm from "./PostForm";

const Form = () => {
  const navigate = useNavigate();
  const { linkedinUser, isLoading, connect } = useLinkedInAuth();

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <>
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Social Media Post Creator
          </h1>
          <IoSettingsOutline
            className="cursor-pointer text-gray-600 transition-colors hover:text-gray-800"
            size={32}
            onClick={handleSettingsClick}
            title="Settings"
          />
        </div>

        <ConnectionStatus
          linkedinUser={linkedinUser}
          isLoading={isLoading}
          onConnect={connect}
        />

        {linkedinUser && <PostForm user={linkedinUser} />}
      </div>
    </>
  );
};

export default Form;
