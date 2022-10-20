import {useEffect} from "react";

const NotFound = () => {
  useEffect(() => {
    document.title = "TODO - Page Not Found";
  }, []);

  return (
    <div>
      <p>page not found</p>
    </div>
  );
};

export default NotFound;
