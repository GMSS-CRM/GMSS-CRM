import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Switch,
  InputNumber,
  DatePicker,
  Select,
  Divider,
  Row,
  Col,
  Typography,
  Alert,
} from 'antd';
import type { TenderPostAward } from '@gmss/types';
import dayjs from 'dayjs';
import FileUploadField from '../../components/FileUploadField';

const { Title } = Typography;

interface Props {
  data: TenderPostAward;
  saving: boolean;
  onSave: (values: Record<string, unknown>) => void;
}

function boolField(val?: boolean | null): boolean {
  return val ?? false;
}

/* ─── Stage 1: Order Follow-Up ────────────────────────────────────────────── */

export const OrderFollowUpSection: React.FC<Props> = ({ data, saving, onSave }) => {
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);

  const initial = {
    tenderOfficerName: data.tenderOfficerName ?? '',
    tenderOfficerPhone: data.tenderOfficerPhone ?? '',
    tenderOfficerEmail: data.tenderOfficerEmail ?? '',
    followUpRemarks: data.followUpRemarks ?? '',
    loaReceived: boolField(data.loaReceived),
    poNumber: data.poNumber ?? '',
    poDate: data.poDate ? dayjs(data.poDate) : null,
    emdReturnReceived: boolField(data.emdReturnReceived),
    emdAmount: data.emdAmount ?? undefined,
    emdAdviceNumber: data.emdAdviceNumber ?? '',
    emdReceivedDate: data.emdReceivedDate ? dayjs(data.emdReceivedDate) : null,
  };

  return (
    <Form form={form} layout="vertical" initialValues={initial} onFinish={onSave} onValuesChange={() => setIsDirty(true)} style={{ padding: 24 }}>
      <Title level={5}>Tender Officer Details</Title>
      <Row gutter={16}>
        <Col span={8}><Form.Item label="Officer Name" name="tenderOfficerName"><Input /></Form.Item></Col>
        <Col span={8}><Form.Item label="Phone" name="tenderOfficerPhone"><Input /></Form.Item></Col>
        <Col span={8}><Form.Item label="Email" name="tenderOfficerEmail"><Input type="email" /></Form.Item></Col>
      </Row>
      <Form.Item label="Follow-Up Remarks" name="followUpRemarks">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Divider />
      <Title level={5}>LOA / PO</Title>
      <Row gutter={16}>
        <Col span={4}><Form.Item label="LOA Received" name="loaReceived" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={10}><Form.Item label="PO Number" name="poNumber"><Input /></Form.Item></Col>
        <Col span={10}><Form.Item label="PO Date" name="poDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
      </Row>

      <Divider />
      <Title level={5}>EMD Return</Title>
      <Row gutter={16}>
        <Col span={4}><Form.Item label="EMD Received" name="emdReturnReceived" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={10}><Form.Item label="EMD Amount (₹)" name="emdAmount"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={10}><Form.Item label="Advice Number" name="emdAdviceNumber"><Input /></Form.Item></Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}><Form.Item label="EMD Received Date" name="emdReceivedDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving} disabled={!isDirty}>Save Order Follow-Up</Button>
      </Form.Item>
    </Form>
  );
};

/* ─── Stage 2: Order Processing ────────────────────────────────────────────── */

