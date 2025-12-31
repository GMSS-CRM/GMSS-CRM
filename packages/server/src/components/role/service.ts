import { roleRepository } from "./repository";

export const roleService = {
  create: (data: any) => roleRepository.create(data),
  update: (id: string, data: any) => roleRepository.update(id, data),
  delete: (id: string) => roleRepository.delete(id),
  getById: (id: string) => roleRepository.findById(id),
  search: (search?: string) => roleRepository.search(search),
};
