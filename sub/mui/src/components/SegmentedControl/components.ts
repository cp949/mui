import type { Theme, TypographyProps } from '@mui/material';
import { Box, styled, type BoxProps } from '@mui/material';
import type { ComponentType } from 'react';

export const SegmentedControlRoot: ComponentType<BoxProps> = styled(Box)<BoxProps>(({ theme }) => {
  return {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'row',
    width: 'auto',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    padding: '0.25rem',
    backgroundColor: '#f1f3f5',

    '&[data-vertical="true"]': {
      display: 'flex',
      flexDirection: 'column',
      width: 'max-content',
    },

    '&[data-fullwidth="true"]': {
      display: 'flex',
      width: 'auto',
    },

    '&[data-size="small"]': {
      padding: '0.15rem',
    },
    '&[data-size="large"]': {
      padding: '0.35rem',
    },
  };
});
SegmentedControlRoot.displayName = 'SegmentedControlRoot';

export const SegmentedControlItem: ComponentType<
  BoxProps & {
    transitionDuration?: number;
    transitionTimingFunction?: string;
  }
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'transitionDuration' && prop !== 'transitionTimingFunction',
})<
  BoxProps & {
    transitionDuration?: number;
    transitionTimingFunction?: string;
  }
>(({ theme, transitionDuration = 150, transitionTimingFunction = 'ease' }) => {
  return {
    position: 'relative',
    flex: 1,
    zIndex: 2,
    transition: `border-color ${transitionDuration}ms ${transitionTimingFunction}`,

    '.SegmentedControl-root[data-with-item-border="true"] &::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      insetInlineStart: 0,
      backgroundColor: theme.palette.divider,
      width: '1px',
      transition: `background-color ${transitionDuration}ms ${transitionTimingFunction}`,
    },

    '.SegmentedControl-root[data-with-item-border="true"] &:first-of-type::before': {
      backgroundColor: 'transparent',
    },

    '.SegmentedControl-root[data-vertical="true"] &::before': {
      top: 0,
      insetInline: 0,
      bottom: 'auto',
      height: '1px',
      width: 'auto',
    },
  };
});

SegmentedControlItem.displayName = 'SegmentedControlItem';

export const SegmentedControlInput: ComponentType<BoxProps<'input'>> = styled(Box)<
  BoxProps<'input'>
>(() => ({
  height: 0,
  width: 0,
  position: 'absolute',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  opacity: 0,
}));

SegmentedControlInput.displayName = 'SegmentedControlInput';

function resolveColor(theme: Theme, color: TypographyProps['color']) {
  if (!color) return undefined;
  let c = color;
  if (['primary', 'secondary', 'info', 'warning', 'error', 'success'].includes(c)) {
    c = theme.palette[c].main;
  } else if (['textPrimary', 'textSecondary', 'textDisabled'].includes(c)) {
    c = theme.palette.text[c.substring(4).toLowerCase()];
  }
  return c ? c : color;
}

export const SegmentedControlLabel: ComponentType<
  BoxProps<'label'> & {
    primaryColor?: string;
    secondaryColor?: string;
    transitionDuration?: number;
    transitionTimingFunction?: string;
  }
> = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'transitionDuration' &&
    prop !== 'transitionTimingFunction' &&
    prop !== 'primaryColor' &&
    prop !== 'secondaryColor',
})<
  BoxProps<'label'> & {
    primaryColor?: string;
    secondaryColor?: string;
    transitionDuration?: number;
    transitionTimingFunction?: string;
  }
>(({
  theme,
  transitionDuration = 150,
  transitionTimingFunction = 'ease',
  primaryColor,
  secondaryColor,
}) => {
  const _primaryColor = resolveColor(theme, primaryColor) ?? theme.palette.primary.main;
  const _secondaryColor = resolveColor(theme, secondaryColor) ?? theme.palette.text.secondary;

  return {
    fontWeight: 500,
    display: 'block',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    userSelect: 'none',
    borderRadius: 1,
    padding: '0.3125rem 0.625rem',
    fontSize: theme.typography.body1.fontSize,
    cursor: 'pointer',
    color: _secondaryColor,
    transition: `color ${transitionDuration}ms ${transitionTimingFunction}`,

    '.SegmentedControl-item.Mui-active > &&': {
      color: _primaryColor,
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        zIndex: 0,
      },
    },

    '.SegmentedControl-item.Mui-readOnly > &&': {
      cursor: 'default',
    },

    '.SegmentedControl-item.Mui-disabled > &&': {
      cursor: 'not-allowed',
      color: theme.palette.text.disabled,
      opacity: 0.7,
    },

    '.SegmentedControl-root[data-size="small"] &': {
      padding: '0.2rem 0.4rem',
      fontSize: '0.7rem',
    },
    '.SegmentedControl-root[data-size="large"] &': {
      padding: '0.4rem 0.8rem',
      fontSize: theme.typography.subtitle1.fontSize,
    },
  };
});

SegmentedControlLabel.displayName = 'SegmentedControlLabel';
