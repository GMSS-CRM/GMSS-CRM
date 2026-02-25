import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IS3Service } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<IS3Service>(TYPES.IS3Service);
};

export const uploadResolvers = {
  Mutation: {
    generatePresignedUploadUrl: (_: unknown, { input }: any) =>
      getService().generatePresignedUploadUrl(input.folder, input.fileName, input.contentType),
  },
};
