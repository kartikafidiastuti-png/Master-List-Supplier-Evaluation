/**
 * SCRIPT.JS
 * Pharmaceutical Supplier Management System - Application Logic
 * Handles UI interactions, form management, table rendering, and business logic
 */

// ============================================================================
// MASTER SCHEMA DEFINITIONS
// ============================================================================

const statusOptions = ["Approved-Active", "Approved-Inactive", "not approved", "Suspended"];
const traceabilityOptions = ["◯", "△", "✕", "-"];
const excipientEvalTypes = ["2026 대상 (Target 2026)", "N/A", "수시 (Ad-hoc)", "시약 (Reagent)", "신규 (New)", "정기 (Regular)"];
const excipientEvalMethods = ["N/A", "서면 (Documentary)", "시약 (Reagent)", "현장 (On-site)"];
const excipientQagReviews = ["KC", "CN", "O", "X"];
const packagingEvalTypes = ["N/A", "기승인 (Pre-approved)", "신규 (New)", "정기 (Regular)", "확인필요 (Verification Required)"];
const packagingEvalMethods = ["N/A", "서면 (Documentary)", "원격 (Remote)", "현장 (On-site)", "확인필요 (Verification Required)"];

const masterSchemas = {
  api_material: {
    title: "API Master Registry (주원료)",
    idField: "api_code",
    icon: "🧪",
    fields: [
      { id: "status", label: "Status", type: "select", options: statusOptions },
      { id: "api_code", label: "API Code *", type: "text", required: true },
      { id: "component_name", label: "Component Name / 성분명", type: "text" },
      { id: "manufacturer", label: "Manufacturer / 제조사", type: "text" },
      { id: "specification", label: "Specification / 규격", type: "text" },
      { id: "country", label: "Country / 제조국", type: "text" },
      { id: "address", label: "Address / 주소", type: "textarea" },
      { id: "supply_site", label: "Supply Site / 납품처", type: "text" },
      { id: "evaluation_report_no", label: "Evaluation Report Doc No.", type: "text" },
      { id: "evaluation_approval_date", label: "Evaluation Approval Date", type: "date" },
      { id: "audit_grade", label: "Audit Grade / 평가등급", type: "text" },
      { id: "supply_chain_traceability", label: "Supply Chain Traceability Secured? (◯ / △ / ✕ / -)", type: "select", options: traceabilityOptions },
      { id: "quality_agreement", label: "Quality Agreement Signed? (Y/N/CN)", type: "select", options: ["Y", "N", "CN"] },
      { id: "qag_change_notification_date", label: "QAG/Change Notification Date", type: "date" },
      { id: "gmp_cert_issue_date", label: "GMP Cert. Issue Date", type: "date" },
      { id: "gmp_cert_expiry_date", label: "GMP Cert. Expiry Date", type: "date" },
      { id: "key_cooperator", label: "Key Cooperator / Affiliates", type: "text" },
      { id: "contact_person", label: "Contact Person / 담당자", type: "text" },
      { id: "contact_no", label: "Contact Number / 연락처", type: "text" },
      { id: "email", label: "E-mail", type: "text" },
      { id: "memo", label: "Memo / Remarks", type: "textarea" }
    ]
  },
  excipient: {
    title: "Excipients Master Registry (부형제)",
    idField: "excipient_code",
    icon: "⚗️",
    fields: [
      { id: "status", label: "Status", type: "select", options: statusOptions },
      { id: "excipient_code", label: "Excipient Code *", type: "text", required: true },
      { id: "excipient_name", label: "Excipient Name / 원료명", type: "text" },
      { id: "manufacturer", label: "Manufacturer / 제조사", type: "text" },
      { id: "country", label: "Country / 제조국", type: "text" },
      { id: "address", label: "Address / 주소", type: "textarea" },
      { id: "site", label: "Site / 공장", type: "text" },
      { id: "qm_team_report", label: "QM Team Report", type: "text" },
      { id: "qm_report_approval_date", label: "QM Report Approval Date", type: "date" },
      { id: "previous_grade", label: "Previous Evaluation Grade", type: "text" },
      { id: "evaluation_type", label: "Evaluation Type / 평가 유형", type: "select", options: excipientEvalTypes },
      { id: "evaluation_method", label: "Evaluation Method / 평가 방법", type: "select", options: excipientEvalMethods },
      { id: "pre_approved_pr", label: "Pre-approved PR Number", type: "text" },
      { id: "qag_effective_date", label: "QAG Effective Date", type: "date" },
      { id: "quality_agreement_review", label: "Quality Agreement Document Review / 품질조정서 검토", type: "select", options: excipientQagReviews },
      { id: "special_notes", label: "Special Notes / Exceptions", type: "textarea" },
      { id: "iso_cert_issue_date", label: "ISO Cert. Issue Date", type: "date" },
      { id: "iso_cert_expiry_date", label: "ISO Cert. Expiry Date", type: "date" },
      { id: "large_classification", label: "Large Classification", type: "text" },
      { id: "medium_classification", label: "Medium Classification", type: "text" },
      { id: "criticality_class", label: "Criticality Class", type: "select", options: ["Critical", "Non-critical"] },
      { id: "justification_reason", label: "Justification Reason", type: "textarea" },
      { id: "agency", label: "Agency", type: "text" },
      { id: "contact_person", label: "Contact Person / 담당자", type: "text" },
      { id: "contact_no", label: "Contact Number / 연락처", type: "text" },
      { id: "email", label: "E-mail", type: "text" },
      { id: "memo", label: "Memo", type: "textarea" },
      { id: "doc_location", label: "Document Storage Location", type: "text" }
    ]
  },
  packaging: {
    title: "Packaging Materials Master Registry (포장자재)",
    idField: "material_code",
    icon: "📦",
    fields: [
      { id: "status", label: "Status", type: "select", options: statusOptions },
      { id: "material_code", label: "Material Code *", type: "text", required: true },
      { id: "material_name", label: "Material Name / 자재명", type: "text" },
      { id: "manufacturer", label: "Manufacturer / 제조사", type: "text" },
      { id: "country", label: "Country / 제조국", type: "text" },
      { id: "address", label: "Address / 주소", type: "textarea" },
      { id: "site", label: "Site / 공장", type: "text" },
      { id: "material_classification", label: "Material Classification", type: "text" },
      { id: "sterile_preparation_usage", label: "Used for Sterile Preparations? (Y/N)", type: "select", options: ["Y", "N"] },
      { id: "evaluation_report_no", label: "Evaluation Report No.", type: "text" },
      { id: "approval_date", label: "Approval Date", type: "date" },
      { id: "latest_evaluation", label: "Latest Evaluation Grade", type: "text" },
      { id: "evaluation_type", label: "Evaluation Type / 평가 유형", type: "select", options: packagingEvalTypes },
      { id: "evaluation_method", label: "Evaluation Method / 평가 방법", type: "select", options: packagingEvalMethods },
      { id: "pre_approved_pr", label: "Pre-approved PR Number", type: "text" },
      { id: "qag_signed", label: "QAG Concluded? (Y/N)", type: "select", options: ["Y", "N"] },
      { id: "qag_effective_date", label: "QAG Effective Date", type: "date" },
      { id: "iso_9001_expiry", label: "ISO 9001 Expiry Date", type: "date" },
      { id: "iso_13485_expiry", label: "ISO 13485 Expiry Date", type: "date" },
      { id: "iso_15378_expiry", label: "ISO 15378 Expiry Date", type: "date" },
      { id: "iso_14001_expiry", label: "ISO 14001 Expiry Date", type: "date" },
      { id: "iso_22000_expiry", label: "ISO 22000 Expiry Date", type: "date" },
      { id: "iso_45001_expiry", label: "ISO 45001 Expiry Date", type: "date" },
      { id: "fsc_cert_no", label: "FSC Cert. Authentication No.", type: "text" },
      { id: "fsc_deadline", label: "FSC Deadline Date", type: "date" },
      { id: "contact_person", label: "Contact Person / 담당자", type: "text" },
      { id: "contact_no", label: "Contact Number / 연락처", type: "text" },
      { id: "email", label: "E-mail", type: "text" },
      { id: "memo", label: "Memo / Remarks", type: "textarea" }
    ]
  },
  service_provider: {
    title: "Service Providers Master Registry (서비스업체)",
    idField: "company_name",
    icon: "🏢",
    fields: [
      { id: "classification", label: "Classification (구분)", type: "text" },
      { id: "company_name", label: "Company Name * / 업체명 *", type: "text", required: true },
      { id: "service_type", label: "Service Type / 서비스 유형", type: "text" },
      { id: "detailed_content", label: "Detailed Content Description", type: "textarea" },
      { id: "evaluation_target", label: "Subject to Evaluation? (O/X)", type: "select", options: ["O", "X"] },
      { id: "site", label: "Site / 사업장", type: "text" },
      { id: "category", label: "Category Type", type: "text" },
      { id: "vendor_status", label: "Vendor Status", type: "select", options: ["Existing Vendor", "New Vendor"] },
      { id: "contract_year", label: "Contract Year", type: "text" },
      { id: "evaluation_plan", label: "Evaluation Plan", type: "text" },
      { id: "latest_evaluation_date", label: "Latest Evaluation Date", type: "date" },
      { id: "report_info_pr", label: "Report Info (PR No.)", type: "text" },
      { id: "approval_date", label: "Approval Date", type: "date" },
      { id: "quality_agreement_effective_date", label: "Quality Agreement Effective Date", type: "date" },
      { id: "contract_period", label: "Contract Period (Dates)", type: "text" },
      { id: "evaluation_grade", label: "Evaluation Grade", type: "text" },
      { id: "contract_duration_years", label: "Contract Duration (Years)", type: "text" },
      { id: "future_supply_feasibility", label: "Future Supply Feasibility", type: "text" },
      { id: "delivery_compliance", label: "Delivery Compliance Rate / Notes", type: "text" },
      { id: "deviations_oos_complaints", label: "Deviations / OOS / Complaints Event Count", type: "text" },
      { id: "iso_certified", label: "ISO Certified? (Y/N)", type: "select", options: ["Y", "N"] },
      { id: "rating_tier", label: "Rating Tier", type: "text" },
      { id: "service_type_class", label: "Type Classification", type: "text" },
      { id: "quality_agreement_status", label: "Quality Agreement Doc Status", type: "text" },
      { id: "total_score", label: "Total Score Evaluation", type: "text" },
      { id: "risk_score", label: "Risk Factor Assessment", type: "text" },
      { id: "evaluation_cycle", label: "Evaluation Cycle Period", type: "text" },
      { id: "next_evaluation_year", label: "Next Evaluation Year", type: "text" },
      { id: "contact_person", label: "Contact Person / 담당자", type: "text" },
      { id: "contact_no", label: "Contact Number / 연락처", type: "text" },
      { id: "manufacturer_address", label: "Manufacturer Address", type: "textarea" },
      { id: "sop_service_items", label: "SOP Scope Service Items", type: "text" },
      { id: "certification_items", label: "Certification Items Approved", type: "text" },
      { id: "certification_date", label: "Certification Date", type: "date" },
      { id: "remarks", label: "Remarks / 비고", type: "textarea" }
    ]
  },
  consumable: {
    title: "Consumables Master Registry (소모품)",
    idField: "consumable_code",
    icon: "🔧",
    fields: [
      { id: "manufacturer", label: "Consumable Manufacturer / 제조사", type: "text" },
      { id: "manufacturer_address", label: "Manufacturer Address / 주소", type: "textarea" },
      { id: "kc_mark", label: "KC Certification Status", type: "text" },
      { id: "report_no", label: "Report Reference Number", type: "text" },
      { id: "approval_date", label: "Approval Date", type: "date" },
      { id: "certi_type", label: "Certificate Type Issued", type: "text" },
      { id: "certi_expiry_date", label: "Certificate Expiry Date", type: "date" },
      { id: "consumable_code", label: "Consumable Inventory Code *", type: "text", required: true },
      { id: "consumable_name", label: "Consumable Material Name / 품명", type: "text" },
      { id: "cat_no", label: "Catalog/Part Number (Cat No.)", type: "text" },
      { id: "production_team_class", label: "Production Team Category", type: "text" },
      { id: "evaluation_class", label: "Evaluation Categorization", type: "text" },
      { id: "site", label: "Operational Site", type: "text" },
      { id: "using_department", label: "Using Department / 사용부서", type: "text" },
      { id: "grade_reason", label: "Reason for Grading Assignment", type: "textarea" },
      { id: "supplier_contact", label: "Supplier Contact Information", type: "text" },
      { id: "remarks", label: "Remarks / 비고", type: "textarea" },
      { id: "storage_conditions", label: "Storage Environmental Conditions", type: "text" },
      { id: "expiry_period", label: "Expiration Period / Shelf Life", type: "text" },
      { id: "iso_status", label: "ISO Certification Holding Status", type: "select", options: ["Y", "N"] },
      { id: "iso_valid_date", label: "ISO Validity Expiry Date", type: "date" }
    ]
  }
};

