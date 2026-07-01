import DashboardHeader from "@/components/dashboard/dashboard-page/DashboardHeader";
import KpiStrip from "@/components/dashboard/dashboard-page/KpiStrip";
import PnlCurveChart from "@/components/dashboard/charts/PnlCurveChart";
import HeroCard from "@/components/dashboard/dashboard-page/HeroCard";
import RecentPayoutsPanel from "@/components/dashboard/dashboard-page/RecentPayoutsPanel";
import GoalProgressCards from "@/components/dashboard/dashboard-page/GoalProgressCards";
import FirmsGrid from "@/components/dashboard/dashboard-page/FirmsGrid";

export default function DashboardPage() {
  return (
    <div className="page-enter">
      <DashboardHeader />
      <KpiStrip />
      <PnlCurveChart />
      <div className="ov-main">
        <HeroCard />
        <RecentPayoutsPanel />
      </div>
      <GoalProgressCards />
      <FirmsGrid />
    </div>
  );
}
