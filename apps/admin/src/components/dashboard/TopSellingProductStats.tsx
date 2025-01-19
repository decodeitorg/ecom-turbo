import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const TopSellingProductStats = ({ topSellingProductStats }) => {
  return (
    <Card className="h-full">
      <CardContent>
        <p className="ml-7 mb-3 font-semibold">Top Selling Products</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={topSellingProductStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalPurchased" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopSellingProductStats;
