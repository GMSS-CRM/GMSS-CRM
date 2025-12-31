// src/components/user/repository.ts
import { AppDataSource } from "../../config/data-source";
import { User } from "../../entities/User";

const repo = AppDataSource.getRepository(User);

export const userRepository = {
  async create(data: any) {
    const user = repo.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      roleId: data.roleId,      // ✅ THIS WAS MISSING
      createdBy: "SYSTEM",
    });

    return repo.save(user);
  },

  findById: (id: string) =>
    repo.findOne({ where: { id } }),

  search: (params: any) =>
    repo.find({ where: params }),

  delete: (id: string) =>
    repo.delete(id),

  deleteMany: (ids: string[]) =>
    repo.delete(ids),

  update: async (id: string, data: any) => {
    const user = await repo.findOne({ where: { id } }); 
  }
}

