import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download } from "lucide-react";
import toast from "react-hot-toast";
import { useLeads } from "../hooks/useLeads";
import { useDebounce } from "../hooks/useDebounce";
import { useAuth } from "../context/AuthContext";
import { leadService } from "../services/api/leadService";
import { Button } from "../components/ui/Button";
import { SearchBar } from "../components/ui/SearchBar";
import { Select } from "../components/ui/Select";
import { Pagination } from "../components/ui/Pagination";
import { LeadTable } from "../components/leads/LeadTable";
import { LeadCard } from "../components/leads/LeadCard";
import { ConfirmDeleteModal } from "../components/ui/ConfirmDelete";
import { TableSkeleton } from "../components/ui/Loader";
import { EmptyState, ErrorState } from "../components/ui/States";
import { LEAD_STATUSES, LEAD_SOURCES } from "../constants";
import { exportToCSV, getErrorMessage } from "../utils";
import type { Lead, LeadFilters } from "../types";

const statusOptions = [
  { value: "", label: "All Statuses" },
  ...LEAD_STATUSES.map((s) => ({ value: s, label: s })),
];

const sourceOptions = [
  { value: "", label: "All Sources" },
  ...LEAD_SOURCES.map((s) => ({ value: s, label: s })),
];

const sortOptions = [
  { value: "latest", label: "Latest first" },
  { value: "oldest", label: "Oldest first" },
];

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  const [filters, setFilters] = useState<Omit<LeadFilters, "search">>({
    page: 1,
    status: "",
    source: "",
    sort: "latest",
  });

  const {
    leads,
    isLoading,
    error,
    totalPages,
    totalLeads,
    currentPage,
    refetch,
  } = useLeads({
    ...filters,
    search: debouncedSearch,
  });

  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateFilter = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : (value as number),
    }));
  };

  const handleDelete = async () => {
    if (!deletingLead) return;
    setIsDeleting(true);
    try {
      await leadService.deleteLead(deletingLead._id);
      toast.success("Lead deleted");
      setDeletingLead(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    if (leads.length === 0) {
      toast.error("No leads to export");
      return;
    }
    exportToCSV(leads);
    toast.success(`Exported ${leads.length} leads`);
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalLeads > 0
              ? `${totalLeads} total leads`
              : "Manage your pipeline"}
          </p>
        </div>
        <Button
          leftIcon={<Plus size={15} />}
          onClick={() => navigate("/leads/create")}
        >
          New Lead
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search by name or email..."
          />
          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <Select
              options={statusOptions}
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="min-w-32.5"
            />
            <Select
              options={sourceOptions}
              value={filters.source}
              onChange={(e) => updateFilter("source", e.target.value)}
              className="min-w-32.5"
            />
            <Select
              options={sortOptions}
              value={filters.sort}
              onChange={(e) =>
                updateFilter("sort", e.target.value as "latest" | "oldest")
              }
              className="min-w-32.5"
            />
            <Button
              variant="secondary"
              leftIcon={<Download size={14} />}
              onClick={handleExport}
              size="md"
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : leads.length === 0 ? (
          <EmptyState
            action={{
              label: "Create first lead",
              onClick: () => navigate("/leads/create"),
            }}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <LeadTable
                leads={leads}
                isAdmin={isAdmin}
                onDeleteClick={setDeletingLead}
              />
            </div>

            {/* Mobile cards */}
            <div className="md:hidden p-4 space-y-3">
              {leads.map((lead) => (
                <LeadCard
                  key={lead._id}
                  lead={lead}
                  isAdmin={isAdmin}
                  onDeleteClick={setDeletingLead}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !error && leads.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalLeads={totalLeads}
          onPageChange={(p) => updateFilter("page", p)}
        />
      )}

      {/* Delete modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        leadName={deletingLead?.name ?? ""}
      />
    </div>
  );
}
