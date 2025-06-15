import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoadingGif() {
  return (
    <DotLottieReact
      style={{ width: "100px", height: "100px" }}
      src="/load-search.lottie"
      loop
      autoplay
    />
  );
}
