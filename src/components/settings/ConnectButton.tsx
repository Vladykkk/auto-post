interface ConnectButtonProps {
  handleConnect: () => void;
  children: React.ReactNode;
  linkedin?: boolean;
  x?: boolean;
}

const ConnectButton = ({
  handleConnect,
  children,
  linkedin,
  x,
}: ConnectButtonProps) => {
  return (
    <button
      onClick={handleConnect}
      className={`flex w-full items-center justify-center rounded-lg px-6 py-3 font-medium text-white transition-colors ${
        linkedin && "bg-blue-600 hover:bg-blue-700"
      } ${x && "bg-black hover:bg-gray-800"}`}
    >
      {children}
    </button>
  );
};

export default ConnectButton;
