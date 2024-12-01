export type Extractor<T> = {
  extract: (input: string) => {
    value: T | undefined;
    remainingInput: string;
  };
};
