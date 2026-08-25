import { getImageUrl } from "../lib/storage/imageUrl";
import { customType } from "drizzle-orm/mysql-core";

export const imagePath = customType<{ data: string; driverData: string }>({
  dataType() {
    return "text";
  },
  fromDriver(value: string): string {
    return getImageUrl(value);
  },
  toDriver(value: string): string {
    return value;
  },
});

const LOCAL_BASE_PATH = "/uploads";
export const videoPath = customType<{ data: string; driverData: string }>({
  dataType() {
    return "text";
  },
  fromDriver(value: string): string {
    if (!value) return value;

    if (value.startsWith("http") || value.startsWith("/uploads/")) return value;

    return `${LOCAL_BASE_PATH}/${value}`;
  },
  toDriver(value: string): string {
    // Strip the prefix before storing, keep it normalized
    if (value.startsWith(LOCAL_BASE_PATH + "/")) {
      return value.slice(LOCAL_BASE_PATH.length + 1);
    }
    return value;
  },
});
