import { useState, useEffect } from "react";
import { Search, User, Calendar, Activity } from "lucide-react";
import { format } from "date-fns";
import api from "../services/Api";

export function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    search: "",
    action: "",
  });

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      //   const data = await MockAPI.getAuditLogs();
      const response = await api.get("/auditLogs");
      const data = response.data.logs.map((log) => ({
        id: log._id,
        userEmail: log.userId?.email || "Unknown",
        entityType: log.expenseId ? "expense" : "unknown",
        entityId: log.expenseId?._id || "",
        action: log.action,
        createdAt: log.timestamp || log.createdAt,
        // If you have oldValues/newValues, add them here
        oldValues: log.oldValues,
        newValues: log.newValues,
      }));
      setLogs(data);
      setLogs(data);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const searchMatch =
      !filter.search ||
      log.userEmail.toLowerCase().includes(filter.search.toLowerCase()) ||
      log.action.toLowerCase().includes(filter.search.toLowerCase()) ||
      log.entityType.toLowerCase().includes(filter.search.toLowerCase());

    const actionMatch =
      !filter.action ||
      log.action.toLowerCase().includes(filter.action.toLowerCase());

    const entityTypeMatch =
      !filter.entity_type ||
      log.entityType.toLowerCase() === filter.entity_type.toLowerCase();

    return searchMatch && actionMatch && entityTypeMatch;
  });

  const getActionColor = (action) => {
    if (action.toLowerCase().includes("create")) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    if (
      action.toLowerCase().includes("update") ||
      action.toLowerCase().includes("status updated")
    )
      if (action.toLowerCase().includes("reject")) {
        return "bg-red-100 text-red-800 border-red-200";
      }
    {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };
  const formatChanges = (oldValues, newValues, action) => {
    if (action === "CREATE") {
      return Object.entries(newValues).map(([key, value]) => (
        <span key={key} className="block">
          <span className="font-medium">{key}:</span> {JSON.stringify(value)}
        </span>
      ));
    }

    if (action === "UPDATE") {
      return Object.entries(newValues)
        .map(([key, value]) => {
          const oldValue = oldValues[key];
          if (oldValue !== value) {
            return (
              <span key={key} className="block">
                <span className="font-medium">{key}:</span>
                <span className="line-through text-red-600 mx-1">
                  {JSON.stringify(oldValue)}
                </span>
                →
                <span className="text-green-600 mx-1">
                  {JSON.stringify(value)}
                </span>
              </span>
            );
          }
          return null;
        })
        .filter(Boolean);
    }

    return null;
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600 mt-1">
          Track all system activities and changes
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search logs..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filter.action}
            onChange={(e) => setFilter({ ...filter, action: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
          </select>

          <select
            value={filter.entity_type}
            onChange={(e) =>
              setFilter({ ...filter, entity_type: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Entities</option>
            <option value="expense">Expense</option>
            {/* <option value="user">User</option> */}
          </select>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Activity className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No logs found
            </h3>
            <p className="mt-1 text-gray-500">
              {logs.length === 0
                ? "No system activities recorded yet."
                : "Try adjusting your search filters."}
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-gray-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium border rounded-full ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                    <span className="text-sm text-gray-600">
                      {log.entityType} #{log.entityId.slice(-8)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{log.userEmail}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(
                            new Date(log.createdAt),
                            "MMM d, yyyy h:mm a"
                          )}
                        </span>
                      </div>
                    </div>

                    {(log.oldValues || log.newValues) && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Changes:
                        </h4>
                        <div className="text-sm text-gray-700 space-y-1">
                          {formatChanges(
                            log.oldValues || {},
                            log.newValues || {},
                            log.action
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
