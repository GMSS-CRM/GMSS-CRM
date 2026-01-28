import { Repository } from 'typeorm';
import { Tag } from '../../entities/Tag';
import type {
  CreateTagInput,
  UpdateTagInput,
  SearchTagInput,
} from '@gmss/types';

export interface ITagRepository extends Repository<Tag> {
  createTag(tag: Partial<Tag>): Promise<Tag>;
  findById(id: string): Promise<Tag | null>;
  findByName(name: string): Promise<Tag | null>;
  search(params: { search?: string; limit?: number; offset?: number }): Promise<Tag[]>;
  updateTag(id: string, tag: Partial<Tag>): Promise<Tag | null>;
  deleteTag(id: string): Promise<boolean>;
  deleteTags(ids: string[]): Promise<boolean>;
}

export interface ITagService {
  createTag(input: CreateTagInput, context?: { email?: string }): Promise<Tag>;
  updateTag(id: string, input: UpdateTagInput): Promise<Tag | null>;
  deleteTag(id: string): Promise<boolean>;
  deleteTags(ids: string[]): Promise<boolean>;
  getTagById(id: string): Promise<Tag | null>;
  getTagByName(name: string): Promise<Tag | null>;
  searchTag(params: SearchTagInput): Promise<Tag[]>;
}
