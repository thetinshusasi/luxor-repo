import { Suspense } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingSpinner message="Loading dashboard..." />}>
        <DashboardClient />
      </Suspense>
    </ProtectedRoute>
  );
}
