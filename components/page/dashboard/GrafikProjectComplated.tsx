import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const completedProjects = [
  { month: "Jan", total: 8 },
  { month: "Feb", total: 15 },
  { month: "Mar", total: 12 },
  { month: "Apr", total: 18 },
  { month: "May", total: 22 },
  { month: "Jun", total: 25 },
];

export default function CompletedProjectsChart() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>📊 Completed Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={completedProjects}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#4F46E5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
