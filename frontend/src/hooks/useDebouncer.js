import debounce from "lodash.debounce";
import { useEffect, useState } from "react";

const useDebouncer = (setSearchedTerm) => {
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const debouncer = debounce((newTerm) => {
      setSearchedTerm(newTerm);
    }, 500);
    if (searchTerm) {
      debouncer(searchTerm);
    } else {
      setSearchedTerm("");
    }
    return () => {
      debouncer.cancel();
    };
  }, [searchTerm]);
  return [searchTerm, setSearchTerm];
};

export default useDebouncer;
