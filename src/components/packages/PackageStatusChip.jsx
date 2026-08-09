/**
 * Package Status Chip Component
 * 
 * Displays package status with appropriate color coding and icons
 * 
 * Props:
 * - status: Package status string
 * - size: 'small' | 'medium' (default: 'small')
 * - showIcon: boolean (default: true)
 * - variant: 'filled' | 'outlined' (default: 'filled')
 * 
 * Location: src/components/packages/PackageStatusChip.jsx
 */

import { Chip, Tooltip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Lock as LockIcon,
  Verified as VerifiedIcon,
  Download as DownloadIcon,
  CloudUpload as CloudUploadIcon,
  Build as BuildIcon,
  Description as DescriptionIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

// Status configuration
const STATUS_CONFIG = {
  // Package Lifecycle Statuses
  DRAFT: {
    label: 'Draft',
    color: 'default',
    icon: <DescriptionIcon />,
    tooltip: 'Package is in draft state',
  },
  GENERATING: {
    label: 'Generating',
    color: 'info',
    icon: <BuildIcon />,
    tooltip: 'Package is being generated',
  },
  GENERATED: {
    label: 'Generated',
    color: 'info',
    icon: <CheckCircleIcon />,
    tooltip: 'Package has been generated',
  },
  
  // Security Statuses
  ENCRYPTED: {
    label: 'Encrypted',
    color: 'info',
    icon: <LockIcon />,
    tooltip: 'Package is encrypted with AES-256-GCM',
  },
  SIGNED: {
    label: 'Signed',
    color: 'success',
    icon: <VerifiedIcon />,
    tooltip: 'Package has digital signature (Ed25519)',
  },
  VALIDATED: {
    label: 'Validated',
    color: 'success',
    icon: <VerifiedIcon />,
    tooltip: 'Package has been validated',
  },
  
  // Distribution Statuses
  READY_FOR_DISTRIBUTION: {
    label: 'Ready for Distribution',
    color: 'warning',
    icon: <CloudUploadIcon />,
    tooltip: 'Package is ready for centre distribution',
  },
  DISTRIBUTED: {
    label: 'Distributed',
    color: 'primary',
    icon: <CloudUploadIcon />,
    tooltip: 'Package has been distributed to centre',
  },
  DOWNLOADED: {
    label: 'Downloaded',
    color: 'secondary',
    icon: <DownloadIcon />,
    tooltip: 'Package has been downloaded by centre',
  },
  
  // Terminal Statuses
  EXPIRED: {
    label: 'Expired',
    color: 'warning',
    icon: <ScheduleIcon />,
    tooltip: 'Package has expired',
  },
  REVOKED: {
    label: 'Revoked',
    color: 'error',
    icon: <CancelIcon />,
    tooltip: 'Package has been revoked',
  },
  FAILED: {
    label: 'Failed',
    color: 'error',
    icon: <ErrorIcon />,
    tooltip: 'Package generation failed',
  },
  ARCHIVED: {
    label: 'Archived',
    color: 'default',
    icon: <DescriptionIcon />,
    tooltip: 'Package has been archived',
  },
  
  // Readiness Statuses
  READY_FOR_ENCRYPTION: {
    label: 'Ready for Encryption',
    color: 'info',
    icon: <LockIcon />,
    tooltip: 'Package is ready for encryption',
  },
  READY_FOR_SIGNATURE: {
    label: 'Ready for Signature',
    color: 'info',
    icon: <VerifiedIcon />,
    tooltip: 'Package is ready for digital signature',
  },
  READY_FOR_BUILD: {
    label: 'Ready for Build',
    color: 'info',
    icon: <BuildIcon />,
    tooltip: 'Package is ready for CBTX build',
  },
  BUILD_COMPLETED: {
    label: 'Build Completed',
    color: 'success',
    icon: <CheckCircleIcon />,
    tooltip: 'CBTX package has been built',
  },
  CHECKSUM_GENERATED: {
    label: 'Checksum Generated',
    color: 'success',
    icon: <VerifiedIcon />,
    tooltip: 'Package checksum has been generated (SHA-256)',
  },
  IMPORTED: {
    label: 'Imported',
    color: 'success',
    icon: <DownloadIcon />,
    tooltip: 'Package has been imported at centre',
  },
  ACTIVATED: {
    label: 'Activated',
    color: 'success',
    icon: <CheckCircleIcon />,
    tooltip: 'Package is activated for examination',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'success',
    icon: <CheckCircleIcon />,
    tooltip: 'Package has been completed',
  },
  
  // Version Statuses
  PENDING: {
    label: 'Pending',
    color: 'warning',
    icon: <PendingIcon />,
    tooltip: 'Operation is pending',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'info',
    icon: <HourglassEmptyIcon />,
    tooltip: 'Operation is in progress',
  },
  INVALID: {
    label: 'Invalid',
    color: 'error',
    icon: <WarningIcon />,
    tooltip: 'Package is invalid',
  },
};

// Default config for unknown statuses
const DEFAULT_CONFIG = {
  label: 'Unknown',
  color: 'default',
  icon: <DescriptionIcon />,
  tooltip: 'Unknown status',
};

const PackageStatusChip = ({
  status,
  size = 'small',
  showIcon = true,
  variant = 'filled',
  onClick,
  ...props
}) => {
  const config = STATUS_CONFIG[status] || DEFAULT_CONFIG;
  
  // Determine if the chip should be clickable
  const isClickable = !!onClick;

  return (
    <Tooltip title={config.tooltip} arrow>
      <Chip
        label={config.label}
        color={config.color}
        size={size}
        variant={variant}
        icon={showIcon ? config.icon : undefined}
        onClick={onClick}
        clickable={isClickable}
        sx={{
          fontWeight: 500,
          '& .MuiChip-icon': {
            fontSize: size === 'small' ? '0.9rem' : '1.1rem',
          },
          ...(variant === 'outlined' && {
            borderColor: config.color ? undefined : '#e0e0e0',
          }),
          ...props.sx,
        }}
        {...props}
      />
    </Tooltip>
  );
};

export default PackageStatusChip;