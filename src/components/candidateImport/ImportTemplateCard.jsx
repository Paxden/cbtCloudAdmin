/**
 * Import Template Card Component
 * Displays template information and download button
 */

import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

const REQUIRED_FIELDS = [
  'Candidate Number',
  'First Name',
  'Last Name',
  'Email',
  'Phone',
];

const OPTIONAL_FIELDS = [
  'Other Name',
  'Gender',
  'Date of Birth',
  'Department',
  'Organization',
  'Rank',
  'Employee Number',
];

const ImportTemplateCard = ({
  examination,
  onDownload,
  downloading,
  format = 'xlsx',
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Import Template
        </Typography>

        <Typography variant="body2" color="textSecondary" paragraph>
          Download the template to ensure your data follows the correct format.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Required Fields
            </Typography>
            <List dense disablePadding>
              {REQUIRED_FIELDS.map((field) => (
                <ListItem key={field} disablePadding sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={field} />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Optional Fields
            </Typography>
            <List dense disablePadding>
              {OPTIONAL_FIELDS.map((field) => (
                <ListItem key={field} disablePadding sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <HelpIcon fontSize="small" color="action" />
                  </ListItemIcon>
                  <ListItemText primary={field} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Box>
            <Typography variant="caption" color="textSecondary" display="block">
              Template Version: v1.0
            </Typography>
            <Typography variant="caption" color="textSecondary" display="block">
              Last Updated: Today
            </Typography>
          </Box>

          <Tooltip title="Download template file">
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => onDownload(format)}
              disabled={!examination || downloading}
              sx={{ ml: 'auto' }}
            >
              {downloading ? 'Downloading...' : `Download Template (.${format})`}
            </Button>
          </Tooltip>
        </Stack>

        {format === 'xlsx' && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label="Recommended format for large files"
              size="small"
              color="info"
              variant="outlined"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportTemplateCard;