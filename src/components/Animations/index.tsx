import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export type AnimationProps = {
  type: AnimationType;
  size?: {
    width: string;
    height: string;
  } | null;
};

export enum AnimationType {
  LOAD_SEARCH = "load-search",
  NOT_FOUND = "not-found",
}

export default function Animations(props: AnimationProps) {
  const { type, size = { width: "100px", height: "100px" } } = props;

  return (
    <DotLottieReact
      style={{ width: size?.width, height: size?.height }}
      src={`/${type}.lottie`}
      loop
      autoplay
    />
  );
}