export const OrderProcessingSection: React.FC<Props> = ({ data, saving, onSave }) => {
  const [form] = Form.useForm();
  const [sdRequired, setSdRequired] = useState(boolField(data.securityDepositRequired));
  const [extRequested, setExtRequested] = useState(boolField(data.extensionRequested));
  const [ldcApplicable, setLdcApplicable] = useState(boolField(data.ldcApplicable));
  const [isDirty, setIsDirty] = useState(false);

  const initial = {
    poUploaded: boolField(data.poUploaded),
    poDocumentUrl: data.poDocumentUrl ?? '',
    commissionPaymentRequired: boolField(data.commissionPaymentRequired),
    securityDepositRequired: sdRequired,
    securityDepositType: data.securityDepositType ?? undefined,
    securityDepositAmount: data.securityDepositAmount ?? undefined,
    securityDepositDueDate: data.securityDepositDueDate ? dayjs(data.securityDepositDueDate) : null,
    sdCourierDetails: data.sdCourierDetails ?? '',
    deliveryDeadlineDays: data.deliveryDeadlineDays ?? 60,
    poReleasedToVendor: boolField(data.poReleasedToVendor),
    poReleasedDate: data.poReleasedDate ? dayjs(data.poReleasedDate) : null,
    extensionRequested: extRequested,
    extensionReason: data.extensionReason ?? '',
    newDeliveryDate: data.newDeliveryDate ? dayjs(data.newDeliveryDate) : null,
    extensionAccepted: boolField(data.extensionAccepted),
    ldcApplicable: ldcApplicable,
    ldcPercentage: data.ldcPercentage ?? undefined,
    lateDeliveryBy: data.lateDeliveryBy ?? undefined,
    // Firm Bill
    firmBillNumber: data.firmBillNumber ?? '',
    firmBillDate: data.firmBillDate ? dayjs(data.firmBillDate) : null,
    firmBillQuantity: data.firmBillQuantity ?? undefined,
    firmBillRate: data.firmBillRate ?? undefined,
    firmBillBasicRateDiff: data.firmBillBasicRateDiff ?? undefined,
    firmBillTotalCharges: data.firmBillTotalCharges ?? undefined,
    firmBillTotalProfit: data.firmBillTotalProfit ?? undefined,
    firmBillMarginPct: data.firmBillMarginPct ?? undefined,
    // Option Clause
    optionClauseApplicable: boolField(data.optionClauseApplicable),
    optionClauseReminderDate: data.optionClauseReminderDate ? dayjs(data.optionClauseReminderDate) : null,
    optionClauseQuantityAdded: boolField(data.optionClauseQuantityAdded),
    optionClauseQuantity: data.optionClauseQuantity ?? undefined,
  };

  return (
    <Form form={form} layout="vertical" initialValues={initial} onFinish={onSave} onValuesChange={() => setIsDirty(true)} style={{ padding: 24 }}>
      <Title level={5}>PO Details</Title>
      <Row gutter={16}>
        <Col span={4}><Form.Item label="PO Uploaded" name="poUploaded" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={20}><Form.Item label="PO Document" name="poDocumentUrl"><FileUploadField folder="post-award/po-documents" accept=".pdf,.doc,.docx" buttonText="Upload PO" /></Form.Item></Col>
      </Row>
      <Row gutter={16}>
        <Col span={6}><Form.Item label="Commission Payment Required" name="commissionPaymentRequired" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={6}><Form.Item label="Delivery Deadline (days)" name="deliveryDeadlineDays"><InputNumber min={1} max={120} style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={6}><Form.Item label="PO Released to Vendor" name="poReleasedToVendor" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={6}><Form.Item label="PO Released Date" name="poReleasedDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
      </Row>

      <Divider />
      <Title level={5}>Security Deposit</Title>
      <Form.Item label="SD Required" name="securityDepositRequired" valuePropName="checked">
        <Switch onChange={setSdRequired} />
      </Form.Item>
      {sdRequired && (
        <>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="SD Type" name="securityDepositType">
                <Select options={[{ value: 'DD' }, { value: 'FDR' }, { value: 'BG', label: 'Bank Guarantee' }, { value: 'NEFT' }]} />
              </Form.Item>
            </Col>
            <Col span={8}><Form.Item label="SD Amount (₹)" name="securityDepositAmount"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={8}><Form.Item label="SD Due Date" name="securityDepositDueDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Form.Item label="SD Courier Details" name="sdCourierDetails"><Input.TextArea rows={2} /></Form.Item>
        </>
      )}

      <Divider />
      <Title level={5}>Extension / LDC</Title>
      <Row gutter={16}>
        <Col span={4}><Form.Item label="Extension Requested" name="extensionRequested" valuePropName="checked"><Switch onChange={setExtRequested} /></Form.Item></Col>
        {extRequested && (
          <>
            <Col span={8}><Form.Item label="Extension Reason" name="extensionReason"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="New Delivery Date" name="newDeliveryDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={4}><Form.Item label="Extension Accepted" name="extensionAccepted" valuePropName="checked"><Switch /></Form.Item></Col>
          </>
        )}
      </Row>
      <Row gutter={16}>
        <Col span={4}><Form.Item label="LDC Applicable" name="ldcApplicable" valuePropName="checked"><Switch onChange={setLdcApplicable} /></Form.Item></Col>
        {ldcApplicable && (
          <>
            <Col span={8}><Form.Item label="LDC %" name="ldcPercentage"><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={8}>
              <Form.Item label="Late Delivery By" name="lateDeliveryBy">
                <Select options={[{ value: 'GMSS', label: 'GMSS' }, { value: 'Vendor', label: 'Vendor / Manufacturer' }]} />
              </Form.Item>
            </Col>
          </>
        )}
      </Row>

      <Divider />
      <Title level={5}>Firm Bill Details</Title>
      <Row gutter={16}>
        <Col span={8}><Form.Item label="Firm Bill Number" name="firmBillNumber"><Input /></Form.Item></Col>
        <Col span={8}><Form.Item label="Firm Bill Date" name="firmBillDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={8}><Form.Item label="Quantity" name="firmBillQuantity"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
      </Row>
      <Row gutter={16}>
        <Col span={6}><Form.Item label="Rate (₹)" name="firmBillRate"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={6}><Form.Item label="Basic Rate Diff" name="firmBillBasicRateDiff"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={6}><Form.Item label="Total Charges (₹)" name="firmBillTotalCharges"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={6}><Form.Item label="Total Profit (₹)" name="firmBillTotalProfit"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
      </Row>
      <Row gutter={16}>
        <Col span={6}><Form.Item label="Margin %" name="firmBillMarginPct"><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item></Col>
      </Row>

      <Divider />
      <Title level={5}>Option Clause</Title>
      <Row gutter={16}>
        <Col span={4}><Form.Item label="Option Clause Applicable" name="optionClauseApplicable" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={6}><Form.Item label="Reminder Date" name="optionClauseReminderDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={4}><Form.Item label="Quantity Added" name="optionClauseQuantityAdded" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={6}><Form.Item label="Option Clause Qty" name="optionClauseQuantity"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving} disabled={!isDirty}>Save Order Processing</Button>
      </Form.Item>
    </Form>
  );
};

