import z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Control, FieldPath } from "react-hook-form";
import { authFormSchema } from "@/lib/utils";

const formScema = authFormSchema("sign-up");

interface CustomInput {
  control: Control<z.infer<typeof formScema>>;
  name: FieldPath<z.infer<typeof formScema>>;
  label: string;
  placeholder: string;
  inputType?: "text" | "email" | "password" | "date" | "number";
  autoComplete?: string;
}

function CustomInput({
  control,
  name,
  label,
  placeholder,
  inputType = "text",
  autoComplete,
}: CustomInput) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = name === "password";
  const type = isPasswordField ? (showPassword ? "text" : "password") : inputType;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <div className="relative">
                <Input
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  className={`input-class ${isPasswordField ? "pr-10" : ""}`}
                  type={type}
                  {...field}
                />

                {isPasswordField && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </FormItem>
      )}
    />
  );
}

export default CustomInput;
