"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

import { cn, formUrlQuery } from "@/lib/utils";

export const BankTabItem = ({ account, appwriteItemId }: BankTabItemProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isActive = appwriteItemId === account?.appwriteItemId;

  const handleBankChange = () => {
    if (isPending || isActive) return;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: account?.appwriteItemId,
    });

    startTransition(() => {
      router.push(newUrl, { scroll: false });
    });
  };

  return (
    <div
      onClick={handleBankChange}
      className={cn("banktab-item", {
        "border-blue-600": isActive,
        "opacity-70": isPending,
      })}
    >
      <p
        className={cn("text-16 line-clamp-1 flex-1 font-medium text-gray-500", {
          "text-blue-600": isActive,
        })}
      >
        {account.name}
      </p>

      {isPending && <Loader2 className="size-4 animate-spin text-blue-600" />}
    </div>
  );
};