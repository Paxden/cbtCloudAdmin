/* eslint-disable no-unused-vars */
/**
 * Candidate Profile Card Component
 * Displays candidate profile information
 */

import { Box, Card, CardContent, Typography, Stack, Chip, Avatar, Divider } from '@mui/material';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import CandidateStatusChip from './CandidateStatusChip';

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
    <Typography variant="body2" color="textSecondary">{label}</Typography>
    <Typography variant="body2" fontWeight={500}>{value || '-'}</Typography>
  </Box>
);

const CandidateProfileCard = ({ candidate, loading }) => {
  if (loading || !candidate) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading profile...</Typography>
        </CardContent>
      </Card>
    );
  }

  const fullName = [candidate.firstName, candidate.otherName, candidate.lastName]
    .filter(Boolean)
    .join(' ');

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
            {candidate.firstName?.[0] || <PersonIcon />}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {fullName || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="textSecondary" fontFamily="monospace">
              {candidate.candidateNumber || 'N/A'}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <CandidateStatusChip
                status={candidate.isDeleted ? 'DELETED' : candidate.status}
                size="medium"
              />
            </Box>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Contact Information
        </Typography>
        <InfoRow label="Email" value={candidate.email} />
        <InfoRow label="Phone" value={candidate.phone} />
        <InfoRow label="Gender" value={candidate.gender?.toLowerCase() || 'N/A'} />
        <InfoRow
          label="Date of Birth"
          value={candidate.dateOfBirth ? format(new Date(candidate.dateOfBirth), 'dd/MM/yyyy') : 'N/A'}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Professional Information
        </Typography>
        <InfoRow label="Department" value={candidate.department} />
        <InfoRow label="Organization" value={candidate.organization} />
        <InfoRow label="Rank" value={candidate.rank} />
        <InfoRow label="Employee Number" value={candidate.employeeNumber} />

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Examination Information
        </Typography>
        <InfoRow
          label="Examination"
          value={candidate.examinationId?.name || 'N/A'}
        />
        <InfoRow
          label="Examination Code"
          value={candidate.examinationId?.code || 'N/A'}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Audit Information
        </Typography>
        <InfoRow
          label="Created At"
          value={candidate.createdAt ? format(new Date(candidate.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
        />
        <InfoRow
          label="Created By"
          value={candidate.createdBy?.name || 'N/A'}
        />
        <InfoRow
          label="Last Updated"
          value={candidate.updatedAt ? format(new Date(candidate.updatedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
        />
        <InfoRow
          label="Last Updated By"
          value={candidate.updatedBy?.name || 'N/A'}
        />

        {candidate.isDeleted && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={600} gutterBottom color="error">
              Deleted Information
            </Typography>
            <InfoRow
              label="Deleted At"
              value={candidate.deletedAt ? format(new Date(candidate.deletedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
            />
            <InfoRow
              label="Deleted By"
              value={candidate.deletedBy?.name || 'N/A'}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CandidateProfileCard;