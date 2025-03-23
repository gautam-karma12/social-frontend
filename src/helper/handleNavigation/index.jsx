import { useNavigate } from "react-router-dom";

// Common navigation hook
const useCustomNavigation = () => {
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
  };

  return { goTo };
};

export default useCustomNavigation;
