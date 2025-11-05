import React, { useEffect, useState } from 'react';
import ShrRendererComponent from './shr-renderer/shr-renderer.component';
import { type FhirBundle } from './types';
import { getPatientCrIdentifier, getPatientShrSummary } from './shr-resource';
import { useSession } from '@openmrs/esm-framework';
import HieOtpVerificationModal from '../../../hie/otp-verification/hie-otp-verification-modal';
import { Button } from '@carbon/react';
import styles from './shr-details.component.scss';

type ShrDetailsProps = {
  patientUuid: string;
};

const ShrDetails: React.FC<ShrDetailsProps> = ({ patientUuid }) => {
  const [shrBundle, setShrBundle] = useState<FhirBundle | null>(null);
  const [showHieModal, setShowHieModal] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const session = useSession();

  useEffect(() => {
    async function fetchCrIdentifier(uuid: string) {
      const crId = await getPatientCrIdentifier(uuid);
      if (crId) {
        await fetchShrSummary(crId.identifier);
      }
    }

    async function fetchShrSummary(crNo: string) {
      const userLoggedInLocationUuid = session?.sessionLocation?.uuid;
      if (!userLoggedInLocationUuid) return;
      const data = await getPatientShrSummary(crNo, userLoggedInLocationUuid);
      if (data) setShrBundle(data);
    }

    if (patientUuid) {
      fetchCrIdentifier(patientUuid);
    }
  }, [patientUuid, session]);

  if (!shrBundle) {
    return <h4>No SHR Data</h4>;
  }

  const onModalClose = (closeDto: { otpValidated: boolean }) => {
    setShowHieModal(false);
    if (closeDto.otpValidated) {
      setOtpVerified(true);
    }
  };

  const showOtpVerificationModal = () => {
    setShowHieModal(true);
  };

  if (!otpVerified) {
    return (
      <>
        <div className={styles.shrDetailsLayout}>
          <HieOtpVerificationModal showModal={showHieModal} onRequestClose={onModalClose} />
          <Button onClick={showOtpVerificationModal}>Get Client Consent</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.shrDetailsLayout}>
        <ShrRendererComponent shrBundle={shrBundle} />
      </div>
    </>
  );
};

export default ShrDetails;