/* ─── Stage 3: Inspection ───────────────────────────────────────────────────── */

export const InspectionSection: React.FC<Props> = ({ data, saving, onSave }) => {
  const [form] = Form.useForm();
  const [required, setRequired] = useState(boolField(data.inspectionRequired));
  const [isDirty, setIsDirty] = useState(false);

  const initial = {
    inspectionRequired: required,
    tpiAgencyName: data.tpiAgencyName ?? '',
    tpiOfficerName: data.tpiOfficerName ?? '',
    tpiOfficerContact: data.tpiOfficerContact ?? '',
    tpiVisitSchedule: data.tpiVisitSchedule ? dayjs(data.tpiVisitSchedule) : null,
    inspectionDone: boolField(data.inspectionDone),
    inspectionCertificateUrl: data.inspectionCertificateUrl ?? '',
  };

  return (
    <Form form={form} layout="vertical" initialValues={initial} onFinish={onSave} onValuesChange={() => setIsDirty(true)} style={{ padding: 24 }}>
      <Form.Item label="TPI Inspection Required" name="inspectionRequired" valuePropName="checked">
        <Switch onChange={setRequired} />
      </Form.Item>

      {required && (
        <>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="TPI Agency Name" name="tpiAgencyName"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="TPI Officer Name" name="tpiOfficerName"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="TPI Officer Contact" name="tpiOfficerContact"><Input /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="Visit Schedule" name="tpiVisitSchedule"><DatePicker showTime style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={4}><Form.Item label="Inspection Done" name="inspectionDone" valuePropName="checked"><Switch /></Form.Item></Col>
            <Col span={12}><Form.Item label="Inspection Certificate" name="inspectionCertificateUrl"><FileUploadField folder="post-award/inspection" accept=".pdf,.jpg,.jpeg,.png" buttonText="Upload Certificate" /></Form.Item></Col>
          </Row>
        </>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving} disabled={!isDirty}>Save Inspection</Button>
      </Form.Item>
    </Form>
  );
};

/* ─── Stage 4: Dispatch & Delivery ────────────────────────────────────────── */

export const DispatchDeliverySection: React.FC<Props> = ({ data, saving, onSave }) => {
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);

  const ldcTotal =
    (data.ldcRailwayPoValue ?? 0) * ((data.ldcGivenPercentage ?? 0) / 100);

  const initial = {
    purchaseInvoiceReceived: boolField(data.purchaseInvoiceReceived),
    courierCompanyName: data.courierCompanyName ?? '',
    courierContact: data.courierContact ?? '',
    podNumber: data.podNumber ?? '',
    consignmentNumber: data.consignmentNumber ?? '',
    actualDeliveryDate: data.actualDeliveryDate ? dayjs(data.actualDeliveryDate) : null,
    proofOfDeliveryUrl: data.proofOfDeliveryUrl ?? '',
    ldcGivenPercentage: data.ldcGivenPercentage ?? undefined,
    ldcRailwayPoValue: data.ldcRailwayPoValue ?? undefined,
    ldcCalculatedTotal: data.ldcCalculatedTotal ?? ldcTotal,
    ldcInvoiceUrl: data.ldcInvoiceUrl ?? '',
    receiptNoteReceived: boolField(data.receiptNoteReceived),
    receiptNoteDetails: data.receiptNoteDetails ?? '',
  };

  return (
    <Form form={form} layout="vertical" initialValues={initial} onFinish={onSave} onValuesChange={() => setIsDirty(true)} style={{ padding: 24 }}>
      <Title level={5}>Courier / Delivery</Title>
      <Row gutter={16}>
        <Col span={4}><Form.Item label="Purchase Invoice Received" name="purchaseInvoiceReceived" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={10}><Form.Item label="Courier Company" name="courierCompanyName"><Input /></Form.Item></Col>
        <Col span={10}><Form.Item label="Courier Contact" name="courierContact"><Input /></Form.Item></Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}><Form.Item label="POD Number" name="podNumber"><Input /></Form.Item></Col>
        <Col span={8}><Form.Item label="Consignment Number" name="consignmentNumber"><Input /></Form.Item></Col>
        <Col span={8}><Form.Item label="Actual Delivery Date" name="actualDeliveryDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
      </Row>
      <Form.Item label="Proof of Delivery" name="proofOfDeliveryUrl"><FileUploadField folder="post-award/delivery" accept=".pdf,.jpg,.jpeg,.png" buttonText="Upload POD" /></Form.Item>

      <Divider />
      <Title level={5}>LDC Calculation</Title>
      <Alert
        type="info"
        showIcon
        message="LDC Formula: LDC% × PO Value = LDC Amount"
        style={{ marginBottom: 16 }}
      />
      <Row gutter={16}>
        <Col span={8}><Form.Item label="LDC %" name="ldcGivenPercentage"><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={8}><Form.Item label="Railway PO Value (₹)" name="ldcRailwayPoValue"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={8}><Form.Item label="LDC Total (₹)" name="ldcCalculatedTotal"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
      </Row>
      <Form.Item label="LDC Invoice" name="ldcInvoiceUrl"><FileUploadField folder="post-award/ldc" accept=".pdf,.jpg,.jpeg,.png" buttonText="Upload LDC Invoice" /></Form.Item>

      <Divider />
      <Row gutter={16}>
        <Col span={4}><Form.Item label="Receipt Note Received" name="receiptNoteReceived" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={20}><Form.Item label="Receipt Note Details" name="receiptNoteDetails"><Input.TextArea rows={2} /></Form.Item></Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving} disabled={!isDirty}>Save Dispatch & Delivery</Button>
      </Form.Item>
    </Form>
  );
};

