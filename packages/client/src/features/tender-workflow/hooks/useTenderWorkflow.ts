// packages/client/src/features/tender-workflow/hooks/useTenderWorkflow.ts

import { useState, useCallback, useMemo, createElement } from "react";
import type { Key } from "react";
import { message, notification } from "antd";
import type {
  Tender as GqlTender,
  TenderStatus as GqlTenderStatus,
} from "@gmss/types";
import type {
  TenderStatus,
  UserRole,
  TenderWorkflowItem,
  TenderDocument,
} from "../types/tender.types";
import {
  STATUS_TRANSITIONS,
  ROLE_CAN_SET_STATUS,
  USER_TABS,
  MD_TABS,
} from "../types/tender.types";
import {
  useSearchTenders,
  useCreateTendersBatch,
  useDeleteTender,
  useChangeTenderStatus,
} from "../services/tenders.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Map a GraphQL Tender to the local Tender shape used by UI components. */
const toLocalTender = (t: GqlTender): import("../types/tender.types").Tender => ({
  id: t.id,
  name: t.name,
  referenceNumber: t.referenceNumber ?? "",
  issuingDepartment: t.issuingDepartment ?? "",
  description: t.description ?? undefined,
  status: t.status as unknown as TenderStatus,
  tags: (t.tags ?? []).map((tt) => ({
    id: tt.tagId,
    name: tt.tag?.name ?? "",
    color: "blue",
  })),
  documents: (t.documents ?? []).map((d) => ({
    id: d.id,
    documentName: d.documentName,
    documentUrl: d.documentUrl,
    createdBy: d.createdBy,
    createdDate: d.createdDate,
  })),
  createdAt: new Date(t.createdDate),
  updatedAt: new Date(t.updatedDate),
  submissionDeadline: t.submissionDeadline ? new Date(t.submissionDeadline) : undefined,
  rejectionReason: t.rejectionReason ?? undefined,
  mailSentAt: t.mailSentAt ? new Date(t.mailSentAt) : undefined,
  createdBy: t.createdBy ?? undefined,
  updatedBy: t.updatedBy ?? undefined,
  drawingRequired: t.drawingRequired ?? undefined,
  strRequired: t.strRequired ?? undefined,
  specificationsRequired: t.specificationsRequired ?? undefined,
  sourcePortal: (t.sourcePortal as string) ?? undefined,
  tenderType: (t.tenderType as string) ?? undefined,
  countdownSilenceReason: t.countdownSilenceReason ?? undefined,
  updatedSubmissionDeadline: t.updatedSubmissionDeadline ?? undefined,
  closingDateChanged: t.closingDateChanged ?? undefined,
});

