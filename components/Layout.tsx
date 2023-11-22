import { useContext } from "react";
import ThemeSwitch from "./ThemeSwitch";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../contexts/SearchAreaContext";

interface LayoutParams {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = "" }: LayoutParams) {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="relative mb-6">
        <h1 className="text-center">
          <span
            className="cursor-pointer"
            onClick={() => setParams({ ...params, activeIndex: null })}
          >
            {title}
          </span>
        </h1>
        <div className="absolute top-0.5 right-0">
          <ThemeSwitch />
        </div>
      </div>
      {children}
    </div>
  );
}
