"use client";

import { useState } from "react";
import { Input, InputProps } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = InputProps;

export function PasswordInput(props: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      {...props}
      endContent={
        <button
          className="focus:outline-none"
          tabIndex={-1}
          type="button"
          onClick={() => setIsVisible((v) => !v)}
        >
          {isVisible ? (
            <EyeOff className="text-default-400" size={20} />
          ) : (
            <Eye className="text-default-400" size={20} />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
    />
  );
}
