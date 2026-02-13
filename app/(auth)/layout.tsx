import Image from "next/image";
import { getBanks, getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser();

  if (loggedIn) {
    const banks = await getBanks({ userId: loggedIn.$id });
    redirect(banks?.length ? "/" : "/onboarding");
  }

  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}

      <div className="auth-asset">
        <div>
          <Image
            src="/icons/auth-image.svg"
            width={500}
            height={500}
            alt="Auth Image"
          />
        </div>
      </div>
    </main>
  );
}
