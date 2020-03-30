import { warn } from "../logger";

export function warnWrongInput<T, K extends keyof T>(
  value: any,
  items: T[],
  property: K
): boolean {
  if (items.some((item) => item[property] === value)) {
    return false;
  }

  warn(
    `${
      items.length
        ? `We found similar: [${items
            .map((item) => item[property])
            .join(", ")}]`
        : "We found nothing"
    }`
  );
  return true;
}
