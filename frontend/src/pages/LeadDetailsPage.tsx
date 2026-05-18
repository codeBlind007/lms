import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Calendar,
  Tag,
  Globe,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLead } from "../hooks/useLead";
import { leadService } from "../services/api/leadService";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";
import { ErrorState } from "../components/ui/States";
import { ConfirmDeleteModal } from "../components/ui/ConfirmDelete";
import { StatusBadge, SourceBadge } from "../components/ui/Badges";
import { formatDate, getErrorMessage } from "../utils";

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-4 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {label}
        </p>
        <div className="mt-1 text-sm text-gray-900">{value}</div>
      </div>
    </div>
  );
}

function isPopulatedCreator(
  createdBy: unknown,
): createdBy is { _id: string; fullName: string; email: string } {
  return (
    createdBy !== null &&
    typeof createdBy === "object" &&
    "fullName" in createdBy &&
    "email" in createdBy
  );
}

export function LeadDetailsPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lead, isLoading, error } = useLead(id);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const createdBy = lead?.createdBy;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await leadService.deleteLead(id);
      toast.success("Lead deleted");
      navigate("/");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft size={14} />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>

      {isLoading ? (
        <Loader message="Loading lead..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : lead ? (
        <>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold text-gray-900">{lead.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">{lead.email}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Pencil size={13} />}
                  onClick={() => navigate(`/leads/${id}/edit`)}
                >
                  Edit
                </Button>
                {isAdmin && (
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 size={13} />}
                    onClick={() => setDeleteOpen(true)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>

            <div className="px-6">
              <DetailRow
                icon={<Mail size={15} />}
                label="Email"
                value={
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-brand-600 hover:underline"
                  >
                    {lead.email}
                  </a>
                }
              />
              <DetailRow
                icon={<Tag size={15} />}
                label="Status"
                value={<StatusBadge status={lead.status} />}
              />
              <DetailRow
                icon={<Globe size={15} />}
                label="Source"
                value={<SourceBadge source={lead.source} />}
              />
              <DetailRow
                icon={<Calendar size={15} />}
                label="Created"
                value={
                  <span className="font-mono text-xs">
                    {formatDate(lead.createdAt)}
                  </span>
                }
              />
              {isPopulatedCreator(createdBy) && (
                <DetailRow
                  icon={<User size={15} />}
                  label="Created By"
                  value={
                    <div className="space-y-0.5">
                      <p className="font-medium text-gray-900">
                        {createdBy.fullName}
                      </p>
                      <a
                        href={`mailto:${createdBy.email}`}
                        className="text-brand-600 hover:underline text-xs"
                      >
                        {createdBy.email}
                      </a>
                    </div>
                  }
                />
              )}
            </div>
          </div>
        </>
      ) : null}

      <ConfirmDeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        leadName={lead?.name ?? ""}
      />
    </div>
  );
}
