"use client";

import { useEffect, useState } from "react";
import { LineShadowText } from "../magicui/line-shadow-text";
import { useTheme } from "next-themes";

interface LogoProps {
  height?: string;
  width?: string;
}

const Logo: React.FC<LogoProps> = ({ height = "text-6xl", width = "w-auto" }) => {
  const { resolvedTheme } = useTheme();
  const [shadowColor, setShadowColor] = useState("black"); // Default to black

  // ✅ Set shadowColor in useEffect to avoid SSR mismatch
  useEffect(() => {
    if (resolvedTheme) {
      setShadowColor(resolvedTheme === "dark" ? "white" : "black");
    }
  }, [resolvedTheme]);

  return (
    <h1 className={`font-semibold leading-none tracking-tighter ${height} ${width}`}>
      Edu
      <LineShadowText className="italic" shadowColor={shadowColor}>
        Blueprint
      </LineShadowText>
    </h1>
  );
};

export default Logo;
