import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, DollarSign, Users, Calendar } from "lucide-react";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import api from "../services/Api";
import { useAuth } from "../hooks/useAuth";

export function Dashboard() {
  const [stats, setStats] = useState({
    totalExpenses: 0,
    pendingExpenses: 0,
    totalUsers: 0,
    monthlyGrowth: 0,
  });

  const { user } = useAuth();

  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);

  const fetchMonthlyExpenses = async () => {
    try {
      const response = await api.get("/expenses/monthly");
      const monthlyExpenses = response.data.expenses;
      console.log(monthlyExpenses);
      setMonthlyData(monthlyExpenses);
    } catch (error) {
      console.error("Error fetching monthly expenses:", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await api.get("/user/all");
      const users = response.data.users;
      setStats((prevStats) => ({
        ...prevStats,
        totalUsers: users.length,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchAllUsers();
  }, []);

  // const expenses = [
  //   {
  //     id: 1,
  //     amount: 150.75,
  //     category: { id: 1, name: "Food" },
  //     status: "pending",
  //     createdAt: new Date(),
  //   },
  //   {
  //     id: 2,
  //     amount: 200.0,
  //     category: { id: 2, name: "Entertainment" },
  //     status: "approved",
  //     createdAt: new Date(),
  //   },
  // ];
  // mock expense data new object

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/expenses/all");
      const expenses = response.data.expenses;

      // Exclude rejected expenses
      const filteredExpenses = expenses.filter((e) => e.status !== "rejected");

      setExpenses(filteredExpenses);
      if (!filteredExpenses || filteredExpenses.length === 0) {
        setLoading(false);
        return;
      }

      const totalExpenses = filteredExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      const pendingExpenses = filteredExpenses.filter(
        (e) => e.status === "pending"
      ).length;

      // Calculate monthly growth (simplified mock calculation)
      const currentMonth = new Date();
      const lastMonth = subMonths(currentMonth, 1);

      const currentMonthExpenses = filteredExpenses.filter(
        (e) =>
          new Date(e.createdAt) >= startOfMonth(currentMonth) &&
          new Date(e.createdAt) <= endOfMonth(currentMonth)
      );

      const lastMonthExpenses = filteredExpenses.filter(
        (e) =>
          new Date(e.createdAt) >= startOfMonth(lastMonth) &&
          new Date(e.createdAt) <= endOfMonth(lastMonth)
      );

      const currentTotal = currentMonthExpenses.reduce(
        (sum, e) => sum + e.amount,
        0
      );
      const lastTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
      const monthlyGrowth =
        lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 15.3;

      setStats((prevStats) => ({
        ...prevStats,
        totalExpenses,
        pendingExpenses,
        monthlyGrowth,
      }));

      // Category data
      const categoryMap = new Map();
      filteredExpenses.forEach((expense) => {
        const categoryName = expense.category;
        categoryMap.set(
          categoryName,
          (categoryMap.get(categoryName) || 0) + expense.amount
        );
      });

      setCategoryData(
        Array.from(categoryMap.entries()).map(([name, total]) => ({
          name,
          total,
        }))
      );

      fetchMonthlyExpenses();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of expense tracking and analytics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{stats.totalExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pending Review
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pendingExpenses}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Monthly Growth
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.monthlyGrowth > 0 ? "+" : ""}
                {stats.monthlyGrowth.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expenses by Category
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toFixed(2)}`,
                    "Amount",
                  ]}
                />
                <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Expenses Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toFixed(2)}`,
                    "Amount",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Distribution Pie Chart */}
      {categoryData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Category Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toFixed(2)}`,
                    "Amount",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
