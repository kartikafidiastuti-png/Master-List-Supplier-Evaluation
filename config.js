/**
 * CONFIG.JS
 * Pharmaceutical Supplier Management System - Configuration
 * Centralized configuration for the application
 */

// ============================================================================
// APPLICATION CONFIGURATION
// ============================================================================

const APP_CONFIG = {
  // Application Info
  name: 'Pharmaceutical Supplier Master List',
  version: '2.0.0',
  environment: 'production', // 'development' | 'staging' | 'production'
  
  // Feature Flags
  features: {
    enableAutoSave: true,
    enableAutoBackup: true,
    enableBulkOperations: true,
    enableExportImport: true,
    enableNotifications: true,
    enableAuditTrail: true
  },
  
  // Storage Configuration
  storage: {
    primaryStore: 'pharma_multi_db',
    auditStore: 'pharma_multi_logs',
    deletedRecordsStore: 'pharma_multi_deleted',
    backupIntervalMs: 300000, // 5 minutes
    maxBackups: 10
  },
  
  // UI Configuration
  ui: {
    pageSize: 50,
    notificationDuration: 3000, // milliseconds
    modalAnimationDuration: 300, // milliseconds
    searchDebounceDelay: 300 // milliseconds
  },
  
  // Validation Rules
  validation: {
    minRecordNameLength: 2,
    maxRecordNameLength: 255,
    maxDescriptionLength: 5000,
    dateFormat: 'YYYY-MM-DD',
    requiredFields: {
      api_material: ['api_code'],
      excipient: ['excipient_code'],
      packaging: ['material_code'],
      service_provider: ['company_name'],
      consumable: ['consumable_code']
    }
  },
  
  // Compliance Configuration
  compliance: {
    cfr21Part11: true,
    enableAuditLog: true,
    requireModificationReason: true,
    enableSoftDelete: true,
    enableRecovery: true,
    trackUserActions: true
  },
  
  // Notification Settings
  notifications: {
    showSuccessMessages: true,
    showErrorMessages: true,
    showWarningMessages: true,
    showInfoMessages: true,
    position: 'top-right' // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  }
};

// ============================================================================
// MASTER TYPE CONFIGURATIONS
// ============================================================================

const MASTER_TYPES = {
  API_MATERIAL: {
    key: 'api_material',
    name: 'API Materials',
    nameKo: '주원료',
    icon: '🧪',
    description: 'Active Pharmaceutical Ingredients',
    color: '#003366'
  },
  EXCIPIENT: {
    key: 'excipient',
    name: 'Excipients',
    nameKo: '부형제',
    icon: '⚗️',
    description: 'Pharmaceutical Excipients',
    color: '#0891b2'
  },
  PACKAGING: {
    key: 'packaging',
    name: 'Packaging Materials',
    nameKo: '포장자재',
    icon: '📦',
    description: 'Packaging Materials',
    color: '#7c3aed'
  },
  SERVICE_PROVIDER: {
    key: 'service_provider',
    name: 'Service Providers',
    nameKo: '서비스업체',
    icon: '🏢',
    description: 'Service Provider Companies',
    color: '#ea580c'
  },
  CONSUMABLE: {
    key: 'consumable',
    name: 'Consumables',
    nameKo: '소모품',
    icon: '🔧',
    description: 'Consumable Items',
    color: '#059669'
  }
};

// ============================================================================
// STATUS DEFINITIONS
// ============================================================================

const STATUS_DEFINITIONS = {
  APPROVED_ACTIVE: {
    key: 'Approved-Active',
    label: 'Approved-Active',
    icon: '✓',
    color: '#dcfce7',
    textColor: '#15803d',
    borderColor: '#bbf7d0',
    description: 'Approved and currently active supplier'
  },
  APPROVED_INACTIVE: {
    key: 'Approved-Inactive',
    label: 'Approved-Inactive',
    icon: '○',
    color: '#f1f5f9',
    textColor: '#475569',
    borderColor: '#e2e8f0',
    description: 'Approved but currently inactive'
  },
  NOT_APPROVED: {
    key: 'not approved',
    label: 'not approved',
    icon: '✗',
    color: '#fee2e2',
    textColor: '#b91c1c',
    borderColor: '#fecaca',
    description: 'Supplier not approved'
  },
  SUSPENDED: {
    key: 'Suspended',
    label: 'Suspended',
    icon: '⚠',
    color: '#fef3c7',
    textColor: '#d97706',
    borderColor: '#fde68a',
    description: 'Supplier suspended'
  }
};

// ============================================================================
// AUDIT ACTION TYPES
// ============================================================================

const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  RESTORE: 'RESTORE',
  IMPORT: 'IMPORT',
  EXPORT: 'EXPORT',
  BULK_DELETE: 'BULK_DELETE',
  BULK_UPDATE: 'BULK_UPDATE'
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

const ERROR_MESSAGES = {
  INVALID_MASTER_TYPE: 'Invalid master type selected',
  RECORD_NOT_FOUND: 'Record not found in database',
  MISSING_REQUIRED_FIELD: 'Required field is missing',
  INVALID_DATE_FORMAT: 'Invalid date format',
  STORAGE_QUOTA_EXCEEDED: 'Browser storage quota exceeded',
  OPERATION_FAILED: 'Operation failed, please try again',
  INVALID_INPUT: 'Invalid input provided',
  DUPLICATE_RECORD: 'Record already exists'
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

const SUCCESS_MESSAGES = {
  RECORD_CREATED: 'Record created successfully',
  RECORD_UPDATED: 'Record updated successfully',
  RECORD_DELETED: 'Record deleted successfully',
  RECORD_RESTORED: 'Record restored successfully',
  DATA_EXPORTED: 'Data exported successfully',
  DATA_IMPORTED: 'Data imported successfully',
  BULK_OPERATION_COMPLETED: 'Bulk operation completed'
};

// ============================================================================
// THEME COLORS
// ============================================================================

const THEME = {
  primary: '#003366',
  secondary: '#0891b2',
  accent: '#7c3aed',
  success: '#15803d',
  warning: '#d97706',
  danger: '#b91c1c',
  info: '#1e40af',
  
  background: {
    primary: '#ffffff',
    secondary: '#f4f6f9',
    tertiary: '#f8fafc'
  },
  
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    muted: '#94a3b8'
  },
  
  border: '#cbd5e1'
};

// ============================================================================
// DATE & TIME CONFIGURATION
// ============================================================================

const DATE_TIME_CONFIG = {
  locale: 'en-US',
  dateFormat: 'MMM DD, YYYY',
  timeFormat: 'HH:mm:ss',
  timezone: 'UTC'
};

// ============================================================================
// EXPORT & IMPORT CONFIGURATION
// ============================================================================

const EXPORT_IMPORT_CONFIG = {
  supportedFormats: ['csv', 'json'],
  maxFileSize: 5242880, // 5MB
  encoding: 'utf-8',
  csvDelimiter: ',',
  jsonSpaces: 2
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get master type configuration
 */
function getMasterTypeConfig(masterKey) {
  const configs = Object.values(MASTER_TYPES);
  return configs.find(cfg => cfg.key === masterKey);
}

/**
 * Get status configuration
 */
function getStatusConfig(statusKey) {
  const configs = Object.values(STATUS_DEFINITIONS);
  return configs.find(cfg => cfg.key === statusKey);
}

/**
 * Check if feature is enabled
 */
function isFeatureEnabled(featureName) {
  return APP_CONFIG.features[featureName] === true;
}

/**
 * Get validation rule
 */
function getValidationRule(masterType, fieldName) {
  return APP_CONFIG.validation[fieldName];
}

// ============================================================================
// ENVIRONMENT-SPECIFIC SETTINGS
// ============================================================================

if (APP_CONFIG.environment === 'development') {
  APP_CONFIG.ui.notificationDuration = 5000;
  APP_CONFIG.storage.backupIntervalMs = 60000; // 1 minute for easier testing
}

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================

// Make config globally accessible
window.APP_CONFIG = APP_CONFIG;
window.MASTER_TYPES = MASTER_TYPES;
window.STATUS_DEFINITIONS = STATUS_DEFINITIONS;
window.AUDIT_ACTIONS = AUDIT_ACTIONS;
window.ERROR_MESSAGES = ERROR_MESSAGES;
window.SUCCESS_MESSAGES = SUCCESS_MESSAGES;
window.THEME = THEME;

// Export functions
window.getMasterTypeConfig = getMasterTypeConfig;
window.getStatusConfig = getStatusConfig;
window.isFeatureEnabled = isFeatureEnabled;
window.getValidationRule = getValidationRule;
