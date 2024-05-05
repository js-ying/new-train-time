import { FC } from "react";

const ShareIcon: FC = () => {
  return (
    <div className="flex h-8 w-12 items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="32"
        height="32"
        className="fill-sky-600 dark:fill-sky-400"
      >
        <g id="Layer_2">
          <path
            className="st1"
            d="M50.21 19.87H40.8a1.641 1.641 0 0 0 0 3.28h9.41c.75 0 1.36.61 1.36 1.36v31.24c0 .75-.61 1.36-1.36 1.36H13.79c-.75 0-1.36-.61-1.36-1.36V24.5c0-.75.61-1.36 1.36-1.36h9.41a1.641 1.641 0 0 0 0-3.28h-9.41c-2.56 0-4.64 2.08-4.64 4.64v31.24c0 2.56 2.08 4.64 4.64 4.64h36.42c2.56 0 4.64-2.08 4.64-4.64V24.5a4.648 4.648 0 0 0-4.64-4.63z"
          />
          <path
            className="st1"
            d="M22.8 15.2c.42 0 .84-.16 1.16-.48l6.4-6.41v31.63a1.641 1.641 0 0 0 3.28 0V8.32l6.4 6.41c.32.32.74.48 1.16.48a1.635 1.635 0 0 0 1.16-2.79l-9.19-9.19c-.33-.33-.75-.49-1.17-.49-.42 0-.84.16-1.17.48l-9.19 9.19a1.63 1.63 0 0 0 0 2.31c.33.32.74.48 1.16.48z"
          />
        </g>
      </svg>
    </div>
  );
};

export default ShareIcon;