import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getDefaultsFromConfigSchema, getGlobalStore, useConfig } from '@openmrs/esm-framework';
import { type PatientWorkspace2DefinitionProps } from '@openmrs/esm-patient-common-lib';
import { mockPatient } from 'tools';
import { configSchema, type FormEntryConfigSchema } from '../config-schema';
import FormEntryWorkspace from './form-entry.workspace';

const mockUseConfig = vi.mocked(useConfig<FormEntryConfigSchema>);

vi.mock('./form-entry.component', () => ({
  default: () => <div data-testid="form-entry" />,
}));

const windowName = 'patient-chart-clinical-forms';

interface Workspace2StoreState {
  openedWindows: Array<{ windowName: string; maximized: boolean }>;
}

function renderFormEntryWorkspace() {
  const testProps: PatientWorkspace2DefinitionProps<any, object> = {
    closeWorkspace: vi.fn(),
    workspaceProps: { form: { name: 'Test form' }, encounterUuid: '' },
    windowProps: {},
    groupProps: {
      patientUuid: mockPatient.id,
      patient: mockPatient,
      visitContext: null,
      mutateVisitContext: null,
    },
    launchChildWorkspace: vi.fn(),
    workspaceName: 'patient-form-entry-workspace',
    windowName,
    isRootWorkspace: true,
    showActionMenu: true,
  };

  return render(<FormEntryWorkspace {...testProps} />);
}

describe('FormEntryWorkspace', () => {
  const workspace2Store = getGlobalStore<Workspace2StoreState>('workspace2');

  beforeEach(() => {
    workspace2Store.setState({ openedWindows: [{ windowName, maximized: false }] });
  });

  it('does not maximize the workspace window by default', () => {
    mockUseConfig.mockReturnValue(getDefaultsFromConfigSchema(configSchema));

    renderFormEntryWorkspace();

    expect(screen.getByTestId('form-entry')).toBeInTheDocument();
    expect(workspace2Store.getState().openedWindows[0].maximized).toBe(false);
  });

  it('maximizes the workspace window when openClinicalFormsMaximized is enabled', () => {
    mockUseConfig.mockReturnValue({
      ...getDefaultsFromConfigSchema(configSchema),
      openClinicalFormsMaximized: true,
    });

    renderFormEntryWorkspace();

    expect(screen.getByTestId('form-entry')).toBeInTheDocument();
    expect(workspace2Store.getState().openedWindows[0].maximized).toBe(true);
  });
});
