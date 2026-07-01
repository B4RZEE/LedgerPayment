import PerformanceStatsGrid from "@/components/dashboard/stats-page/PerformanceStatsGrid";
import FirmComparisonCard from "@/components/dashboard/stats-page/FirmComparisonCard";
import FirmCurvesGrid from "@/components/dashboard/stats-page/FirmCurvesGrid";
import FirmLeaderboardCard from "@/components/dashboard/stats-page/FirmLeaderboardCard";

export default function StatsPage() {
  return (
    <div className="page-enter">
      <PerformanceStatsGrid />
      <FirmComparisonCard />
      <FirmCurvesGrid />
      <FirmLeaderboardCard />
    </div>
  );
}
