// packages/client/src/features/tender-workflow/hooks/useTenderWorkflow.ts

import { useState, useCallback, useMemo } from "react";
import type { Key } from "react";
import type {
  Tender,
  TenderStatus,
  UserRole,
  TenderWorkflowItem,
  TenderTag,
  TenderDocument,
  TenderWorkflowState,
} from "../types/tender.types";
import {  STATUS_TRANSITIONS,
  ROLE_CAN_SET_STATUS,
  AVAILABLE_TAGS,
  USER_TABS,
  MD_TABS,} from "../types/tender.types";

// Utility functions
const generateId = (): string => {
  return `tender-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

const generateRefNumber = (): string => {
  const prefix = "TND";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${year}-${random}`;
};

// Initial state - no dummy data
const createInitialTenders = (): Tender[] => [];

export interface UseTenderWorkflowReturn {
  // State
  state: TenderWorkflowState;
  role: UserRole;
  activeTab: string;

  // Role management
  setRole: (role: UserRole) => void;
  setActiveTab: (tab: string) => void;

  // Excel operations
  parseExcelData: (data: TenderWorkflowItem[]) => void;
  clearPreviewData: () => void;
  setSelectedPreviewKeys: (keys: Key[]) => void;
  addSelectedToDraft: () => void;

  // Tender CRUD
  deleteTender: (id: string) => void;
  sendToMd: (ids: string[]) => void;
  resubmitRejected: (id: string) => void;

  // MD operations
  openTaggingDrawer: (tender: Tender) => void;
  closeTaggingDrawer: () => void;
  mdConfirm: (tenderId: string, tagIds: string[]) => void;
  mdReject: (tenderId: string, reason: string) => void;
  verifyNit: (tenderId: string) => void;

  // Document operations
  uploadNit: (tenderId: string, document: Omit<TenderDocument, "id">) => void;
  uploadDocuments: (tenderId: string, documents: Omit<TenderDocument, "id">[]) => void;

  // Mail operations
  markReadyToMail: (tenderId: string) => void;
  sendMail: (tenderId: string) => void;
  sendMailBulk: (ids: string[]) => void;

  // Validation helpers
  validateTransition: (currentStatus: TenderStatus, nextStatus: TenderStatus, userRole: UserRole) => boolean;
  canPerformAction: (action: string, tender: Tender) => boolean;

  // Data accessors
  getTendersByTab: (tabKey: string) => Tender[];
  getTabCounts: () => Record<string, number>;
  getAvailableTags: () => TenderTag[];
  getCurrentTabs: () => typeof USER_TABS;
}

