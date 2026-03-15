import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IVendorAgreementService } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<IVendorAgreementService>(
    TYPES.IVendorAgreementService
  );
};

export const vendorAgreementResolvers = {
  Query: {
    getVendorAgreements: (_: unknown, { vendorId }: any) =>
      getService().getAgreementsByVendor(vendorId),
  },
  Mutation: {
    createVendorAgreement: (_: unknown, { input }: any) =>
      getService().createAgreement(input),

    updateAgreementSignature: (_: unknown, { input }: any) =>
      getService().updateSignature(input),
  },
};