let currentActiveMaster = 'api_material';

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
  updateLiveClock();
  setInterval(updateLiveClock, 1000);
  switchMaster('api_material');
});

// ============================================================================
// CLOCK FUNCTIONALITY
// ============================================================================

function updateLiveClock() {
  const now = new Date();
  const options = { month: 'short', day: '2-digit', year: 'numeric' };
  const dateString = now.toLocaleDateString('en-US', options);
  const timeString = now.toTimeString().split(' ')[0];
  
  const dateEl = document.getElementById('live-widget-date');
  const timeEl = document.getElementById('live-widget-time');
  
  if (dateEl) dateEl.innerText = dateString;
  if (timeEl) timeEl.innerText = timeString;
}

// ============================================================================
// TAB & MASTER SWITCHING
// ============================================================================

function switchMaster(masterKey) {
  currentActiveMaster = masterKey;
  
  // Update active tab
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  const buttons = document.querySelectorAll('.tab-btn');
  const indexMap = { api_material: 0, excipient: 1, packaging: 2, service_provider: 3, consumable: 4 };
  buttons[indexMap[masterKey]].classList.add('active');
  
  buildDynamicForm();
  resetForm();
  renderTable();
  renderAuditLogs();
}

// ============================================================================
// FORM MANAGEMENT
// ============================================================================

