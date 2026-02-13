"use client";

import {
  PlaidLinkOptions,
  usePlaidLink,
  PlaidLinkOnSuccess,
} from "react-plaid-link";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/user.actions";
import Image from "next/image";
import { Loader2 } from "lucide-react";

function PlaidLink({ user, variant }: PlaidLinkProps) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.linkToken);
    };

    getLinkToken();
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      setIsRedirecting(true);
      try {
        await exchangePublicToken({
          publicToken: public_token,
          user,
        });
        router.push("/");
      } catch (error) {
        console.error("Linking bank failed:", error);
        setIsRedirecting(false);
      }
    },
    [user, router],
  );

  const config: PlaidLinkOptions = {
    onSuccess,
    token,
  };

  const { open, ready } = usePlaidLink(config);
  const isBusy = !ready || isRedirecting;

  return (
    <>
      {variant === "primary" ? (
        <Button
          onClick={() => open()}
          disabled={isBusy}
          className="plaidlink-primary"
        >
          {isRedirecting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            "Connect bank"
          )}
        </Button>
      ) : variant === "ghost" ? (
        <Button
          onClick={() => open()}
          variant="ghost"
          disabled={isBusy}
          className="plaidlink-ghost"
        >
          {isRedirecting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <p className="text-[16px] font-semibold text-black-2">Redirecting...</p>
            </>
          ) : (
            <>
              <Image
                src="/icons/connect-bank.svg"
                width={24}
                height={24}
                alt="Connect Bank"
              />
              <p className="text-[16px] font-semibold text-black-2">Connect bank</p>
            </>
          )}
        </Button>
      ) : variant === "mobile" ? (
        <Button
          onClick={() => open()}
          variant="secondary"
          disabled={isBusy}
          className="plaidlink-mobile"
        >
          {isRedirecting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <p className="text-[16px] font-semibold text-black-2">Redirecting...</p>
            </>
          ) : (
            <>
              <Image
                src="/icons/connect-bank.svg"
                width={24}
                height={24}
                alt="Connect Bank"
              />
              <p className="text-[16px] font-semibold text-black-2">Connect bank</p>
            </>
          )}
        </Button>
      ) : variant === "add-bank" ? (
        <Button
          onClick={() => open()}
          variant="ghost"
          disabled={isBusy}
          className="flex gap-2 p-0 hover:bg-transparent"
        >
          {isRedirecting ? (
            <>
              <Loader2 className="size-4 animate-spin text-gray-600" />
              <h2 className="text-14 font-semibold text-gray-600">Redirecting...</h2>
            </>
          ) : (
            <>
              <Image src="/icons/plus.svg" alt="plus" width={20} height={20} />
              <h2 className="text-14 font-semibold text-gray-600">Add Bank</h2>
            </>
          )}
        </Button>
      ) : (
        <Button onClick={() => open()} disabled={isBusy} className="plaidlink-default">
          {isRedirecting ? (
            <>
              <Loader2 className="size-4 animate-spin text-black-2" />
              <p className="hidden xl:block text-[16px] font-semibold text-black-2">
                Redirecting...
              </p>
            </>
          ) : (
            <>
              <Image
                src="/icons/connect-bank.svg"
                width={24}
                height={24}
                alt="Connect Bank"
              />
              <p className="hidden xl:block text-[16px] font-semibold text-black-2">
                Connect bank
              </p>
            </>
          )}
        </Button>
      )}

      {isRedirecting && (
        <p className="mt-2 text-12 text-gray-500">
          Bank linked successfully. Redirecting you now...
        </p>
      )}
    </>
  );
}

export default PlaidLink;