/* ─── Stage 5: Warranty Rejections ─────────────────────────────────────────── */

export const WarrantySection: React.FC<Props> = ({ data, saving, onSave }) => {
  const [form] = Form.useForm();
  const [applicable, setApplicable] = useState(boolField(data.warrantyRejectionApplicable));
  const [engineerVisit, setEngineerVisit] = useState(boolField(data.warrantyEngineerVisit));
  const [isDirty, setIsDirty] = useState(false);

  const initial = {
    warrantyRejectionApplicable: applicable,
    warrantyRejectionReason: data.warrantyRejectionReason ?? '',
    warrantyAdviceNumber: data.warrantyAdviceNumber ?? '',
    warrantyPoNumber: data.warrantyPoNumber ?? '',
    warrantyPoDate: data.warrantyPoDate ? dayjs(data.warrantyPoDate) : null,
    warrantyInvoiceNumber: data.warrantyInvoiceNumber ?? '',
    warrantyInvoiceDate: data.warrantyInvoiceDate ? dayjs(data.warrantyInvoiceDate) : null,
    warrantyCompanyName: data.warrantyCompanyName ?? '',
    warrantyConsigneeName: data.warrantyConsigneeName ?? '',
    warrantyConsigneeNumber: data.warrantyConsigneeNumber ?? '',
    warrantyPeriod: data.warrantyPeriod ?? '',
    warrantyEngineerVisit: engineerVisit,
    warrantyEngineerName: data.warrantyEngineerName ?? '',
    warrantyEngineerContact: data.warrantyEngineerContact ?? '',
    warrantyEngineerVisitDate: data.warrantyEngineerVisitDate ? dayjs(data.warrantyEngineerVisitDate) : null,
    warrantyAction: data.warrantyAction ?? undefined,
    warrantyWithin60Days: boolField(data.warrantyWithin60Days),
    runningBillDeduction: boolField(data.runningBillDeduction),
  };

  return (
    <Form form={form} layout="vertical" initialValues={initial} onFinish={onSave} onValuesChange={() => setIsDirty(true)} style={{ padding: 24 }}>
      <Form.Item label="Warranty Rejection Applicable" name="warrantyRejectionApplicable" valuePropName="checked">
        <Switch onChange={setApplicable} />
      </Form.Item>

      {applicable && (
        <>
          <Form.Item label="Rejection Reason" name="warrantyRejectionReason"><Input.TextArea rows={2} /></Form.Item>

          <Divider />
          <Title level={5}>Advice / PO Details</Title>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="Advice Number" name="warrantyAdviceNumber"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="PO Number" name="warrantyPoNumber"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="PO Date" name="warrantyPoDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}><Form.Item label="Invoice Number" name="warrantyInvoiceNumber"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="Invoice Date" name="warrantyInvoiceDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={6}><Form.Item label="Company Name" name="warrantyCompanyName"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="Warranty Period" name="warrantyPeriod"><Input /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="Consignee Name" name="warrantyConsigneeName"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="Consignee Number" name="warrantyConsigneeNumber"><Input /></Form.Item></Col>
            <Col span={8}>
              <Form.Item label="Action Type" name="warrantyAction">
                <Select options={[{ value: 'engineer', label: 'Engineer Visit' }, { value: 'dispatch', label: 'Direct Dispatch' }]} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Row gutter={16}>
            <Col span={4}><Form.Item label="Engineer Visit" name="warrantyEngineerVisit" valuePropName="checked"><Switch onChange={setEngineerVisit} /></Form.Item></Col>
            {engineerVisit && (
              <>
                <Col span={8}><Form.Item label="Engineer Name" name="warrantyEngineerName"><Input /></Form.Item></Col>
                <Col span={6}><Form.Item label="Engineer Contact" name="warrantyEngineerContact"><Input /></Form.Item></Col>
                <Col span={6}><Form.Item label="Visit Date" name="warrantyEngineerVisitDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
              </>
            )}
          </Row>
          <Row gutter={16}>
            <Col span={4}><Form.Item label="Within 60 Days" name="warrantyWithin60Days" valuePropName="checked"><Switch /></Form.Item></Col>
            <Col span={4}><Form.Item label="Running Bill Deduction" name="runningBillDeduction" valuePropName="checked"><Switch /></Form.Item></Col>
          </Row>
        </>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving} disabled={!isDirty}>Save Warranty</Button>
      </Form.Item>
    </Form>
  );
};

/* ─── Stage 6: Bill Submission & Payments ──────────────────────────────────── */

export const BillPaymentSection: React.FC<Props> = ({ data, saving, onSave }) => {
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);

  const initial = {
    billUploaded: boolField(data.billUploaded),
    paymentDepartmentName: data.paymentDepartmentName ?? '',
    paymentOfficerName: data.paymentOfficerName ?? '',
    paymentOfficerContact: data.paymentOfficerContact ?? '',
    paymentStatus: data.paymentStatus ?? undefined,
    paymentRemarks: data.paymentRemarks ?? '',
    deductionReason: data.deductionReason ?? '',
    debitNoteProvided: boolField(data.debitNoteProvided),
    commissionInvoiceProvided: boolField(data.commissionInvoiceProvided),
    sdReleased: boolField(data.sdReleased),
    sdReleaseDepartmentDetails: data.sdReleaseDepartmentDetails ?? '',
  };

  return (
    <Form form={form} layout="vertical" initialValues={initial} onFinish={onSave} onValuesChange={() => setIsDirty(true)} style={{ padding: 24 }}>
      <Title level={5}>Bill Upload</Title>
      <Form.Item label="Bill Uploaded to Portal" name="billUploaded" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Divider />
      <Title level={5}>Payment Department</Title>
      <Row gutter={16}>
        <Col span={8}><Form.Item label="Department Name" name="paymentDepartmentName"><Input /></Form.Item></Col>
        <Col span={8}><Form.Item label="Officer Name" name="paymentOfficerName"><Input /></Form.Item></Col>
        <Col span={8}><Form.Item label="Officer Contact" name="paymentOfficerContact"><Input /></Form.Item></Col>
      </Row>

      <Divider />
      <Title level={5}>Payment Status</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Payment Status" name="paymentStatus">
            <Select options={[
              { value: 'full', label: 'Full Payment' },
              { value: 'partial', label: 'Partial Payment' },
              { value: 'deduction', label: 'Deduction Applied' },
            ]} />
          </Form.Item>
        </Col>
        <Col span={16}><Form.Item label="Payment Remarks" name="paymentRemarks"><Input.TextArea rows={2} /></Form.Item></Col>
      </Row>
      <Form.Item label="Deduction Reason" name="deductionReason"><Input.TextArea rows={2} /></Form.Item>

      <Divider />
      <Title level={5}>Closing Items</Title>
      <Row gutter={16}>
        <Col span={4}><Form.Item label="Debit Note Provided" name="debitNoteProvided" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={4}><Form.Item label="Commission Invoice" name="commissionInvoiceProvided" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={4}><Form.Item label="SD Released" name="sdReleased" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={12}><Form.Item label="SD Release Dept Details" name="sdReleaseDepartmentDetails"><Input /></Form.Item></Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving} disabled={!isDirty}>Save Bill & Payment</Button>
      </Form.Item>
    </Form>
  );
};