function buildDynamicForm() {
  const fieldsContainer = document.getElementById('dynamic-form-fields');
  fieldsContainer.innerHTML = '';
  const schema = masterSchemas[currentActiveMaster];
  document.getElementById('form-title').innerText = `Register / Edit Entry - ${schema.title}`;
  
  schema.fields.forEach(field => {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const label = document.createElement('label');
    label.innerText = field.label;
    group.appendChild(label);
    
    let inputElement;
    if (field.type === 'select') {
      inputElement = document.createElement('select');
      field.options.forEach(opt => {
        const optEl = document.createElement('option');
        optEl.value = opt;
        optEl.innerText = opt;
        inputElement.appendChild(optEl);
      });
    } else if (field.type === 'textarea') {
      inputElement = document.createElement('textarea');
    } else {
      inputElement = document.createElement('input');
      inputElement.type = field.type;
    }
    
    inputElement.id = `input-${field.id}`;
    group.appendChild(inputElement);
    fieldsContainer.appendChild(group);
  });
}

function resetForm() {
  document.getElementById('edit-index').value = "";
  document.getElementById('old-unique-id').value = "";
  
  const schema = masterSchemas[currentActiveMaster];
  schema.fields.forEach(f => {
    const el = document.getElementById(`input-${f.id}`);
    if (el) el.value = '';
  });
  
  document.getElementById('reason-wrapper').style.display = 'none';
  document.getElementById('form-title').innerText = `Register / Edit Entry - ${schema.title}`;
  document.getElementById('btn-submit').innerText = "Save to Master Data";
  document.getElementById('btn-cancel').style.display = 'none';
}