export function useTenderWorkflow(): UseTenderWorkflowReturn {
  const [role, setRole] = useState<UserRole>("USER");
  const [activeTab, setActiveTab] = useState<string>("draft");
  
  const [state, setState] = useState<TenderWorkflowState>({
    tenders: createInitialTenders(),
    previewData: [],
    selectedPreviewKeys: [],
    isLoading: false,
    activeDrawerTender: null,
    isDrawerOpen: false,
  });

  // Validate status transition
  const validateTransition = useCallback(
    (currentStatus: TenderStatus, nextStatus: TenderStatus, userRole: UserRole): boolean => {
      const allowedNextStatuses = STATUS_TRANSITIONS[currentStatus];
      const roleCanSetStatuses = ROLE_CAN_SET_STATUS[userRole];

      const isValidTransition = allowedNextStatuses.includes(nextStatus);
      const roleCanSet = roleCanSetStatuses.includes(nextStatus);

      return isValidTransition && roleCanSet;
    },
    []
  );

  // Check if user can perform specific action
  const canPerformAction = useCallback(
    (action: string, tender: Tender): boolean => {
      switch (action) {
        case "delete":
          return tender.status === "DRAFT" && role === "USER";
        case "sendToMd":
          return tender.status === "DRAFT" && role === "USER";
        case "resubmit":
          return tender.status === "REJECTED" && role === "USER";
        case "mdConfirm":
        case "mdReject":
          return tender.status === "PENDING_MD_TAGGING" && role === "MD";
        case "uploadNit":
          return tender.status === "MD_TAGGED" && role === "USER";
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
    [role]
  );

  // Helper to update a single tender
  const updateTender = useCallback((tenderId: string, updates: Partial<Tender>) => {
    setState((prev) => ({
      ...prev,
      tenders: prev.tenders.map((t) =>
        t.id === tenderId ? { ...t, ...updates, updatedAt: new Date() } : t
      ),
    }));
  }, []);

  // Excel operations
  const parseExcelData = useCallback((data: TenderWorkflowItem[]) => {
    setState((prev) => ({
      ...prev,
      previewData: data,
      selectedPreviewKeys: [],
    }));
  }, []);

  const clearPreviewData = useCallback(() => {
    setState((prev) => ({
      ...prev,
      previewData: [],
      selectedPreviewKeys: [],
    }));
  }, []);

  const setSelectedPreviewKeys = useCallback((keys: Key[]) => {
    setState((prev) => ({
      ...prev,
      selectedPreviewKeys: keys,
    }));
  }, []);

  const addSelectedToDraft = useCallback(() => {
    setState((prev) => {
      const selectedRows = prev.previewData.filter((row) =>
        prev.selectedPreviewKeys.includes(row.id)
      );

      const newTenders: Tender[] = selectedRows.map((row) => ({
        id: generateId(),
        name: row.tenderTitle,
        referenceNumber: row.tenderNo || generateRefNumber(),
        issuingDepartment: row.department,
        // Do not carry over Excel 'Status' into app logic — keep internal workflow status only.
        description: `Opening: ${row.openingDateTime} | Due: ${row.dueDateTime} (${row.dueDays} days)`,
        status: "DRAFT" as TenderStatus,
        tags: [],
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        submissionDeadline: row.dueDateTime !== "NOT OPENED" && row.dueDateTime 
          ? parseDateString(row.dueDateTime) 
          : undefined,
      }));

      return {
        ...prev,
        tenders: [...prev.tenders, ...newTenders],
        previewData: [],
        selectedPreviewKeys: [],
      };
    });
  }, []);

  // Helper function to parse date strings from Excel (format: "08/01/2026 11:00")
  const parseDateString = (dateStr: string): Date | undefined => {
    try {
      const [datePart, timePart] = dateStr.split(" ");
      if (!datePart) return undefined;
      
      const [day, month, year] = datePart.split("/");
      if (!day || !month || !year) return undefined;
      
      const [hours = "0", minutes = "0"] = (timePart || "").split(":");
      
      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );
    } catch {
      return undefined;
    }
  };

  // Tender CRUD operations
  const deleteTender = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tenders: prev.tenders.filter((t) => t.id !== id),
    }));
  }, []);

  const sendToMd = useCallback((ids: string[]) => {
    setState((prev) => ({
      ...prev,
      tenders: prev.tenders.map((t) =>
        ids.includes(t.id) && t.status === "DRAFT"
          ? { ...t, status: "PENDING_MD_TAGGING" as TenderStatus, updatedAt: new Date() }
          : t
      ),
    }));
  }, []);

  const resubmitRejected = useCallback((id: string) => {
    updateTender(id, {
      status: "PENDING_MD_TAGGING",
      rejectionReason: undefined,
    });
  }, [updateTender]);

  // MD operations
  const openTaggingDrawer = useCallback((tender: Tender) => {
    setState((prev) => ({
      ...prev,
      activeDrawerTender: tender,
      isDrawerOpen: true,
    }));
  }, []);

  const closeTaggingDrawer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeDrawerTender: null,
      isDrawerOpen: false,
    }));
  }, []);

  const mdConfirm = useCallback(
    (tenderId: string, tagIds: string[]) => {
      const selectedTags = AVAILABLE_TAGS.filter((t) => tagIds.includes(t.id));
      updateTender(tenderId, {
        status: "MD_TAGGED",
        tags: selectedTags,
        rejectionReason: undefined,
      });
      closeTaggingDrawer();
    },
    [updateTender, closeTaggingDrawer]
  );

  const mdReject = useCallback(
    (tenderId: string, reason: string) => {
      updateTender(tenderId, {
        status: "REJECTED",
        rejectionReason: reason,
      });
      closeTaggingDrawer();
    },
    [updateTender, closeTaggingDrawer]
  );

  const verifyNit = useCallback(
    (tenderId: string) => {
      updateTender(tenderId, {
        status: "NIT_VERIFIED",
      });
    },
    [updateTender]
  );

  // Document operations
  const uploadNit = useCallback(
    (tenderId: string, document: Omit<TenderDocument, "id">) => {
      const nitDoc: TenderDocument = {
        ...document,
        id: `nit-${Date.now()}`,
        type: "NIT",
      };
      updateTender(tenderId, {
        status: "NIT_UPLOADED",
        nitDocument: nitDoc,
      });
    },
    [updateTender]
  );

  const uploadDocuments = useCallback(
    (tenderId: string, documents: Omit<TenderDocument, "id">[]) => {
      const newDocs: TenderDocument[] = documents.map((doc, idx) => ({
        ...doc,
        id: `doc-${Date.now()}-${idx}`,
      }));

      setState((prev) => ({
        ...prev,
        tenders: prev.tenders.map((t) =>
          t.id === tenderId
            ? {
                ...t,
                status: "DOCS_UPLOADED" as TenderStatus,
                documents: [...t.documents, ...newDocs],
                updatedAt: new Date(),
              }
            : t
        ),
      }));
    },
    []
  );

  // Mail operations
  const markReadyToMail = useCallback(
    (tenderId: string) => {
      updateTender(tenderId, {
        status: "READY_TO_MAIL",
      });
    },
    [updateTender]
  );

  const sendMail = useCallback(
    (tenderId: string) => {
      updateTender(tenderId, {
        status: "MAIL_SENT",
        mailSentAt: new Date(),
      });
    },
    [updateTender]
  );

  const sendMailBulk = useCallback((ids: string[]) => {
    setState((prev) => ({
      ...prev,
      tenders: prev.tenders.map((t) =>
        ids.includes(t.id) && t.status === "READY_TO_MAIL"
          ? { ...t, status: "MAIL_SENT" as TenderStatus, mailSentAt: new Date(), updatedAt: new Date() }
          : t
      ),
    }));
  }, []);

  // Data accessors
  const getTendersByTab = useCallback(
    (tabKey: string): Tender[] => {
      const tabs = role === "USER" ? USER_TABS : MD_TABS;
      const tabConfig = tabs.find((t) => t.key === tabKey);
      if (!tabConfig) return [];
      return state.tenders.filter((t) => tabConfig.statuses.includes(t.status));
    },
    [state.tenders, role]
  );

  const getTabCounts = useMemo(() => {
    return (): Record<string, number> => {
      const tabs = role === "USER" ? USER_TABS : MD_TABS;
      const counts: Record<string, number> = {};
      
      tabs.forEach((tab) => {
        counts[tab.key] = state.tenders.filter((t) => tab.statuses.includes(t.status)).length;
      });
      
      return counts;
    };
  }, [state.tenders, role]);

  const getAvailableTags = useCallback(() => AVAILABLE_TAGS, []);

  const getCurrentTabs = useCallback(() => {
    return role === "USER" ? USER_TABS : MD_TABS;
  }, [role]);

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
    verifyNit,
    uploadNit,
    uploadDocuments,
    markReadyToMail,
    sendMail,
    sendMailBulk,
    validateTransition,
    canPerformAction,
    getTendersByTab,
    getTabCounts,
    getAvailableTags,
    getCurrentTabs,
  };
}