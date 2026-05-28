import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const CSPersonalPreset = definePreset(Aura, {
  components: {
    menubar: {
      root: {
        background: 'var(--color-surface)',
        borderColor: 'var(--color-accent2)',
        color: 'var(--color-text)',
      },
      item: {
        color: 'var(--color-text-light)',
        focusBackground: 'var(--color-accent2)',
        activeBackground: 'var(--color-accent2)',
        focusColor: 'var(--color-primary)',
        activeColor: 'var(--color-primary)',
        icon: {
          color: 'var(--color-text-dark)',
          focusColor: 'var(--color-primary)',
          activeColor: 'var(--color-primary)',
        },
      },
      submenu: {
        background: 'var(--color-surface)',
        borderColor: 'var(--color-accent2)',
      },
    },
    toast: {
      colorScheme: {
        light: {
          info: {
            background: 'color-mix(in srgb, var(--color-secondary), transparent 84%)',
            borderColor: 'color-mix(in srgb, var(--color-secondary), transparent 50%)',
            color: 'var(--color-secondary)',
            detailColor: 'var(--color-text)',
            shadow: '0px 4px 12px 0px color-mix(in srgb, var(--color-secondary), transparent 80%)',
            closeButton: {
              hoverBackground: 'color-mix(in srgb, var(--color-secondary), transparent 85%)',
              focusRing: { color: 'var(--color-secondary)', shadow: 'none' },
            },
          },
          success: {
            background: 'color-mix(in srgb, var(--success), transparent 84%)',
            borderColor: 'color-mix(in srgb, var(--success), transparent 50%)',
            color: 'var(--success)',
            detailColor: 'var(--color-text)',
            shadow: '0px 4px 12px 0px color-mix(in srgb, var(--success), transparent 80%)',
            closeButton: {
              hoverBackground: 'color-mix(in srgb, var(--success), transparent 85%)',
              focusRing: { color: 'var(--success)', shadow: 'none' },
            },
          },
          warn: {
            background: 'color-mix(in srgb, var(--color-warning), transparent 84%)',
            borderColor: 'color-mix(in srgb, var(--color-warning), transparent 50%)',
            color: 'var(--color-warning)',
            detailColor: 'var(--color-text)',
            shadow: '0px 4px 12px 0px color-mix(in srgb, var(--color-warning), transparent 80%)',
            closeButton: {
              hoverBackground: 'color-mix(in srgb, var(--color-warning), transparent 85%)',
              focusRing: { color: 'var(--color-warning)', shadow: 'none' },
            },
          },
          error: {
            background: 'color-mix(in srgb, var(--color-danger), transparent 84%)',
            borderColor: 'color-mix(in srgb, var(--color-danger), transparent 50%)',
            color: 'var(--color-danger)',
            detailColor: 'var(--color-text)',
            shadow: '0px 4px 12px 0px color-mix(in srgb, var(--color-danger), transparent 80%)',
            closeButton: {
              hoverBackground: 'color-mix(in srgb, var(--color-danger), transparent 85%)',
              focusRing: { color: 'var(--color-danger)', shadow: 'none' },
            },
          },
        },
      },
    },
    button: {
      root: {
        borderRadius: '0.375rem',
        paddingX: '1rem',
        paddingY: '0.5rem',
        label: {
          fontWeight: '700',
        },
      },
      colorScheme: {
        light: {
          root: {
            primary: {
              background: 'var(--color-primary)',
              hoverBackground: 'var(--filled-primary-hover)',
              activeBackground: 'var(--filled-primary-hover)',
              borderColor: 'var(--color-primary)',
              hoverBorderColor: 'var(--filled-primary-hover)',
              activeBorderColor: 'var(--filled-primary-hover)',
              color: 'var(--color-on-primary)',
              hoverColor: 'var(--color-on-primary)',
              activeColor: 'var(--color-on-primary)',
            },
            secondary: {
              background: 'var(--color-secondary)',
              hoverBackground: 'var(--filled-secondary-hover, #326b96)',
              activeBackground: 'var(--filled-secondary-hover, #326b96)',
              borderColor: 'var(--color-secondary)',
              hoverBorderColor: 'var(--filled-secondary-hover, #326b96)',
              activeBorderColor: 'var(--filled-secondary-hover, #326b96)',
              color: 'var(--color-on-secondary)',
              hoverColor: 'var(--color-on-secondary)',
              activeColor: 'var(--color-on-secondary)',
            },
          },
          outlined: {
            primary: {
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              hoverBackground: 'transparent',
            },
            secondary: {
              borderColor: 'var(--color-secondary)',
              color: 'var(--color-secondary)',
              hoverBackground: 'transparent',
            },
          },
        },
      },
    },
  },
});