// ============================================================================
// TABLE RENDERING
// ============================================================================

function renderTable() {
  const schema = masterSchemas[currentActiveMaster];
  const dataList = getAllRecords(currentActiveMaster);
  const filterQuery = (document.getElementById('table-search').value || '').toLowerCase().trim();
  
  document.getElementById('table-title').innerText = `${schema.title} Data Registry View`;
  
  // Build header
  const headerRow = document.getElementById('table-header');
  headerRow.innerHTML = '';
  const thr = document.createElement('tr');
  
  schema.fields.forEach(f => {
    const th = document.createElement('th');
    th.innerText = f.label.split('/')[0].replace('*', '').trim();
    thr.appendChild(th);
  });
  
  const actionTh = document.createElement('th');
  actionTh.innerText = "System Actions";
  thr.appendChild(actionTh);
  headerRow.appendChild(thr);
  
  // Build body
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';
  let displayedCount = 0;
  
  dataList.forEach((record, index) => {
    const stringMatch = !filterQuery || Object.values(record).some(val => 
      String(val).toLowerCase().includes(filterQuery)
    );
    
    if (stringMatch) {
      displayedCount++;
      const tr = document.createElement('tr');
      
      schema.fields.forEach(f => {
        const td = document.createElement('td');
        const value = record[f.id] || '';
        
        if (f.id === 'status') {
          const lowVal = value.toLowerCase();
          if (lowVal === 'approved-active') td.innerHTML = `<span class="badge badge-approved-active">✓ Approved-Active</span>`;
          else if (lowVal === 'approved-inactive') td.innerHTML = `<span class="badge badge-approved-inactive">○ Approved-Inactive</span>`;
          else if (lowVal === 'not approved') td.innerHTML = `<span class="badge badge-not-approved">✗ not approved</span>`;
          else if (lowVal === 'suspended') td.innerHTML = `<span class="badge badge-suspended">⚠ Suspended</span>`;
          else td.innerHTML = `<span class="badge badge-default">${value}</span>`;
        } else {
          td.innerText = value;
          td.title = value;
        }
        tr.appendChild(td);
      });
      
      const actionTd = document.createElement('td');
      actionTd.style.whiteSpace = 'nowrap';
      actionTd.innerHTML = `
        <button type="button" class="action-icon-btn view-btn" onclick="triggerViewRecord(${index})" title="View Details">👁 View</button>
        <button type="button" class="action-icon-btn edit-btn" onclick="triggerEditRecord(${index})" title="Edit Record">✏️ Edit</button>
        <button type="button" class="action-icon-btn delete-btn" onclick="triggerDeleteRecord(${index})" title="Delete Record">🗑 Delete</button>
      `;
      tr.appendChild(actionTd);
      tableBody.appendChild(tr);
    }
  });
  
  document.getElementById('data-total-counter').innerText = displayedCount;
  
  if (tableBody.innerHTML === '') {
    tableBody.innerHTML = `<tr><td colspan="${schema.fields.length + 1}" style="text-align: center; color: var(--pharma-text-muted); padding: 20px;">📋 No records found. Start by adding a new entry.</td></tr>`;
  }
}

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

