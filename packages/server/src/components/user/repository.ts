import { AppDataSource } from "../../config/data-source";
import { User } from "../../entities/User";

export const userRepository = {
  repo: AppDataSource.getRepository(User),

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

  deleteMany(ids: string[]) {
    return this.repo.delete(ids).then(() => true);
  },

  findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ["role"],
    });
  },

  search({ search }: { search?: string }) {
    const qb = this.repo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role");

    if (search) {
      qb.where(
        "user.email ILIKE :s OR user.firstName ILIKE :s",
        { s: `%${search}%` }
      );
    }

    return qb.getMany();
  },
};
