import React, { useEffect, useMemo } from 'react';
import { getGlobalStore, useConfig } from '@openmrs/esm-framework';
import { type OrderBasketWindowProps, type PatientWorkspace2DefinitionProps } from '@openmrs/esm-patient-common-lib';
import { type ConfigObject } from '../config-schema';
import OrderBasket from './order-basket.component';
import { createOrderBasketExtensionProps } from './order-basket.utils';

/** Minimal view of the framework's (internal) workspace2 store state that we mutate. */
interface Workspace2StoreState {
  openedWindows: Array<{ windowName: string; maximized: boolean }>;
}

/**
 * This workspace renders the main order basket, which contains the buttons to add a drug order and to add a lab order.
 *
 * This workspace must only be used within the patient chart
 * @see exported-order-basket.workspace.tsx
 */
const OrderBasketWorkspace: React.FC<PatientWorkspace2DefinitionProps<{}, OrderBasketWindowProps>> = ({
  groupProps: { patientUuid, patient, visitContext, mutateVisitContext },
  closeWorkspace,
  launchChildWorkspace,
  windowName,
}) => {
  const { openOrderBasketMaximized } = useConfig<ConfigObject>();

  useEffect(() => {
    if (!openOrderBasketMaximized) {
      return;
    }
    const store = getGlobalStore<Workspace2StoreState>('workspace2');
    store.setState((state) => {
      const openedWindows = state.openedWindows ? [...state.openedWindows] : [];
      const index = openedWindows.findIndex((w) => w.windowName === windowName);
      if (index === -1 || openedWindows[index].maximized) {
        return {};
      }
      openedWindows[index] = { ...openedWindows[index], maximized: true };
      return { openedWindows };
    });
  }, [openOrderBasketMaximized, windowName]);

  const orderBasketExtensionProps = useMemo(
    () =>
      createOrderBasketExtensionProps({
        patient,
        drugOrderWorkspaceName: 'add-drug-order',
        labOrderWorkspaceName: 'add-lab-order',
        generalOrderWorkspaceName: 'orderable-concept-workspace',
        launchChildWorkspace,
      }),
    [launchChildWorkspace, patient],
  );

  return (
    <OrderBasket
      patientUuid={patientUuid}
      patient={patient}
      visitContext={visitContext}
      mutateVisitContext={mutateVisitContext}
      closeWorkspace={closeWorkspace}
      orderBasketExtensionProps={orderBasketExtensionProps}
    />
  );
};

export default OrderBasketWorkspace;