function executeSaveData() {
  const schema = masterSchemas[currentActiveMaster];
  const indexValue = document.getElementById('edit-index').value;
  let submittedRecord = {};
  let missingFieldLabel = null;
  
  // Collect form data
  schema.fields.forEach(f => {
    const inputEl = document.getElementById(`input-${f.id}`);
    const val = inputEl ? inputEl.value.trim() : "";
    if (f.required && !val) {
      missingFieldLabel = f.label.split('/')[0].replace('*', '').trim();
      return;
    }
    submittedRecord[f.id] = val;
  });
  
  if (missingFieldLabel) {
    showNotification(`⚠️ Required Field Missing: ${missingFieldLabel}`, 'error');
    return;
  }
  
  const uniqueRecordId = submittedRecord[schema.idField];
  
  if (indexValue === "") {
    // Create new record
    const result = createRecord(currentActiveMaster, submittedRecord, "Initial Record Creation");
    if (result.success) {
      showNotification('✓ Record created successfully', 'success');
      switchMaster(currentActiveMaster);
    } else {
      showNotification(`✗ Error: ${result.error}`, 'error');
    }
  } else {
    // Update existing record
    const modificationJustification = document.getElementById('gmp-reason').value.trim();
    if (!modificationJustification) {
      showNotification('⚠️ Reason for Modification is required', 'error');
      return;
    }
    
    const targetIndex = parseInt(indexValue);
    const result = updateRecord(currentActiveMaster, targetIndex, submittedRecord, modificationJustification);
    
    if (result.success) {
      showNotification('✓ Record updated successfully', 'success');
      switchMaster(currentActiveMaster);
    } else {
      showNotification(`✗ Error: ${result.error}`, 'error');
    }
  }
}