const generateRefNumber = (): string => {
  const prefix = "TND";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${year}-${random}`;
};

/** Parse date strings from Excel (format: "08/01/2026 11:00") */
const parseDateString = (dateStr: string): string | undefined => {
  try {
    const [datePart, timePart] = dateStr.split(" ");
    if (!datePart) return undefined;
    const [day, month, year] = datePart.split("/");
    if (!day || !month || !year) return undefined;
    const [hours = "0", minutes = "0"] = (timePart || "").split(":");
    const d = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
    );
    return d.toISOString();
  } catch {
    return undefined;
  }
};

// ─── Local UI state (not persisted) ───────────────────────────────────────────

interface LocalUIState {
  previewData: TenderWorkflowItem[];
  selectedPreviewKeys: Key[];
  activeDrawerTender: import("../types/tender.types").Tender | null;
  isDrawerOpen: boolean;
  isAddingToDraft: boolean;
}

// ─── Public return type ───────────────────────────────────────────────────────

export interface UseTenderWorkflowReturn {
  // State
  state: {
    tenders: import("../types/tender.types").Tender[];
    previewData: TenderWorkflowItem[];
    selectedPreviewKeys: Key[];
    isLoading: boolean;
    isAddingToDraft: boolean;
    activeDrawerTender: import("../types/tender.types").Tender | null;
    isDrawerOpen: boolean;
  };
  role: UserRole;
  activeTab: string;

  // Role management
  setRole: (role: UserRole) => void;
  setActiveTab: (tab: string) => void;

  // Excel operations
  parseExcelData: (data: TenderWorkflowItem[]) => void;
  clearPreviewData: () => void;
  setSelectedPreviewKeys: (keys: Key[]) => void;
  addSelectedToDraft: () => Promise<void>;

  // Tender CRUD
  deleteTender: (id: string) => void;
  sendToMd: (ids: string[]) => void;
  resubmitRejected: (id: string) => void;

  // MD operations
  openTaggingDrawer: (tender: import("../types/tender.types").Tender) => void;
  closeTaggingDrawer: () => void;
  mdConfirm: (tenderId: string, tagIds: string[]) => Promise<void>;
  mdReject: (tenderId: string, reason: string) => void;
  mdApprove: (tenderId: string) => void;
  verifyNit: (tenderId: string) => void;

  // Document operations
  uploadNit: (tenderId: string, document: Omit<TenderDocument, "id">) => void;
  uploadDocuments: (tenderId: string, documents: Omit<TenderDocument, "id">[]) => void;

  // Mail operations
  markReadyToMail: (tenderId: string) => void;
  sendMail: (tenderId: string) => void;
  sendMailBulk: (ids: string[]) => void;
  mdBulkApprove: (ids: string[]) => void;

  // Validation helpers
  validateTransition: (currentStatus: TenderStatus, nextStatus: TenderStatus, userRole: UserRole) => boolean;
  canPerformAction: (action: string, tender: import("../types/tender.types").Tender) => boolean;

  // Data accessors
  getTendersByTab: (tabKey: string) => import("../types/tender.types").Tender[];
  getTabCounts: () => Record<string, number>;
  getCurrentTabs: () => typeof USER_TABS;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTenderWorkflow(): UseTenderWorkflowReturn {
  const [role, setRoleState] = useState<UserRole>("USER");
  // Default active tab: users see NIT Pending, MDs see Pending Approval
  const [activeTab, setActiveTab] = useState<string>("nitPending");

  const setRole = (r: UserRole) => {
    setRoleState(r);
    if (r === "MD") setActiveTab("pendingApproval");
    else setActiveTab("nitPending");
  };

  const [ui, setUi] = useState<LocalUIState>({
    previewData: [],
    selectedPreviewKeys: [],
    activeDrawerTender: null,
    isDrawerOpen: false,
    isAddingToDraft: false,
  });

  // ─── GraphQL ────────────────────────────────────────────────────────────────

  const { data, loading, refetch } = useSearchTenders();
  const [createTendersBatchMut] = useCreateTendersBatch();
  const [deleteTenderMut] = useDeleteTender();
  const [changeStatusMut] = useChangeTenderStatus();

  // Map GQL tenders → local shape (includes all tenders, even overdue)
  const tenders = useMemo(
    () => (data?.searchTendersAdvanced ?? []).map(toLocalTender),
    [data],
  );

  // ─── Validation ─────────────────────────────────────────────────────────────

  const validateTransition = useCallback(
    (currentStatus: TenderStatus, nextStatus: TenderStatus, userRole: UserRole): boolean => {
      const allowedNextStatuses = STATUS_TRANSITIONS[currentStatus];
      const roleCanSetStatuses = ROLE_CAN_SET_STATUS[userRole];
      return allowedNextStatuses.includes(nextStatus) && roleCanSetStatuses.includes(nextStatus);
    },
    [],
  );

  const canPerformAction = useCallback(
    (action: string, tender: import("../types/tender.types").Tender): boolean => {
      // Block upload actions on expired tenders (past submission deadline)
      const isExpired = tender.submissionDeadline && new Date(tender.submissionDeadline).getTime() < Date.now();
      if (isExpired && (action === "uploadNit" || action === "uploadDocuments")) {
        return false;
      }
      switch (action) {
        case "delete":
          return role === "USER";
        case "sendToMd":
          return tender.status === "DRAFT" && role === "USER";
        case "resubmit":
          return tender.status === "REJECTED" && role === "USER";
        case "mdConfirm":
        case "mdReject":
          return tender.status === "PENDING_MD_TAGGING" && role === "MD";
        case "uploadNit":
          // Allow upload when MD has tagged or explicitly approved for NIT upload
          return (tender.status === "MD_TAGGED" || tender.status === "READY_FOR_NIT") && role === "USER";
        case "verifyNit":
          return tender.status === "NIT_UPLOADED" && role === "MD";
        case "uploadDocuments":
          return tender.status === "NIT_VERIFIED" && role === "USER";
        case "markReadyToMail":
          return tender.status === "DOCS_UPLOADED" && role === "USER";
        case "sendMail":
          return tender.status === "READY_TO_MAIL" && role === "USER";
        default:
          return false;
      }
    },
    [role],
  );

  // ─── Mutation helpers (fire-and-forget with refetch) ────────────────────────

  const changeStatus = useCallback(
    async (tenderId: string, status: TenderStatus, extra?: { rejectionReason?: string; tagIds?: string[] }) => {
      try {
        await changeStatusMut({
          variables: {
            input: {
              tenderId,
              status: status as unknown as GqlTenderStatus,
              rejectionReason: extra?.rejectionReason,
              tagIds: extra?.tagIds,
            },
          },
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Status change failed";
        message.error(msg);
      }
    },
    [changeStatusMut],
  );

  // ─── Excel operations ──────────────────────────────────────────────────────

  const parseExcelData = useCallback((items: TenderWorkflowItem[]) => {
    setUi((prev) => ({ ...prev, previewData: items, selectedPreviewKeys: [] }));
  }, []);

  const clearPreviewData = useCallback(() => {
    setUi((prev) => ({ ...prev, previewData: [], selectedPreviewKeys: [] }));
  }, []);

  const setSelectedPreviewKeys = useCallback((keys: Key[]) => {
    setUi((prev) => ({ ...prev, selectedPreviewKeys: keys }));
  }, []);

  const addSelectedToDraft = useCallback(async () => {
    const selectedRows = ui.previewData.filter((row) =>
      ui.selectedPreviewKeys.includes(row.id),
    );

    if (selectedRows.length === 0) return;

    setUi((prev) => ({ ...prev, isAddingToDraft: true }));

    const inputs = selectedRows.map((row) => ({
      name: row.tenderTitle,
      referenceNumber: row.tenderNo || generateRefNumber(),
      issuingDepartment: row.department,
      description: `Opening: ${row.openingDateTime} | Due: ${row.dueDateTime} (${row.dueDays} days)`,
      submissionDeadline:
        row.dueDateTime !== "NOT OPENED" && row.dueDateTime
          ? parseDateString(row.dueDateTime)
          : undefined,
    }));

    try {
      const result = await createTendersBatchMut({ variables: { inputs } });
      const { created = [], skipped = [] } = result.data?.createTendersBatch ?? {};

      if (created.length > 0) {
        // Send created tenders directly to MD (skip draft)
        // Process in batches of 10 to avoid overwhelming the server
        const createdIds = created.map((c: any) => c.id).filter(Boolean) as string[];
        const BATCH_SIZE = 10;
        for (let i = 0; i < createdIds.length; i += BATCH_SIZE) {
          const batch = createdIds.slice(i, i + BATCH_SIZE);
          await Promise.all(
            batch.map((id) =>
              changeStatusMut({
                variables: {
                  input: { tenderId: id, status: 'PENDING_MD_TAGGING' as unknown as GqlTenderStatus },
                },
              })
            )
          );
        }

        notification.success({
          message: `${created.length} tender${created.length > 1 ? 's' : ''} sent to MD`,
          placement: 'topRight',
          duration: 4,
        });
      }

      if (skipped.length > 0) {
        const descriptionNode = createElement(
          'ul',
          { style: { margin: 0, paddingLeft: 16 } },
          ...skipped.map((s, i) =>
            createElement(
              'li',
              { key: i },
              createElement('strong', null, s.name),
              s.referenceNumber ? ` (${s.referenceNumber})` : '',
              ' \u2014 ',
              s.reason,
            ),
          ),
        );
        notification.warning({
          message: `${skipped.length} duplicate${skipped.length > 1 ? 's' : ''} skipped`,
          description: descriptionNode,
          placement: 'topRight',
          duration: 8,
        });
      }

      if (created.length === 0 && skipped.length === 0) {
        message.info('No tenders were processed.');
      }

      void refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add tenders to draft';
      message.error(msg);
    } finally {
      setUi((prev) => ({ ...prev, previewData: [], selectedPreviewKeys: [], isAddingToDraft: false }));
    }
  }, [ui.previewData, ui.selectedPreviewKeys, createTendersBatchMut, refetch]);

  // ─── Tender CRUD ───────────────────────────────────────────────────────────

  const deleteTender = useCallback(
    (id: string) => {
      void deleteTenderMut({ variables: { id } })
        .then(() => refetch())
        .catch((err: unknown) => {
          const msg = err instanceof Error ? err.message : "Delete failed";
          message.error(msg);
        });
    },
    [deleteTenderMut, refetch],
  );

  const sendToMd = useCallback(
    async (ids: string[]) => {
      await Promise.all(ids.map((id) => changeStatus(id, "PENDING_MD_TAGGING")));
      void refetch();
    },
    [changeStatus, refetch],
  );

  const resubmitRejected = useCallback(
    async (id: string) => {
      await changeStatus(id, "PENDING_MD_TAGGING");
      void refetch();
    },
    [changeStatus, refetch],
  );

  // ─── MD operations ─────────────────────────────────────────────────────────

  const openTaggingDrawer = useCallback((tender: import("../types/tender.types").Tender) => {
    setUi((prev) => ({ ...prev, activeDrawerTender: tender, isDrawerOpen: true }));
  }, []);

  const closeTaggingDrawer = useCallback(() => {
    setUi((prev) => ({ ...prev, activeDrawerTender: null, isDrawerOpen: false }));
  }, []);

  const mdConfirm = useCallback(
    async (tenderId: string, tagIds: string[]): Promise<void> => {
      // When reviewing NIT (NIT_UPLOADED), verify + tag in one step
      const targetStatus: TenderStatus =
        ui.activeDrawerTender?.status === "NIT_UPLOADED" ? "NIT_VERIFIED" : "MD_TAGGED";
      await changeStatus(tenderId, targetStatus, { tagIds });
      closeTaggingDrawer();
      void refetch();
    },
    [changeStatus, closeTaggingDrawer, refetch, ui.activeDrawerTender],
  );

  const mdApprove = useCallback(
    (tenderId: string) => {
      void changeStatus(tenderId, "READY_FOR_NIT");
      void refetch();
    },
    [changeStatus, refetch],
  );

  const mdReject = useCallback(
    (tenderId: string, reason: string) => {
      // From NIT_UPLOADED, REJECTED is not valid — send back to PENDING_MD_TAGGING instead
      if (ui.activeDrawerTender?.status === "NIT_UPLOADED") {
        void changeStatus(tenderId, "PENDING_MD_TAGGING");
      } else {
        void changeStatus(tenderId, "REJECTED", { rejectionReason: reason });
      }
      closeTaggingDrawer();
    },
    [changeStatus, closeTaggingDrawer, ui.activeDrawerTender],
  );

  const verifyNit = useCallback(
    (tenderId: string) => {
      void changeStatus(tenderId, "NIT_VERIFIED");
    },
    [changeStatus],
  );

  // ─── Document operations (status change only — actual upload is S3/Step 6) ─

  const uploadNit = useCallback(
    (tenderId: string, _document: Omit<TenderDocument, "id">) => {
      // TODO: S3 upload integration (Step 6) — for now just transition status
      void changeStatus(tenderId, "NIT_UPLOADED");
    },
    [changeStatus],
  );

  const uploadDocuments = useCallback(
    (tenderId: string, _documents: Omit<TenderDocument, "id">[]) => {
      // Skip DOCS_UPLOADED intermediate step — go straight to READY_TO_MAIL
      void changeStatus(tenderId, "READY_TO_MAIL");
    },
    [changeStatus],
  );

  // ─── Mail operations ───────────────────────────────────────────────────────

  const markReadyToMail = useCallback(
    async (tenderId: string) => {
      await changeStatus(tenderId, "READY_TO_MAIL");
      void refetch();
    },
    [changeStatus, refetch],
  );

  const sendMail = useCallback(
    async (tenderId: string) => {
      try {
        await changeStatusMut({
          variables: {
            input: {
              tenderId,
              status: 'MAIL_SENT' as unknown as GqlTenderStatus,
            },
          },
        });
        void refetch();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to send mail";
        message.error(`Mail sending failed: ${msg}`);
      }
    },
    [changeStatusMut, refetch],
  );

  const sendMailBulk = useCallback(
    async (ids: string[]) => {
      const results = await Promise.allSettled(
        ids.map((id) =>
          changeStatusMut({
            variables: {
              input: {
                tenderId: id,
                status: 'MAIL_SENT' as unknown as GqlTenderStatus,
              },
            },
          })
        )
      );
      const failed = results.filter((r) => r.status === 'rejected');
      if (failed.length > 0) {
        message.error(`${failed.length} mail(s) failed to send. Check tender details.`);
      } else {
        message.success(`${ids.length} mail(s) sent successfully.`);
      }
      void refetch();
    },
    [changeStatusMut, refetch],
  );

  const mdBulkApprove = useCallback(
    async (ids: string[]) => {
      await Promise.all(ids.map((id) => changeStatus(id, "READY_FOR_NIT")));
      void refetch();
    },
    [changeStatus, refetch],
  );

  // ─── Data accessors ────────────────────────────────────────────────────────

  const getTendersByTab = useCallback(
    (tabKey: string) => {
      const tabList = role === "USER" ? USER_TABS : MD_TABS;
      const tabConfig = tabList.find((t) => t.key === tabKey);
      if (!tabConfig) return [];
      return tenders.filter((t) => tabConfig.statuses.includes(t.status));
    },
    [tenders, role],
  );

  const getTabCounts = useMemo(() => {
    return (): Record<string, number> => {
      const tabList = role === "USER" ? USER_TABS : MD_TABS;
      const counts: Record<string, number> = {};
      tabList.forEach((tab) => {
        counts[tab.key] = tenders.filter((t) => tab.statuses.includes(t.status)).length;
      });
      return counts;
    };
  }, [tenders, role]);

  const getCurrentTabs = useCallback(() => {
    return role === "USER" ? USER_TABS : MD_TABS;
  }, [role]);

  // ─── Composed state (matches previous shape for page compatibility) ─────────

  const state = useMemo(
    () => ({
      tenders,
      previewData: ui.previewData,
      selectedPreviewKeys: ui.selectedPreviewKeys,
      isLoading: loading,
      isAddingToDraft: ui.isAddingToDraft,
      activeDrawerTender: ui.activeDrawerTender,
      isDrawerOpen: ui.isDrawerOpen,
    }),
    [tenders, ui, loading],
  );

  return {
    state,
    role,
    activeTab,
    setRole,
    setActiveTab,
    parseExcelData,
    clearPreviewData,
    setSelectedPreviewKeys,
    addSelectedToDraft,
    deleteTender,
    sendToMd,
    resubmitRejected,
    openTaggingDrawer,
    closeTaggingDrawer,
    mdConfirm,
    mdReject,
    mdApprove,
    verifyNit,
    uploadNit,
    uploadDocuments,
    markReadyToMail,
    sendMail,
    sendMailBulk,
    mdBulkApprove,
    validateTransition,
    canPerformAction,
    getTendersByTab,
    getTabCounts,
    getCurrentTabs,
  };
}