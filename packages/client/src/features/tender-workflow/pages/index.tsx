import React, { useState } from "react";
import { Tabs, Switch, Button, message } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useTenderWorkflow } from "../hooks/useTenderWorkflow";
import { TenderPreviewTable } from "../components/TenderPreviewTable";
import { WorkspaceGrid } from "../components/WorkspaceGrid";
import { MailActionBar } from "../components/MailActionBar";
import { MdTaggingDrawer } from "../components/MdTaggingDrawer";
import { NitUploadSection } from "../components/NitUploadSection";
import { DocumentUploadSection } from "../components/DocumentUploadSection";
import type { Tender } from "../types/tender.types";
import s from "../styles/tender-workflow.module.css";
import { ExcelUploadSection } from "../components/ExcelUploadSelection";

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
    verifyNit,
    uploadNit,
    uploadDocuments,
    markReadyToMail,
    sendMail,
    sendMailBulk,
    getTendersByTab,
    getTabCounts,
    getCurrentTabs,
  } = useTenderWorkflow();

  const [nitTender, setNitTender] = useState<Tender | null>(null);
  const [docTender, setDocTender] = useState<Tender | null>(null);

  const counts = getTabCounts();
  const tabs = getCurrentTabs();
  const hasPreview = state.previewData.length > 0;
  const isDraft = role === "USER" && activeTab === "draft";
  const isMailTab = role === "USER" && activeTab === "readyToMail";

  const switchRole = (checked: boolean) => {
    const r = checked ? "MD" : "USER";
    setRole(r);
    setActiveTab(r === "USER" ? "draft" : "pendingTagging");
    message.info(`Switched to ${r === "MD" ? "MD" : "User"} view`);
  };

  const onView = (t: Tender) => {
    if (role === "MD" && t.status === "PENDING_MD_TAGGING") openTaggingDrawer(t);
  };

  const tabItems = tabs.map((tab) => ({
    key: tab.key,
    label: (
      <span className={s.tabLabel}>
        {tab.label}
        {counts[tab.key] > 0 && (
          <span className={`${s.tabCount} ${activeTab === tab.key ? s.tabCountActive : ""}`}>
            {counts[tab.key]}
          </span>
        )}
      </span>
    ),
    children: (
      <WorkspaceGrid
        tenders={getTendersByTab(tab.key)}
        role={role}
        tabKey={tab.key}
        onView={onView}
        onDelete={(id) => { deleteTender(id); message.success("Deleted"); }}
        onSendToMd={(ids) => { sendToMd(ids); message.success(`${ids.length} sent to MD`); }}
        onResubmit={(id) => { resubmitRejected(id); message.success("Resubmitted"); }}
        onUploadNit={setNitTender}
        onUploadDocs={setDocTender}
        onMarkReady={(id) => { markReadyToMail(id); message.success("Marked ready"); }}
        onSendMail={(id) => { sendMail(id); message.success("Mail sent"); }}
        onVerifyNit={(id) => { verifyNit(id); message.success("NIT verified"); }}
      />
    ),
  }));

  return (
    <div className={s.page}>
      {/* ─── Header ─── */}
      <header className={s.header}>
        <div className={s.headerLeft}>
          <FileTextOutlined className={s.titleIcon} />
          <h1 className={s.pageTitle}>Tender Workflow</h1>
        </div>
        <div className={s.headerRight}>
          <div className={s.rolePill}>
            <span
              className={`${s.roleOption} ${role === "USER" ? s.roleActive : ""}`}
              onClick={() => role === "MD" && switchRole(false)}
            >
              <UserOutlined /> User
            </span>
            <Switch checked={role === "MD"} onChange={switchRole} size="small" />
            <span
              className={`${s.roleOption} ${role === "MD" ? s.roleActive : ""}`}
              onClick={() => role === "USER" && switchRole(true)}
            >
              <TeamOutlined /> MD
            </span>
          </div>
          <Button icon={<ReloadOutlined />} type="text" />
        </div>
      </header>

      {/* ─── Body ─── */}
      <div className={s.body}>
        {/* Contextual top bars */}
        {(isDraft || isMailTab) && (
          <div className={s.topBar}>
            {isDraft && (
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
                    onAddToDraft={() => { addSelectedToDraft(); message.success("Added to drafts"); }}
                    onClear={clearPreviewData}
                  />
                )}
              </>
            )}
            {isMailTab && (
              <MailActionBar
                tenders={getTendersByTab("readyToMail")}
                onSendMail={(id) => { sendMail(id); message.success("Sent"); }}
                onSendMailBulk={sendMailBulk}
              />
            )}
          </div>
        )}

        {/* Main workspace */}
        <Tabs
          className={s.tabs}
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="middle"
        />
      </div>

      {/* ─── Modals / Drawers ─── */}
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