export const isTypeMatch = <T>(element: unknown): element is T => {
  return (element as T) !== undefined;
};
