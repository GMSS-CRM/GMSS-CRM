import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { ITagService, ITagRepository } from './types';
import ErrorInfo from '../common/error-info';
import { getCurrentEmail } from '../common/utils';

@injectable()
export class TagService implements ITagService {
  constructor(@inject(TYPES.ITagRepository) private readonly tagRepository: ITagRepository) {}

  async createTag(input: any) {
    if (!input.name || input.name.trim() === '') {
      throw new Error(ErrorInfo.TAG_NAME_REQUIRED);
    }

    const existingTag = await this.tagRepository.findByName(input.name);
    if (existingTag) {
      throw new Error(ErrorInfo.TAG_ALREADY_EXISTS);
    }

    const email = getCurrentEmail();

    return this.tagRepository.createTag({
      name: input.name.trim(),
      createdBy: email,
      updatedBy: email,
    });
  }

  async updateTag(id: string, input: any) {
    const existingTag = await this.tagRepository.findById(id);
    if (!existingTag) {
      throw new Error(ErrorInfo.TAG_NOT_FOUND);
    }

    const updateData: any = { updatedBy: getCurrentEmail() };

    if (input.name !== null && input.name !== undefined) {
      const duplicate = await this.tagRepository.findByName(input.name);
      if (duplicate && duplicate.id !== id) {
        throw new Error(ErrorInfo.TAG_ALREADY_EXISTS);
      }
      updateData.name = input.name.trim();
    }

    return this.tagRepository.updateTag(id, updateData);
  }

  async deleteTag(id: string) {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new Error(ErrorInfo.TAG_NOT_FOUND);
    }
    return this.tagRepository.deleteTag(id);
  }

  async deleteTags(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new Error(ErrorInfo.NO_DOCUMENTS_TO_DELETE);
    }
    return this.tagRepository.deleteTags(ids);
  }

  async getTagById(id: string) {
    return this.tagRepository.findById(id);
  }

  async getTagByName(name: string) {
    return this.tagRepository.findByName(name);
  }

  async searchTag(params: any) {
    return this.tagRepository.search(params as any);
  }
}
