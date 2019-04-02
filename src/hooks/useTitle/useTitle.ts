import { useEffect, useState } from "react";

export const useTitle = (originalTitle: string) => {
  const [title, setTitle] = useState(originalTitle);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return setTitle;
};
