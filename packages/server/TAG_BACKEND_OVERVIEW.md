# GMSS-CRM Backend Tag Implementation Overview

## 1. Tag-Related Files

**Tag domain:**
- `src/components/tag/types.ts` — Tag service/repository interfaces
- `src/components/tag/service.ts` — Tag business logic (service)
- `src/components/tag/schema.ts` — Tag GraphQL schema (typeDefs, queries, mutations, input types)
- `src/components/tag/resolver.ts` — Tag GraphQL resolvers (query/mutation handlers)
- `src/components/tag/repository.ts` — Tag data access (TypeORM repository)
- `src/components/tag/index.ts` — Barrel export for tag component

**Entities:**
- `src/entities/Tag.ts` — Tag entity (TypeORM, DB table definition)
- `src/entities/VendorTag.ts` — VendorTag entity (junction table for vendor-tag many-to-many)

**Vendor-Tag domain:**
- `src/components/vendor-tag/schema.ts` — VendorTag GraphQL schema
- `src/components/vendor-tag/resolver.ts` — VendorTag resolvers
- `src/components/vendor-tag/service.ts` — VendorTag service
- `src/components/vendor-tag/repository.ts` — VendorTag repository
- `src/components/vendor-tag/types.ts` — VendorTag interfaces

**Other:**
- `src/entities/Vendor.ts` — Vendor entity (has tag relation)
- `src/graphql/typedefs.ts` — Imports and merges tag/vendortag typeDefs
- `src/graphql/resolvers.ts` — Imports and merges tag/vendortag resolvers

---

## 2. Tag Entity

**File:** `packages/server/src/entities/Tag.ts`
```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tag' })
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ default: 'SYSTEM' })
  createdBy!: string;
  
  @CreateDateColumn()
  createdDate!: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  @UpdateDateColumn()
  updatedDate!: Date;
}
```

---

## 3. VendorTag Entity & Relationship

**File:** `packages/server/src/entities/VendorTag.ts`
```typescript
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import type { Vendor } from './Vendor';
import { Tag } from './Tag';

@Entity({ name: 'vendor_tag' })
export class VendorTag {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    vendorId!: string;

    @Column()
    tagId!: string;

    @Column({ default: true })
    enableMail!: boolean;

    @Column({ default: 'SYSTEM' })
    createdBy!: string;

    @CreateDateColumn()
    createdDate!: Date;

    @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tagId' })
    tag!: Tag;

    @ManyToOne('Vendor', 'tags', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vendorId' })
    vendor!: Vendor;
}
```
- **Relationship:** Many-to-many between Vendor and Tag, via `VendorTag` junction table.
- **Email field:** There is an `enableMail` boolean field (default: true).

---

## 4. Tag GraphQL Schema

**File:** `packages/server/src/components/tag/schema.ts`
```typescript
import { gql } from 'graphql-tag';

export const tagTypeDefs = gql`
  type Tag {
    id: ID!
    name: String!
    createdBy: String!
    updatedBy: String
    createdDate: String!
    updatedDate: String!
  }

  input CreateTagInput {
    name: String!
  }

  input UpdateTagInput {
    name: String
  }

  input SearchTagInput {
    search: String
    limit: Int
    offset: Int
  }

  extend type Query {
    getTagById(id: ID!): Tag
    searchTags(searchInput: SearchTagInput): [Tag!]!
  }

  extend type Mutation {
    createTag(input: CreateTagInput!): Tag!
    updateTag(id: ID!, input: UpdateTagInput!): Tag!
    deleteTag(id: ID!): Boolean!
    deleteTags(ids: [ID!]!): Boolean!
  }
`;
```

---

## 5. Tag Resolver

**File:** `packages/server/src/components/tag/resolver.ts`
```typescript
import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { ITagService } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<ITagService>(TYPES.ITagService);
};

export const tagResolvers = {
  Query: {
    getTagById: (_: unknown, { id }: any) => getService().getTagById(id),
    searchTags: (_: unknown, { searchInput }: any) => getService().searchTag(searchInput as any),
  },

  Mutation: {
    createTag: (_: unknown, { input }: any, context: any) =>
      getService().createTag(input as any, { email: context?.user?.email }),

    updateTag: (_: unknown, { id, input }: any, context: any) =>
      getService().updateTag(id, input as any),

    deleteTag: (_: unknown, { id }: any) => getService().deleteTag(id),

    deleteTags: (_: unknown, { ids }: any) => getService().deleteTags(ids),
  },
};
```
- **Queries implemented:** getTagById, searchTags
- **Mutations implemented:** createTag, updateTag, deleteTag, deleteTags

