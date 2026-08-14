/**
 * Page Container Component
 * Wrapper for page content with consistent padding and structure
 * 
 * Key Improvements:
 * - Responsive padding
 * - Animation support
 * - Better structure
 * - Optional max-width
 * - Background support
 * - Customizable spacing
 */

import { Box, Container, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const PageContainer = ({
  children,
  maxWidth = 'xl',
  disableGutters = false,
  disableMaxWidth = false,
  sx = {},
  animate = true,
  noPadding = false,
  bgColor = 'transparent',
  minHeight = 'auto',
  ...props
}) => {
  const theme = useTheme();

  // Animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  const containerStyles = {
    px: noPadding ? 0 : { xs: 2, sm: 3, md: 4 },
    py: noPadding ? 0 : { xs: 2, sm: 3 },
    minHeight: minHeight || 'auto',
    bgcolor: bgColor,
    borderRadius: theme.shape.borderRadiusLarge,
    ...sx,
  };

  // If no max-width is needed
  if (disableMaxWidth) {
    return (
      <Box
        component={animate ? motion.div : 'div'}
        {...(animate && {
          initial: 'initial',
          animate: 'animate',
          exit: 'exit',
          variants: pageVariants,
        })}
        sx={containerStyles}
        {...props}
      >
        {children}
      </Box>
    );
  }

  return (
    <Container
      component={animate ? motion.div : 'div'}
      {...(animate && {
        initial: 'initial',
        animate: 'animate',
        exit: 'exit',
        variants: pageVariants,
      })}
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      sx={containerStyles}
      {...props}
    >
      {children}
    </Container>
  );
};

export default PageContainer;