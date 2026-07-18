import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getDefaultsFromConfigSchema, getGlobalStore, useConfig } from '@openmrs/esm-framework';
import { type PatientWorkspace2DefinitionProps } from '@openmrs/esm-patient-common-lib';
import { mockPatient } from 'tools';
import { configSchema, type FormEntryConfigSchema } from '../config-schema';
import FormsDashboardWorkspace from './forms-dashboard.workspace';

const mockUseConfig = vi.mocked(useConfig<FormEntryConfigSchema>);

vi.mock('./forms-dashboard.component', () => ({
  default: () => <div data-testid="forms-dashboard" />,
}));

const windowName = 'patient-chart-clinical-forms';

interface Workspace2StoreState {
  openedWindows: Array<{ windowName: string; maximized: boolean }>;
}

function renderFormsDashboardWorkspace() {
  const testProps: PatientWorkspace2DefinitionProps<object, object> = {
    closeWorkspace: vi.fn(),
    workspaceProps: {},
    windowProps: {},
    groupProps: {
      patientUuid: mockPatient.id,
      patient: mockPatient,
      visitContext: null,
      mutateVisitContext: null,
    },
    launchChildWorkspace: vi.fn(),
    workspaceName: 'clinical-forms-workspace',
    windowName,
    isRootWorkspace: true,
    showActionMenu: true,
  };

  return render(<FormsDashboardWorkspace {...testProps} />);
}

describe('FormsDashboardWorkspace', () => {
  const workspace2Store = getGlobalStore<Workspace2StoreState>('workspace2');

  beforeEach(() => {
    workspace2Store.setState({ openedWindows: [{ windowName, maximized: false }] });
  });

  it('does not maximize the workspace window by default', () => {
    mockUseConfig.mockReturnValue(getDefaultsFromConfigSchema(configSchema));

    renderFormsDashboardWorkspace();

    expect(screen.getByTestId('forms-dashboard')).toBeInTheDocument();
    expect(workspace2Store.getState().openedWindows[0].maximized).toBe(false);
  });

  it('maximizes the workspace window when openClinicalFormsMaximized is enabled', () => {
    mockUseConfig.mockReturnValue({
      ...getDefaultsFromConfigSchema(configSchema),
      openClinicalFormsMaximized: true,
    });

    renderFormsDashboardWorkspace();

    expect(screen.getByTestId('forms-dashboard')).toBeInTheDocument();
    expect(workspace2Store.getState().openedWindows[0].maximized).toBe(true);
  });
});
