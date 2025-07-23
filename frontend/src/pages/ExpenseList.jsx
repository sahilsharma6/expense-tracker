import { useState, useEffect } from "react";
import { Plus, Filter, Search, Calendar, DollarSign } from "lucide-react";
import { ExpenseForm } from "./ExpenseForm";
import { format } from "date-fns";
import api from "../services/Api";
import { useAuth } from "../hooks/useAuth";

export function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({
    status: "",
    category: "",
    search: "",
  });
  const { user } = useAuth();

  //   const user = "admin"; // Mock user role for testing

  //   const user = { role: "admin" }; // Mock user role for testing
  // const user = { role: "employee" }; // Mock user role for testing

  const categoriesData = [
    { id: 1, name: "Food" },
    { id: 2, name: "Entertainment" },
    { id: 3, name: "Travel" },
    { id: 4, name: "Transportation" },
    { id: 5, name: "Utilities" },
    { id: 6, name: "Rent" },
    { id: 7, name: "Health & Medical" },
    { id: 8, name: "Office Supplies" },
    { id: 9, name: "Taxes" },
    { id: 10, name: "Miscellaneous" },
  ];

  useEffect(() => {
    fetchExpenses();
    setCategories(categoriesData);
  }, []);

  // const expensesData = [
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
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      if (user?.role != "admin") {
        const response = await api.get("/expenses", {
          headers: {},
        });
        const data = response.data.expenses;
        setExpenses(data);
      } else {
        console.log(user);
        const allExpensesResponse = await api.get("/expenses/all", {
          headers: {},
        });
        console.log(allExpensesResponse.data.expenses);
        setExpenses(allExpensesResponse.data.expenses);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateExpenseStatus = async (expenseId, status) => {
    try {
      const response = await api.put(`/expenses/${expenseId}/status`, {
        status,
      });
      console.log("Expense status updated:", response.data);
      const updatedExpenses = expenses.map((expense) => {
        if (expense.id === expenseId) {
          return { ...expense, status };
        }
        return expense;
      });
      setExpenses(updatedExpenses);
      if (user.role === "admin") {
        // Optionally, you can show a success message or notification
        console.log(`Expense ${expenseId} status updated to ${status}`);
      }

      fetchExpenses();
    } catch (error) {
      console.error("Error updating expense status:", error);
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    return (
      (!filter.status || expense.status === filter.status) &&
      (!filter.category || expense.category === filter.category) &&
      (!filter.search ||
        expense.notes?.toLowerCase().includes(filter.search.toLowerCase()) ||
        expense.category?.toLowerCase().includes(filter.search.toLowerCase()) ||
        expense.user.email?.toLowerCase().includes(filter.search.toLowerCase()))
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === "admin" ? "All Expenses" : "My Expenses"}
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage expense submissions
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses */}
      <div className="space-y-4">
        {filteredExpenses?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No expenses found
            </h3>
            <p className="mt-1 text-gray-500">
              {expenses.length === 0
                ? "Get started by adding your first expense."
                : "Try adjusting your search filters."}
            </p>
          </div>
        ) : (
          filteredExpenses?.map((expense) => (
            <div
              key={expense.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        ₹{expense.amount.toFixed(2)}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium border rounded-full ${getStatusColor(
                          expense.status
                        )}`}
                      >
                        {expense.status}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1">
                      <p className="text-gray-600">
                        <span className="font-medium">Category:</span>{" "}
                        {expense.category}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Date:</span>{" "}
                        {format(new Date(expense.createdAt), "MMM d, yyyy")}
                      </p>
                      {user?.role === "admin" && (
                        <p className="text-gray-600">
                          <span className="font-medium">Employee:</span>{" "}
                          {expense?.user?.email}
                        </p>
                      )}
                      {expense.notes && (
                        <p className="text-gray-600">
                          <span className="font-medium">Notes:</span>{" "}
                          {expense.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {user?.role === "admin" && expense.status === "pending" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        updateExpenseStatus(expense._id, "approved")
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        updateExpenseStatus(expense._id, "rejected")
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <ExpenseForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchExpenses();
          }}
          categories={categories}
        />
      )}
    </div>
  );
}
