import React from "react";

type LoaderProps = {
  fullscreen?: boolean;
  className?: string;
};

export function Loader({ fullscreen = false, className }: LoaderProps) {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-background/60 backdrop-blur-sm">
        <div className={"loader " + (className ?? "")} />
      </div>
    );
  }

  return <div className={"loader w-full mx-auto" + (className ?? "")} />;
}

export default Loader;
