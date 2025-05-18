import Link from "next/link";
import React from "react";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  color?: string; // 16進数でも CSS カラー名でもOK
};

export default function Button({
  href,
  children,
  color = "#f62e36",
}: ButtonProps) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-block",
        padding: "8px 12px",
        background: color,
        color: "white",
        borderRadius: 4,
        textDecoration: "none",
        margin: "0 auto",
      }}
    >
      {children}
    </Link>
  );
}
