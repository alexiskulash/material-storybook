import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const VARIANTS = ['contained', 'outlined', 'text'] as const;
const COLORS   = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;
const SIZES    = ['large', 'medium', 'small'] as const;

type ButtonVariant = typeof VARIANTS[number];
type ButtonColor   = typeof COLORS[number];
type ButtonSize    = typeof SIZES[number];

// Force-simulate hover / focus styles via CSS class injection
const HoverButton = styled(Button)(() => ({
  '&.sim-hover': {
    filter: 'brightness(0.88)',
  },
}));

const FocusButton = styled(Button)(() => ({
  '&.sim-focus': {
    outline: '3px solid rgba(25, 118, 210, 0.5)',
    outlineOffset: '2px',
  },
}));

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      sx={{ color: 'text.secondary', letterSpacing: 1.5, mb: 0.5, display: 'block' }}
    >
      {children}
    </Typography>
  );
}

// ─── Row: one variant across all colors, one size, one state ─────────────────

interface ButtonRowProps {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled?: boolean;
  simHover?: boolean;
  simFocus?: boolean;
}

function ButtonRow({ variant, size, disabled, simHover, simFocus }: ButtonRowProps) {
  const className = simHover ? 'sim-hover' : simFocus ? 'sim-focus' : '';
  const Comp = simHover ? HoverButton : simFocus ? FocusButton : Button;

  return (
    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
      {COLORS.map((color) => (
        <Comp
          key={color}
          variant={variant}
          color={color}
          size={size}
          disabled={disabled}
          className={className}
        >
          Label
        </Comp>
      ))}
    </Stack>
  );
}

// ─── Group: all variants for a given size + state ─────────────────────────────

interface SizeGroupProps {
  size: ButtonSize;
  disabled?: boolean;
  simHover?: boolean;
  simFocus?: boolean;
}

function SizeGroup({ size, disabled, simHover, simFocus }: SizeGroupProps) {
  return (
    <Stack spacing={1}>
      {VARIANTS.map((variant) => (
        <ButtonRow
          key={variant}
          variant={variant}
          size={size}
          disabled={disabled}
          simHover={simHover}
          simFocus={simFocus}
        />
      ))}
    </Stack>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'outlined', 'contained'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'error', 'info', 'warning'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    disabled: { control: { type: 'boolean' } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Individual configurable story ───────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'large',
    children: 'Label',
  },
};

// ─── Full component set ───────────────────────────────────────────────────────

export const FullComponentSet: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 2 }}>

      {/* ── ENABLED ── */}
      <Box>
        <SectionLabel>Enabled</SectionLabel>
        <Stack spacing={3}>
          {SIZES.map((size) => (
            <Box key={size}>
              <Typography variant="caption" sx={{ color: 'text.disabled', mb: 0.5, display: 'block' }}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </Typography>
              <SizeGroup size={size} />
            </Box>
          ))}
        </Stack>
      </Box>

      {/* ── HOVER ── */}
      <Box>
        <SectionLabel>Hover</SectionLabel>
        <Stack spacing={3}>
          {SIZES.map((size) => (
            <Box key={size}>
              <Typography variant="caption" sx={{ color: 'text.disabled', mb: 0.5, display: 'block' }}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </Typography>
              <SizeGroup size={size} simHover />
            </Box>
          ))}
        </Stack>
      </Box>

      {/* ── FOCUSED ── */}
      <Box>
        <SectionLabel>Focused</SectionLabel>
        <Stack spacing={3}>
          {SIZES.map((size) => (
            <Box key={size}>
              <Typography variant="caption" sx={{ color: 'text.disabled', mb: 0.5, display: 'block' }}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </Typography>
              <SizeGroup size={size} simFocus />
            </Box>
          ))}
        </Stack>
      </Box>

      {/* ── DISABLED ── */}
      <Box>
        <SectionLabel>Disabled</SectionLabel>
        <Stack spacing={3}>
          {SIZES.map((size) => (
            <Box key={size}>
              <Typography variant="caption" sx={{ color: 'text.disabled', mb: 0.5, display: 'block' }}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </Typography>
              <SizeGroup size={size} disabled />
            </Box>
          ))}
        </Stack>
      </Box>

    </Box>
  ),
};

// ─── By Variant ──────────────────────────────────────────────────────────────

export const Contained: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack spacing={2}>
      {SIZES.map((size) => (
        <Stack key={size} direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          {COLORS.map((color) => (
            <Button key={color} variant="contained" color={color} size={size}>Label</Button>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const Outlined: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack spacing={2}>
      {SIZES.map((size) => (
        <Stack key={size} direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          {COLORS.map((color) => (
            <Button key={color} variant="outlined" color={color} size={size}>Label</Button>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const Text: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack spacing={2}>
      {SIZES.map((size) => (
        <Stack key={size} direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          {COLORS.map((color) => (
            <Button key={color} variant="text" color={color} size={size}>Label</Button>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

// ─── By State ────────────────────────────────────────────────────────────────

export const Enabled: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack spacing={3}>
      {SIZES.map((size) => (
        <SizeGroup key={size} size={size} />
      ))}
    </Stack>
  ),
};

export const Disabled: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack spacing={3}>
      {SIZES.map((size) => (
        <SizeGroup key={size} size={size} disabled />
      ))}
    </Stack>
  ),
};

// ─── By Size ─────────────────────────────────────────────────────────────────

export const Large: Story = {
  parameters: { layout: 'padded' },
  render: () => <SizeGroup size="large" />,
};

export const Medium: Story = {
  parameters: { layout: 'padded' },
  render: () => <SizeGroup size="medium" />,
};

export const Small: Story = {
  parameters: { layout: 'padded' },
  render: () => <SizeGroup size="small" />,
};