---

## 6. Tag Service

**File:** `packages/server/src/components/tag/service.ts`
```typescript
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
```
- **Methods:** createTag, updateTag, deleteTag, deleteTags, getTagById, getTagByName, searchTag

---

## 7. Tag Repository

**File:** `packages/server/src/components/tag/repository.ts`
```typescript
import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { Tag } from '../../entities/Tag';
import { ITagRepository } from './types';

@injectable()
export class TagRepository extends Repository<Tag> implements ITagRepository {
  constructor(@inject(TYPES.DbContext) private readonly dbContext: DataSource) {
    super(Tag, dbContext.manager);
  }

  createTag(tag: Partial<Tag>) {
    return this.save(this.create(tag));
  }

  findById(id: string) {
    return this.findOne({
      where: { id },
    });
  }

  findByName(name: string) {
    return this.findOne({
      where: { name },
    });
  }

  search(params: { search?: string; limit?: number; offset?: number }) {
    const query = this.createQueryBuilder('tag');

    if (params.search) {
      query.where('tag.name ILIKE :search', { search: `%${params.search}%` });
    }

    if (params.limit) {
      query.take(params.limit);
    }

    if (params.offset) {
      query.skip(params.offset);
    }

    return query.getMany();
  }

  updateTag(id: string, tag: Partial<Tag>) {
    return this.update(id, tag).then(() => this.findById(id));
  }

  deleteTag(id: string) {
    return this.delete(id).then(() => true);
  }

  deleteTags(ids: string[]) {
    return this.delete(ids).then(() => true);
  }
}
```

---

## 8. Vendor Entity - Tag Relation

**File:** `packages/server/src/entities/Vendor.ts`
```typescript
@OneToMany('VendorTag', 'vendor', { cascade: true })
tags!: VendorTag[];
```
- **Yes, there is a `tags` field:**
  - This links Vendor to tags via the `VendorTag` junction entity.

---

## 9. GraphQL Queries - Exact Syntax

- `getTagById(id: ID!): Tag`
- `searchTags(searchInput: SearchTagInput): [Tag!]!`

**Example response:**
```json
{
  "id": "uuid",
  "name": "Some Tag",
  "createdBy": "user@example.com",
  "updatedBy": "user@example.com",
  "createdDate": "2024-01-01T00:00:00.000Z",
  "updatedDate": "2024-01-01T00:00:00.000Z"
}
```

---

## 10. GraphQL Mutations - Exact Syntax

- `createTag(input: CreateTagInput!): Tag!`
- `updateTag(id: ID!, input: UpdateTagInput!): Tag!`
- `deleteTag(id: ID!): Boolean!`
- `deleteTags(ids: [ID!]!): Boolean!`

**Example mutation response:**
```json
{
  "createTag": {
    "id": "uuid",
    "name": "New Tag",
    "createdBy": "user@example.com",
    "updatedBy": "user@example.com",
    "createdDate": "...",
    "updatedDate": "..."
  }
}
```

---

## 11. Input Types

- `CreateTagInput { name: String! }`
- `UpdateTagInput { name: String }`
- `SearchTagInput { search: String, limit: Int, offset: Int }`

---

## 12. Database Schema

- **Tag table:** `id (uuid, PK)`, `name (unique)`, `createdBy`, `createdDate`, `updatedBy`, `updatedDate`
- **VendorTag table:** `id (uuid, PK)`, `vendorId`, `tagId`, `enableMail (default: true)`, `createdBy`, `createdDate`
- **Relation:** `VendorTag` has FKs to both `Vendor` and `Tag`

---

## 13. Current Status

- **Tag CRUD:** Fully implemented (create, update, delete, search, get by id)
- **Vendor-Tag relationship:** Implemented via `VendorTag` entity and relation in `Vendor`
- **Email preference field:** Yes, `enableMail` in `VendorTag`
- **What's working:** All backend CRUD and relations for tags and vendor-tags are implemented and exposed via GraphQL.
- **What's missing:** No evidence of missing or in-progress features for tag CRUD or vendor-tag relation.
