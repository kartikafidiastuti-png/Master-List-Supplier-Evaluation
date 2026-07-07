/**
 * DATABASE.JS
 * Pharmaceutical Supplier Management System - Data Layer
 * Handles all data operations, LocalStorage management, and audit logging
 * 21 CFR Part 11 Compliant
 */

// ============================================================================
// DATABASE CONFIGURATION & INITIALIZATION
// ============================================================================

const DB_CONFIG = {
  PRIMARY_STORE: 'pharma_multi_db',
  AUDIT_STORE: 'pharma_multi_logs',
  DELETED_RECORDS_STORE: 'pharma_multi_deleted',
  VERSION: '2.0',
  BACKUP_INTERVAL: 300000 // 5 minutes
};

// Initialize database structure
let database = (() => {
  const stored = localStorage.getItem(DB_CONFIG.PRIMARY_STORE);
  return stored ? JSON.parse(stored) : {
    api_material: [],
    excipient: [],
    packaging: [],
    service_provider: [],
    consumable: []
  };
})();

let systemAuditLogs = (() => {
  const stored = localStorage.getItem(DB_CONFIG.AUDIT_STORE);
  return stored ? JSON.parse(stored) : [{
    id: generateUUID(),
    timestamp: new Date().toISOString(),
    timestampLocal: new Date().toLocaleString(),
    registry: "System Management",
    action: "CREATE",
    target: "SYS-INIT",
    details: "System initialized - Application version 2.0",
    reason: "System Deployment",
    userId: "SYSTEM",
    computerName: "localhost",
    ipAddress: "127.0.0.1"
  }];
})();

let deletedRecords = (() => {
  const stored = localStorage.getItem(DB_CONFIG.DELETED_RECORDS_STORE);
  return stored ? JSON.parse(stored) : [];
})();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate UUID for audit trail records
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Save all data to LocalStorage
 */
function saveToLocalStorage() {
  try {
    localStorage.setItem(DB_CONFIG.PRIMARY_STORE, JSON.stringify(database));
    localStorage.setItem(DB_CONFIG.AUDIT_STORE, JSON.stringify(systemAuditLogs));
    localStorage.setItem(DB_CONFIG.DELETED_RECORDS_STORE, JSON.stringify(deletedRecords));
    return true;
  } catch (e) {
    console.error('LocalStorage save failed:', e);
    return false;
  }
}

/**
 * Create automatic backup of database
 */
function createBackup() {
  const backup = {
    timestamp: new Date().toISOString(),
    data: database,
    auditLogs: systemAuditLogs,
    deletedRecords: deletedRecords
  };
  localStorage.setItem(`backup_${Date.now()}`, JSON.stringify(backup));
}

/**
 * Get database statistics
 */
function getDatabaseStats() {
  const stats = {};
  for (const [key, value] of Object.entries(database)) {
    stats[key] = {
      total: value.length,
      approved: value.filter(r => r.status === 'Approved-Active').length,
      pending: value.filter(r => r.status === 'not approved').length,
      inactive: value.filter(r => r.status === 'Approved-Inactive').length,
      suspended: value.filter(r => r.status === 'Suspended').length
    };
  }
  return stats;
}

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

/**
 * Add new record to master list
 * @param {string} masterType - Type of master (api_material, excipient, etc.)
 * @param {object} recordData - Record data object
 * @param {string} reason - Reason for creation
 * @returns {object} - Result object with success status and message
 */
function createRecord(masterType, recordData, reason = "Initial Record Creation") {
  try {
    if (!database[masterType]) {
      return { success: false, error: `Invalid master type: ${masterType}` };
    }

    // Add record
    database[masterType].push(recordData);

    // Log audit trail
    const auditEntry = {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      timestampLocal: new Date().toLocaleString(),
      registry: masterType,
      action: "CREATE",
      target: recordData.api_code || recordData.excipient_code || recordData.material_code || recordData.company_name || recordData.consumable_code,
      details: `Created new record: ${JSON.stringify(recordData)}`,
      reason: reason,
      userId: sessionStorage.getItem('userId') || 'UNKNOWN',
      computerName: "Browser Session",
      ipAddress: "Client"
    };
    systemAuditLogs.unshift(auditEntry);

    saveToLocalStorage();
    return { success: true, message: "Record created successfully" };
  } catch (e) {
    console.error('Create record error:', e);
    return { success: false, error: e.message };
  }
}

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Get all records from a master type
 */
function getAllRecords(masterType) {
  return database[masterType] || [];
}

