import StudentDashboard from "@/components/dashboard/StudentDashboard";

export const metadata = {
  title: "Student Dashboard",
  description: "Track your piano lessons and practice analytics.",
};

export default function DashboardPage() {
  return <StudentDashboard />;
}
