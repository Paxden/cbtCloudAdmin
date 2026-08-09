/**
 * ActivityTypeChip Component
 * Displays activity type with appropriate icon and color
 * 
 * Location: src/components/packageHistory/ActivityTypeChip.jsx
 */

import { Chip } from '@mui/material';
import {
  AddBox as InstanceCreatedIcon,
  QrCode as PackageGeneratedIcon,
  Description as CandidatePapersIcon,
  CheckCircle as ValidationPassedIcon,
  Error as ValidationFailedIcon,
  Send as PackageReleasedIcon,
  Download as PackageDownloadedIcon,
  Refresh as PackageRegeneratedIcon,
  History as VersionCreatedIcon,
  Archive as VersionArchivedIcon,
  Cancel as PackageRevokedIcon,
  Delete as PackageDeletedIcon,
  Visibility as AuditViewedIcon
} from '@mui/icons-material';

const ACTIVITY_CONFIG = {
  INSTANCE_CREATED: {
    label: 'Instance Created',
    color: '#1976d2',
    bgColor: '#e3f2fd',
    icon: InstanceCreatedIcon
  },
  PACKAGE_GENERATED: {
    label: 'Package Generated',
    color: '#2e7d32',
    bgColor: '#e8f5e9',
    icon: PackageGeneratedIcon
  },
  CANDIDATE_PAPERS_GENERATED: {
    label: 'Candidate Papers Generated',
    color: '#0288d1',
    bgColor: '#e1f5fe',
    icon: CandidatePapersIcon
  },
  VALIDATION_PASSED: {
    label: 'Validation Passed',
    color: '#2e7d32',
    bgColor: '#e8f5e9',
    icon: ValidationPassedIcon
  },
  VALIDATION_FAILED: {
    label: 'Validation Failed',
    color: '#d32f2f',
    bgColor: '#ffebee',
    icon: ValidationFailedIcon
  },
  PACKAGE_RELEASED: {
    label: 'Package Released',
    color: '#ed6c02',
    bgColor: '#fff3e0',
    icon: PackageReleasedIcon
  },
  PACKAGE_DOWNLOADED: {
    label: 'Package Downloaded',
    color: '#2e7d32',
    bgColor: '#e8f5e9',
    icon: PackageDownloadedIcon
  },
  PACKAGE_REGENERATED: {
    label: 'Package Regenerated',
    color: '#ed6c02',
    bgColor: '#fff3e0',
    icon: PackageRegeneratedIcon
  },
  VERSION_CREATED: {
    label: 'Version Created',
    color: '#1976d2',
    bgColor: '#e3f2fd',
    icon: VersionCreatedIcon
  },
  VERSION_ARCHIVED: {
    label: 'Version Archived',
    color: '#6c757d',
    bgColor: '#f5f5f5',
    icon: VersionArchivedIcon
  },
  PACKAGE_REVOKED: {
    label: 'Package Revoked',
    color: '#d32f2f',
    bgColor: '#ffebee',
    icon: PackageRevokedIcon
  },
  PACKAGE_DELETED: {
    label: 'Package Deleted',
    color: '#d32f2f',
    bgColor: '#ffebee',
    icon: PackageDeletedIcon
  },
  AUDIT_VIEWED: {
    label: 'Audit Viewed',
    color: '#6c757d',
    bgColor: '#f5f5f5',
    icon: AuditViewedIcon
  }
};

const ActivityTypeChip = ({ type, size = 'medium', showIcon = true }) => {
  const config = ACTIVITY_CONFIG[type] || ACTIVITY_CONFIG.AUDIT_VIEWED;
  const IconComponent = config.icon;

  return (
    <Chip
      icon={showIcon ? <IconComponent /> : undefined}
      label={config.label}
      size={size}
      sx={{
        backgroundColor: config.bgColor,
        color: config.color,
        fontWeight: 500,
        '& .MuiChip-icon': {
          color: config.color
        }
      }}
    />
  );
};

export default ActivityTypeChip;