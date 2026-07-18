import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getDefaultsFromConfigSchema, getGlobalStore, useConfig } from '@openmrs/esm-framework';
import { type OrderBasketWindowProps, type PatientWorkspace2DefinitionProps } from '@openmrs/esm-patient-common-lib';
import { mockPatient } from 'tools';
import { configSchema, type ConfigObject } from '../config-schema';
import OrderBasketWorkspace from './order-basket.workspace';

const mockUseConfig = vi.mocked(useConfig<ConfigObject>);

vi.mock('./order-basket.component', () => ({
  default: () => <div data-testid="order-basket" />,
}));

const windowName = 'patient-chart-order-basket';

interface Workspace2StoreState {
  openedWindows: Array<{ windowName: string; maximized: boolean }>;
}

function renderOrderBasketWorkspace() {
  const testProps: PatientWorkspace2DefinitionProps<{}, OrderBasketWindowProps> = {
    closeWorkspace: vi.fn(),
    workspaceProps: {},
    windowProps: { encounterUuid: '' },
    groupProps: {
      patientUuid: mockPatient.id,
      patient: mockPatient,
      visitContext: null,
      mutateVisitContext: null,
    },
    launchChildWorkspace: vi.fn(),
    workspaceName: 'order-basket',
    windowName,
    isRootWorkspace: true,
    showActionMenu: true,
  };

  return render(<OrderBasketWorkspace {...testProps} />);
}

describe('OrderBasketWorkspace', () => {
  const workspace2Store = getGlobalStore<Workspace2StoreState>('workspace2');

  beforeEach(() => {
    workspace2Store.setState({ openedWindows: [{ windowName, maximized: false }] });
  });

  it('does not maximize the workspace window by default', () => {
    mockUseConfig.mockReturnValue(getDefaultsFromConfigSchema(configSchema));

    renderOrderBasketWorkspace();

    expect(screen.getByTestId('order-basket')).toBeInTheDocument();
    expect(workspace2Store.getState().openedWindows[0].maximized).toBe(false);
  });

  it('maximizes the workspace window when openOrderBasketMaximized is enabled', () => {
    mockUseConfig.mockReturnValue({
      ...getDefaultsFromConfigSchema(configSchema),
      openOrderBasketMaximized: true,
    });

    renderOrderBasketWorkspace();

    expect(screen.getByTestId('order-basket')).toBeInTheDocument();
    expect(workspace2Store.getState().openedWindows[0].maximized).toBe(true);
  });
});
