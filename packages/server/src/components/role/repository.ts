import { AppDataSource } from "../../config/data-source";
import { Role } from "../../entities/Role";

export const roleRepository = {
  repo: AppDataSource.getRepository(Role),

  create(data: any) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  },

  update(id: string, data: any) {
    return this.repo
      .update(id, data)
      .then(() => this.repo.findOneBy({ id }));
  },

  delete(id: string) {
    return this.repo.delete(id).then(() => true);
  },

  findById(id: string) {
    return this.repo.findOneBy({ id });
  },

  search(search?: string) {
    const qb = this.repo.createQueryBuilder("role");

    if (search) {
      qb.where("role.name ILIKE :s", { s: `%${search}%` });
    }

    return qb.getMany();
  },
};