/**
 * Get record by index
 */
function getRecordByIndex(masterType, index) {
  return database[masterType]?.[index] || null;
}

/**
 * Search records
 */
function searchRecords(masterType, query) {
  const records = database[masterType] || [];
  const lowerQuery = query.toLowerCase();
  return records.filter(record =>
    Object.values(record).some(val =>
      String(val).toLowerCase().includes(lowerQuery)
    )
  );
}

/**
 * Filter records by status
 */
function filterByStatus(masterType, status) {
  const records = database[masterType] || [];
  return records.filter(r => r.status === status);
}

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Update existing record
 */
function updateRecord(masterType, index, updatedData, reason = "Record Modified") {
  try {
    if (!database[masterType] || !database[masterType][index]) {
      return { success: false, error: "Record not found" };
    }

    const originalRecord = database[masterType][index];
    const schema = masterSchemas[masterType];
    const idField = schema.idField;
    const recordId = originalRecord[idField];

    // Track changes
    const changes = [];
    for (const key in updatedData) {
      if (originalRecord[key] !== updatedData[key]) {
        changes.push({
          field: key,
          oldValue: originalRecord[key] || 'EMPTY',
          newValue: updatedData[key]
        });
      }
    }

    // Update record
    database[masterType][index] = updatedData;

    // Log audit trail
    const auditEntry = {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      timestampLocal: new Date().toLocaleString(),
      registry: masterType,
      action: "UPDATE",
      target: recordId,
      details: `Updated fields: ${changes.map(c => `${c.field}: "${c.oldValue}" → "${c.newValue}"`).join('; ')}`,
      reason: reason,
      userId: sessionStorage.getItem('userId') || 'UNKNOWN',
      computerName: "Browser Session",
      ipAddress: "Client",
      changes: changes
    };
    systemAuditLogs.unshift(auditEntry);

    saveToLocalStorage();
    return { success: true, message: "Record updated successfully", changes: changes };
  } catch (e) {
    console.error('Update record error:', e);
    return { success: false, error: e.message };
  }
}

// ============================================================================
// DELETE OPERATIONS (Logical Delete)
// ============================================================================

/**
 * Soft delete - move to deleted records but keep in audit log
 */
function softDeleteRecord(masterType, index, reason = "Record Deleted") {
  try {
    if (!database[masterType] || !database[masterType][index]) {
      return { success: false, error: "Record not found" };
    }

    const record = database[masterType][index];
    const schema = masterSchemas[masterType];
    const recordId = record[schema.idField];

    // Store deleted record
    deletedRecords.push({
      deletedAt: new Date().toISOString(),
      masterType: masterType,
      recordId: recordId,
      data: record,
      reason: reason,
      userId: sessionStorage.getItem('userId') || 'UNKNOWN'
    });

    // Log audit trail
    const auditEntry = {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      timestampLocal: new Date().toLocaleString(),
      registry: masterType,
      action: "DELETE",
      target: recordId,
      details: `Soft deleted record - data preserved in deletion log`,
      reason: reason,
      userId: sessionStorage.getItem('userId') || 'UNKNOWN',
      computerName: "Browser Session",
      ipAddress: "Client"
    };
    systemAuditLogs.unshift(auditEntry);

    // Remove from active database
    database[masterType].splice(index, 1);

    saveToLocalStorage();
    return { success: true, message: "Record deleted successfully (soft delete)" };
  } catch (e) {
    console.error('Delete record error:', e);
    return { success: false, error: e.message };
  }
}

/**
 * Restore deleted record
 */
function restoreDeletedRecord(recordId, masterType) {
  try {
    const index = deletedRecords.findIndex(r => r.recordId === recordId && r.masterType === masterType);
    if (index === -1) {
      return { success: false, error: "Deleted record not found" };
    }

    const deletedRecord = deletedRecords[index];
    database[masterType].push(deletedRecord.data);

    // Log audit trail
    const auditEntry = {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      timestampLocal: new Date().toLocaleString(),
      registry: masterType,
      action: "RESTORE",
      target: recordId,
      details: `Restored previously deleted record`,
      reason: "Record Restoration",
      userId: sessionStorage.getItem('userId') || 'UNKNOWN'
    };
    systemAuditLogs.unshift(auditEntry);

    deletedRecords.splice(index, 1);
    saveToLocalStorage();
    return { success: true, message: "Record restored successfully" };
  } catch (e) {
    console.error('Restore record error:', e);
    return { success: false, error: e.message };
  }
}