/* ─── Stage 1.5: LOA Processing ───────────────────────────────────────────── */

export const LoaProcessingSection: React.FC<Props> = ({ data, saving, onSave }) => {
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);

  const initial = {
    loaNumber: data.loaNumber ?? '',
    loaDate: data.loaDate ? dayjs(data.loaDate) : null,
    loaDocumentUrl: data.loaDocumentUrl ?? '',
    loaExcelEntryNumber: data.loaExcelEntryNumber ?? '',
    loaExcelEntryImageUrl: data.loaExcelEntryImageUrl ?? '',
    loaDeliveryMatch: boolField(data.loaDeliveryMatch),
    loaPriceMatch: boolField(data.loaPriceMatch),
    loaPackagingMatch: boolField(data.loaPackagingMatch),
    svcClauseApplicable: boolField(data.svcClauseApplicable),
    fivePercentClauseApplicable: boolField(data.fivePercentClauseApplicable),
    loaModificationAdviceRequired: boolField(data.loaModificationAdviceRequired),
    loaRemarks: data.loaRemarks ?? '',
  };

  return (
    <Form form={form} layout="vertical" initialValues={initial} onFinish={onSave} onValuesChange={() => setIsDirty(true)} style={{ padding: 24 }}>
      <Title level={5}>LOA Details</Title>
      <Row gutter={16}>
        <Col span={8}><Form.Item label="LOA Number" name="loaNumber"><Input /></Form.Item></Col>
        <Col span={8}><Form.Item label="LOA Date" name="loaDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={8}><Form.Item label="Excel Entry Number" name="loaExcelEntryNumber"><Input /></Form.Item></Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="LOA Document" name="loaDocumentUrl">
            <FileUploadField folder="loa-documents" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Excel Entry Image" name="loaExcelEntryImageUrl">
            <FileUploadField folder="loa-excel-entries" />
          </Form.Item>
        </Col>
      </Row>

      <Divider />
      <Title level={5}>Match Verification</Title>
      <Row gutter={16}>
        <Col span={4}><Form.Item label="Delivery Match" name="loaDeliveryMatch" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={4}><Form.Item label="Price Match" name="loaPriceMatch" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={4}><Form.Item label="Packaging Match" name="loaPackagingMatch" valuePropName="checked"><Switch /></Form.Item></Col>
      </Row>

      <Divider />
      <Title level={5}>Clauses</Title>
      <Row gutter={16}>
        <Col span={6}><Form.Item label="SVC Clause" name="svcClauseApplicable" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={6}><Form.Item label="5% Clause" name="fivePercentClauseApplicable" valuePropName="checked"><Switch /></Form.Item></Col>
        <Col span={6}><Form.Item label="Modification Advice Required" name="loaModificationAdviceRequired" valuePropName="checked"><Switch /></Form.Item></Col>
      </Row>

      <Form.Item label="LOA Remarks" name="loaRemarks">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving} disabled={!isDirty}>Save LOA Processing</Button>
      </Form.Item>
    </Form>
  );
};

