import { userRepository } from "./repository";

export const userService = {
  create: (data: any) => userRepository.create(data),
  update: (id: string, data: any) => userRepository.update(id, data),
  delete: (id: string) => userRepository.delete(id),
  deleteMany: (ids: string[]) => userRepository.deleteMany(ids),
  getById: (id: string) => userRepository.findById(id),
  search: (params: any) => userRepository.search(params),
};