function triggerEditRecord(index) {
  const schema = masterSchemas[currentActiveMaster];
  const record = getRecordByIndex(currentActiveMaster, index);
  
  if (!record) {
    showNotification('✗ Record not found', 'error');
    return;
  }
  
  document.getElementById('edit-index').value = index;
  document.getElementById('old-unique-id').value = record[schema.idField];
  document.getElementById('form-title').innerText = `Amend Registry Entry Target ID: ${record[schema.idField]}`;
  
  schema.fields.forEach(f => {
    const inputEl = document.getElementById(`input-${f.id}`);
    if (inputEl) {
      inputEl.value = record[f.id] || '';
    }
  });
  
  document.getElementById('reason-wrapper').style.display = 'flex';
  document.getElementById('gmp-reason').value = '';
  document.getElementById('btn-submit').innerText = "Authorize & Apply Update Logs";
  document.getElementById('btn-cancel').style.display = 'inline-block';
  
  document.getElementById('form-container').scrollIntoView({ behavior: 'smooth' });
}

function triggerDeleteRecord(index) {
  const schema = masterSchemas[currentActiveMaster];
  const record = getRecordByIndex(currentActiveMaster, index);
  
  if (!record) {
    showNotification('✗ Record not found', 'error');
    return;
  }
  
  const recordId = record[schema.idField];
  const justification = prompt(`⚠️ Delete Confirmation\n\nAre you sure you want to delete: ${recordId}?\n\nPlease provide a reason for deletion:`);
  
  if (justification === null) return;
  if (!justification.trim()) {
    showNotification('⚠️ Deletion reason is required', 'error');
    return;
  }
  
  const result = softDeleteRecord(currentActiveMaster, index, justification);
  if (result.success) {
    showNotification('✓ Record deleted successfully (soft delete)', 'success');
    switchMaster(currentActiveMaster);
  } else {
    showNotification(`✗ Error: ${result.error}`, 'error');
  }
}

function triggerViewRecord(index) {
  const schema = masterSchemas[currentActiveMaster];
  const record = getRecordByIndex(currentActiveMaster, index);
  
  if (!record) {
    showNotification('✗ Record not found', 'error');
    return;
  }
  
  document.getElementById('modal-title').innerText = `📋 Record Details - ID: ${record[schema.idField] || 'N/A'}`;
  
  const targetDetailsContainer = document.getElementById('modal-details-container');
  targetDetailsContainer.innerHTML = '';
  
  schema.fields.forEach(f => {
    const wrapperDiv = document.createElement('div');
    wrapperDiv.className = 'detail-item';
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'detail-label';
    labelDiv.innerText = f.label;
    
    const valueDiv = document.createElement('div');
    valueDiv.className = 'detail-value';
    
    const rawValue = record[f.id];
    if (!rawValue || rawValue.trim() === '') {
      valueDiv.innerHTML = '<span style="color: #94a3b8; font-style: italic;">( No data )</span>';
    } else if (f.id === 'status') {
      valueDiv.innerHTML = `<span class="badge badge-default">${rawValue}</span>`;
    } else {
      valueDiv.innerText = rawValue;
    }
    
    wrapperDiv.appendChild(labelDiv);
    wrapperDiv.appendChild(valueDiv);
    targetDetailsContainer.appendChild(wrapperDiv);
  });
  
  document.getElementById('view-modal').style.display = 'flex';
}

