import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Button, Badge, message, Alert } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  ReloadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useTenderWorkflow } from "../hooks/useTenderWorkflow";
import { TenderPreviewTable } from "../components/TenderPreviewTable";
import { WorkspaceGrid } from "../components/WorkspaceGrid";
import { MailActionBar } from "../components/MailActionBar";
import { MdTaggingDrawer } from "../components/MdTaggingDrawer";
import { NitUploadSection } from "../components/NitUploadSection";
import { DocumentUploadSection } from "../components/DocumentUploadSection";
import { ExcelUploadSection } from "../components/ExcelUploadSelection";
import { useCheckDeadlineReminders } from "../services/tenders.service";
import type { Tender } from "../types/tender.types";
import s from "../styles/tender-workflow.module.css";

export const TenderWorkflowPage: React.FC = () => {
  const {
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
    getTendersByTab,
    getTabCounts,
    getCurrentTabs,
  } = useTenderWorkflow();

  const [nitTender, setNitTender] = useState<Tender | null>(null);
  const [docTender, setDocTender] = useState<Tender | null>(null);
  const navigate = useNavigate();
  const [reminderDismissed, setReminderDismissed] = useState(false);

  // Fire deadline reminders check on mount (creates server-side notifications)
  const [checkReminders] = useCheckDeadlineReminders();
  useEffect(() => {
    checkReminders().catch(() => {/* silent - mutation identity is stable */});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Capture current time once to avoid impure Date.now() in render
  const [mountTime] = useState(() => Date.now());

  // Tenders with deadlines approaching within 3 days
  const approachingDeadlineTenders = useMemo(() => {
    const now = mountTime;
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    return state.tenders.filter((t) => {
      if (!t.submissionDeadline) return false;
      const deadline = new Date(t.submissionDeadline).getTime();
      const daysLeft = deadline - now;
      return daysLeft > 0 && daysLeft <= threeDaysMs;
    });
  }, [state.tenders, mountTime]);

  const counts = getTabCounts();
  const tabs = getCurrentTabs();
  const hasPreview = state.previewData.length > 0;
  const isUserRole = role === "USER";
  const isMailTab = role === "USER" && activeTab === "readyToMail";

  const switchRole = useCallback(
    (target: "USER" | "MD") => {
      if (role === target) return;
      setRole(target);
      setActiveTab(target === "USER" ? "nitPending" : "pendingApproval");
      message.info(`Switched to ${target === "MD" ? "MD" : "User"} view`);
    },
    [role, setRole, setActiveTab]
  );

  const onView = useCallback(
    (t: Tender) => {
      // Open tagging drawer for MD users in approval or tagging steps
      if (role === "MD" && (t.status === "PENDING_MD_TAGGING" || t.status === "NIT_UPLOADED")) {
        openTaggingDrawer(t);
        return;
      }
      // Navigate to tender detail page for other workflows
      navigate(`/tender-workflow/${t.id}`);
    },
    [role, openTaggingDrawer, navigate]
  );

  const tabItems = tabs.map((tab) => ({
    key: tab.key,
    label: (
      <span className={s.tabLabel}>
        {tab.label}
        {counts[tab.key] > 0 && (
          <Badge
            count={counts[tab.key]}
            size="small"
            style={{ marginLeft: 4 }}
          />
        )}
      </span>
    ),
    children: (
      <WorkspaceGrid
        tenders={getTendersByTab(tab.key)}
        role={role}
        tabKey={tab.key}
        onView={onView}
        onOpenTaggingDrawer={openTaggingDrawer}
        onDelete={(id) => {
          deleteTender(id);
          message.success("Deleted");
        }}
        onSendToMd={(ids) => {
          sendToMd(ids);
          message.success(`${ids.length} sent to MD`);
        }}
        onResubmit={(id) => {
          resubmitRejected(id);
          message.success("Resubmitted");
        }}
        onUploadNit={setNitTender}
        onUploadDocs={setDocTender}
        onMarkReady={(id) => {
          markReadyToMail(id);
          message.success("Marked ready");
        }}
          onSendMail={(id) => {
          sendMail(id);
        }}
          onVerifyNit={(id) => {
            verifyNit(id);
            message.success("NIT verified");
          }}
          onApprove={(id) => {
            mdApprove(id);
            message.success("Approved for NIT upload");
          }}
          onBulkApprove={(ids) => {
            mdBulkApprove(ids);
          }}
      />
    ),
  }));

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={s.headerLeft}>
          <FileTextOutlined className={s.titleIcon} />
          <h1 className={s.pageTitle}>Tender Workflow</h1>
        </div>
        <div className={s.headerRight}>
          <div className={s.rolePill}>
            <span
              className={`${s.roleOption} ${role === "USER" ? s.roleActive : ""}`}
              onClick={() => switchRole("USER")}
            >
              <UserOutlined /> User
            </span>
            <span
              className={`${s.roleOption} ${role === "MD" ? s.roleActive : ""}`}
              onClick={() => switchRole("MD")}
            >
              <TeamOutlined /> MD
            </span>
          </div>
          <Button icon={<ReloadOutlined />} type="text" size="small" />
        </div>
      </header>

      {/* Approaching Deadline Reminder */}
      {!reminderDismissed && approachingDeadlineTenders.length > 0 && (
        <Alert
          type="warning"
          banner
          closable
          onClose={() => setReminderDismissed(true)}
          icon={<WarningOutlined />}
          message={
            <span style={{ fontSize: 13 }}>
              <strong>{approachingDeadlineTenders.length} tender{approachingDeadlineTenders.length !== 1 ? 's' : ''}</strong> with deadline approaching within 3 days:{' '}
              {approachingDeadlineTenders.slice(0, 3).map((t, i) => {
                const days = Math.ceil((new Date(t.submissionDeadline!).getTime() - mountTime) / 864e5);
                return (
                  <span key={t.id}>
                    {i > 0 && ', '}
                    <strong>{t.name}</strong> ({days}d left)
                  </span>
                );
              })}
              {approachingDeadlineTenders.length > 3 && ` and ${approachingDeadlineTenders.length - 3} more`}
            </span>
          }
          style={{ marginBottom: 0 }}
        />
      )}

      <div className={s.body}>
        {(isUserRole || isMailTab) && (
          <div className={s.topBar}>
            {isUserRole && (
              <>
                <ExcelUploadSection
                  onDataParsed={parseExcelData}
                  hasPreviewData={hasPreview}
                  onClearData={clearPreviewData}
                />
                {hasPreview && (
                  <TenderPreviewTable
                    data={state.previewData}
                    selectedKeys={state.selectedPreviewKeys}
                    onSelectionChange={setSelectedPreviewKeys}
                    onAddToDraft={() => {
                      void addSelectedToDraft();
                    }}
                    onClear={clearPreviewData}
                    loading={state.isAddingToDraft}
                  />
                )}
              </>
            )}
            {isMailTab && (
              <MailActionBar
                tenders={getTendersByTab("readyToMail")}
                onSendMail={(id) => {
                  sendMail(id);
                  message.success("Sent");
                }}
                onSendMailBulk={sendMailBulk}
              />
            )}
          </div>
        )}

        <Tabs
          className={s.tabs}
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="small"
        />
      </div>

      <MdTaggingDrawer
        tender={state.activeDrawerTender}
        open={state.isDrawerOpen}
        onClose={closeTaggingDrawer}
        onConfirm={mdConfirm}
        onReject={mdReject}
      />
      <NitUploadSection
        tender={nitTender}
        open={!!nitTender}
        onClose={() => setNitTender(null)}
        onUpload={uploadNit}
      />
      <DocumentUploadSection
        tender={docTender}
        open={!!docTender}
        onClose={() => setDocTender(null)}
        onUpload={uploadDocuments}
      />
    </div>
  );
};

export default TenderWorkflowPage;