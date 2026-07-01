import ChallengeAnalyticsCard from "@/components/dashboard/analytics-page/ChallengeAnalyticsCard";
import AnalyticsBarChart from "@/components/dashboard/charts/AnalyticsBarChart";
import ExpectedIncomeCard from "@/components/dashboard/analytics-page/ExpectedIncomeCard";
import TradingCostsCard from "@/components/dashboard/analytics-page/TradingCostsCard";

export default function AnalyticsPage() {
  return (
    <div className="page-enter">
      <section className="section">
        <ChallengeAnalyticsCard />
      </section>
      <AnalyticsBarChart />
      <ExpectedIncomeCard />
      <TradingCostsCard />
    </div>
  );
}
