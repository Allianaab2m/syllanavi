import type { Undefinable } from "option-t/undefinable";
import departments from "~/departments.json";

export type Category = {
  id: number;
  name: string;
};

type Department = {
  id: number;
  name: string;
  shortenName: string;
  tag: string;
  categories: Category[];
};

export const findDepartmentByID = (
  id: number | null,
): Undefinable<Department> => {
  if (!id) return undefined;
  return departments.find((v) => v.id === id);
};

export const findDepartmentByName = (name: string): Undefinable<Department> => {
  return departments.find((v) => v.name === name);
};

export const findCategoryById = (
  department: Department,
  id: number | null,
): Undefinable<Category> => {
  const categories = department.categories;
  return categories.find((v) => v.id === id);
};

export const findCategoryByName = (
  department: Department,
  name: string,
): Undefinable<Category> => {
  const categories = department.categories;
  return categories.find((v) => v.name === name);
};
