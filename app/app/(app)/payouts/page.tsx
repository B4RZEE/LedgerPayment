import UpcomingPayoutsCard from "@/components/dashboard/payouts-page/UpcomingPayoutsCard";
import RecentPayoutsCard from "@/components/dashboard/payouts-page/RecentPayoutsCard";

export default function PayoutsPage() {
  return (
    <div className="page-enter">
      <UpcomingPayoutsCard />
      <RecentPayoutsCard />
    </div>
  );
}