function closeViewModal() {
  document.getElementById('view-modal').style.display = 'none';
}

// ============================================================================
// AUDIT TRAIL
// ============================================================================

function renderAuditLogs() {
  const auditBody = document.getElementById('audit-log-body');
  auditBody.innerHTML = '';
  
  const logs = getAuditLogs();
  logs.slice(0, 50).forEach(log => {
    const row = document.createElement('tr');
    let actCls = log.action === 'UPDATE' ? 'log-update' : 
                 (log.action === 'DELETE' ? 'log-delete' : 'log-create');
    
    row.innerHTML = `
      <td class="log-timestamp">${log.timestampLocal}</td>
      <td style="font-size: 11px; font-weight:600; color:#94a3b8;">${log.registry}</td>
      <td><span class="log-action ${actCls}">${log.action}</span></td>
      <td style="font-family: monospace; font-weight:700; color:#38bdf8;">${log.target}</td>
      <td style="font-size: 11px; color:#cbd5e1; max-width: 350px; white-space: normal; word-break: break-all;">${log.details}</td>
      <td style="font-size: 12px; font-style: italic; color:#f1f5f9;">${log.reason}</td>
    `;
    auditBody.appendChild(row);
  });
}

function toggleAuditTrail() {
  const area = document.getElementById('audit-collapse-area');
  const icon = document.getElementById('audit-toggle-icon');
  
  if (area.style.display === 'block') {
    area.style.display = 'none';
    icon.innerText = '▼';
  } else {
    area.style.display = 'block';
    icon.innerText = '▲';
    renderAuditLogs();
  }
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  if (type === 'success') {
    notification.style.backgroundColor = '#dcfce7';
    notification.style.color = '#15803d';
    notification.style.border = '1px solid #86efac';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#fee2e2';
    notification.style.color = '#b91c1c';
    notification.style.border = '1px solid #fca5a5';
  } else {
    notification.style.backgroundColor = '#dbeafe';
    notification.style.color = '#1e40af';
    notification.style.border = '1px solid #93c5fd';
  }
  
  notification.innerText = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation styles
if (!document.getElementById('notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.innerText = `
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(400px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ============================================================================
// EXPORT FUNCTIONALITY
// ============================================================================

function exportTableAsCSV() {
  const csv = exportRecordsCSV(currentActiveMaster);
  if (!csv) {
    showNotification('⚠️ No records to export', 'error');
    return;
  }
  
  const schema = masterSchemas[currentActiveMaster];
  const filename = `${schema.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(csv, filename, 'text/csv');
  showNotification('✓ Data exported as CSV', 'success');
}

function exportTableAsJSON() {
  const json = exportRecordsJSON(currentActiveMaster);
  if (!json) {
    showNotification('⚠️ No records to export', 'error');
    return;
  }
  
  const schema = masterSchemas[currentActiveMaster];
  const filename = `${schema.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
  downloadFile(json, filename, 'application/json');
  showNotification('✓ Data exported as JSON', 'success');
}

function exportAuditLogs() {
  const csv = exportAuditLogsCSV();
  const filename = `Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(csv, filename, 'text/csv');
  showNotification('✓ Audit logs exported', 'success');
}

// ============================================================================
// UTILITY EXPORTS FOR GLOBAL USE
// ============================================================================

window.executeSaveData = executeSaveData;
window.resetForm = resetForm;
window.triggerViewRecord = triggerViewRecord;
window.triggerEditRecord = triggerEditRecord;
window.triggerDeleteRecord = triggerDeleteRecord;
window.closeViewModal = closeViewModal;
window.toggleAuditTrail = toggleAuditTrail;
window.switchMaster = switchMaster;
window.renderTable = renderTable;
window.exportTableAsCSV = exportTableAsCSV;
window.exportTableAsJSON = exportTableAsJSON;
window.exportAuditLogs = exportAuditLogs;