/* ─── Stage 7: SD Return ──────────────────────────────────────────────────── */

export const SdReturnSection: React.FC<Props> = ({ data, saving, onSave }) => {
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);

  const initial = {
    sdOfficerName: data.sdOfficerName ?? '',
    sdOfficerContact: data.sdOfficerContact ?? '',
    sdOfficerEmail: data.sdOfficerEmail ?? '',
    sdReturnReceivedDate: data.sdReturnReceivedDate ? dayjs(data.sdReturnReceivedDate) : null,
    sdReturnAmount: data.sdReturnAmount ?? undefined,
    sdReturnRemarks: data.sdReturnRemarks ?? '',
  };

  return (
    <Form form={form} layout="vertical" initialValues={initial} onFinish={onSave} onValuesChange={() => setIsDirty(true)} style={{ padding: 24 }}>
      <Title level={5}>SD Officer Details</Title>
      <Row gutter={16}>
        <Col span={8}><Form.Item label="Officer Name" name="sdOfficerName"><Input /></Form.Item></Col>
        <Col span={8}><Form.Item label="Contact" name="sdOfficerContact"><Input /></Form.Item></Col>
        <Col span={8}><Form.Item label="Email" name="sdOfficerEmail"><Input type="email" /></Form.Item></Col>
      </Row>

      <Divider />
      <Title level={5}>SD Return Information</Title>
      <Row gutter={16}>
        <Col span={8}><Form.Item label="Return Received Date" name="sdReturnReceivedDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={8}><Form.Item label="Return Amount (₹)" name="sdReturnAmount"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
      </Row>
      <Form.Item label="Remarks" name="sdReturnRemarks">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving} disabled={!isDirty}>Save SD Return</Button>
      </Form.Item>
    </Form>
  );
};
