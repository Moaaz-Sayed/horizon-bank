import HeaderBox from "@/components/HeaderBox";
import RightSidbar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";

function Home() {
  const loggedIn = {
    firstName: "Maria",
    lastName: "Moaaz",
    email: "mary@gmail.com",
  };

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome,"
            user={loggedIn?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently"
          />

          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250.35}
          />
        </header>
        RECENT TRANSACTIONS
      </div>

      <RightSidbar
        user={loggedIn}
        transactions={[]}
        banks={[{ currentBalance: "1250.35" }, { currentBalance: "500.28" }]}
      />
    </section>
  );
}

export default Home;
