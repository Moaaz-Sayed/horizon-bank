import HeaderBox from "@/components/HeaderBox";
import PlaidLink from "@/components/PlaidLink";
import { Button } from "@/components/ui/button";
import { getBanks, getLoggedInUser } from "@/lib/actions/user.actions";
import { logoutAccount } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Onboarding() {
  async function handleLogout() {
    "use server";
    await logoutAccount();
    redirect("/sign-in");
  }

  const loggedIn = await getLoggedInUser();

  if (!loggedIn) redirect("/sign-in");

  const banks = await getBanks({ userId: loggedIn.$id });
  const hasLinkedBank = Boolean(banks?.length);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-25 px-6 py-10">
      <section className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Image
            src="/icons/logo.svg"
            width={28}
            height={28}
            alt="Horizon Logo"
          />
          <h1 className="text-20 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </div>

        <HeaderBox
          title={hasLinkedBank ? "Link Your Banks" : "Link Your First Bank"}
          subtext={
            hasLinkedBank
              ? ""
              : "Before using Horizon, connect at least one bank account."
          }
        />

        <div className="mt-6 flex flex-col gap-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <h3 className="text-16 font-semibold text-blue-900">
              Sandbox setup guide
            </h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-14 text-blue-900/90">
              <li>
                After clicking Connect bank, choose Continue without phone
                number.
              </li>
              <li>Select any bank.</li>
              <li>Enter any username and password.</li>
              <li>On the verification page, click Get code.</li>
              <li>Enter any 5-digit code.</li>
              <li>
                Prefer linking the first bank now, then repeat later for a
                second bank so you can transfer money between them.
              </li>
              <li>
                Complete the remaining steps, then click Finish without saving.
              </li>
            </ol>
          </div>

          <p className="text-14 text-gray-600">
            Securely connect your bank using Plaid to start managing balances
            and transactions.
          </p>
          <PlaidLink user={loggedIn} variant="primary" />
          {hasLinkedBank ? (
            <Button asChild type="button" variant="outline" className="w-full">
              <Link href="/">Home page</Link>
            </Button>
          ) : (
            <form action={handleLogout}>
              <Button type="submit" variant="outline" className="w-full">
                Log out
              </Button>
            </form>
          )}
          {!hasLinkedBank && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-14 text-amber-900">
                If you don&apos;t want to connect a bank now, you can log out
                and try this ready account:
              </p>
              <p className="mt-2 text-14 font-semibold text-amber-900">
                Email: hr@test.com
              </p>
              <p className="text-14 font-semibold text-amber-900">
                Password: 123456789
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Onboarding;