// ============================================================================
// AUDIT TRAIL OPERATIONS
// ============================================================================

/**
 * Get all audit logs
 */
function getAuditLogs(filter = {}) {
  let logs = [...systemAuditLogs];

  if (filter.action) {
    logs = logs.filter(l => l.action === filter.action);
  }
  if (filter.registry) {
    logs = logs.filter(l => l.registry === filter.registry);
  }
  if (filter.startDate) {
    logs = logs.filter(l => new Date(l.timestamp) >= new Date(filter.startDate));
  }
  if (filter.endDate) {
    logs = logs.filter(l => new Date(l.timestamp) <= new Date(filter.endDate));
  }

  return logs;
}

/**
 * Export audit logs to CSV
 */
function exportAuditLogsCSV() {
  const headers = ['Timestamp', 'Registry', 'Action', 'Record ID', 'Details', 'Reason', 'User ID'];
  const rows = systemAuditLogs.map(log => [
    log.timestampLocal,
    log.registry,
    log.action,
    log.target,
    log.details,
    log.reason,
    log.userId
  ]);

  let csv = headers.join(',') + '\n';
  rows.forEach(row => {
    csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
  });

  return csv;
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Bulk delete records
 */
function bulkDeleteRecords(masterType, indices, reason = "Bulk deletion") {
  try {
    const sorted = indices.sort((a, b) => b - a); // Sort descending to avoid index shift
    const results = [];

    for (const index of sorted) {
      const result = softDeleteRecord(masterType, index, reason);
      results.push(result);
    }

    return { success: true, message: `${results.length} records deleted`, results };
  } catch (e) {
    console.error('Bulk delete error:', e);
    return { success: false, error: e.message };
  }
}

/**
 * Bulk update records
 */
function bulkUpdateRecords(masterType, indices, updateData, reason = "Bulk update") {
  try {
    const results = [];

    for (const index of indices) {
      const currentRecord = database[masterType][index];
      const merged = { ...currentRecord, ...updateData };
      const result = updateRecord(masterType, index, merged, reason);
      results.push(result);
    }

    return { success: true, message: `${results.length} records updated`, results };
  } catch (e) {
    console.error('Bulk update error:', e);
    return { success: false, error: e.message };
  }
}

// ============================================================================
// EXPORT OPERATIONS
// ============================================================================

/**
 * Export records to CSV
 */
function exportRecordsCSV(masterType) {
  const records = database[masterType] || [];
  if (records.length === 0) {
    return null;
  }

  const headers = Object.keys(records[0]);
  let csv = headers.join(',') + '\n';

  records.forEach(record => {
    const row = headers.map(header => {
      const value = record[header] || '';
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csv += row.join(',') + '\n';
  });

  return csv;
}

/**
 * Export records to JSON
 */
function exportRecordsJSON(masterType) {
  const records = database[masterType] || [];
  return JSON.stringify(records, null, 2);
}

/**
 * Trigger file download
 */
function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================================
// IMPORT OPERATIONS
// ============================================================================

/**
 * Import records from JSON
 */
function importRecordsJSON(masterType, jsonContent, mergeMode = false) {
  try {
    const records = JSON.parse(jsonContent);
    
    if (!Array.isArray(records)) {
      return { success: false, error: "Invalid JSON format - expected array" };
    }

    if (!mergeMode) {
      database[masterType] = [];
    }

    records.forEach(record => {
      database[masterType].push(record);
      const auditEntry = {
        id: generateUUID(),
        timestamp: new Date().toISOString(),
        timestampLocal: new Date().toLocaleString(),
        registry: masterType,
        action: "IMPORT",
        target: record.api_code || record.excipient_code || record.material_code || record.company_name || record.consumable_code,
        details: `Imported record from JSON`,
        reason: "Data Import",
        userId: sessionStorage.getItem('userId') || 'UNKNOWN'
      };
      systemAuditLogs.unshift(auditEntry);
    });

    saveToLocalStorage();
    return { success: true, message: `${records.length} records imported successfully` };
  } catch (e) {
    console.error('Import JSON error:', e);
    return { success: false, error: e.message };
  }
}

// ============================================================================
// AUTO-SAVE FUNCTIONALITY
// ============================================================================

// Auto-save every 5 minutes
setInterval(() => {
  saveToLocalStorage();
  createBackup();
}, DB_CONFIG.BACKUP_INTERVAL);

// Save before page unload
window.addEventListener('beforeunload', () => {
  saveToLocalStorage();
});
