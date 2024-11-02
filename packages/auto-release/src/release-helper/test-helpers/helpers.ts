import { from, lastValueFrom, Observable } from "rxjs";

export const executeRx = async <SourceType, ReturnType>(
  source: SourceType[],
  sut: (source: Observable<SourceType>) => Observable<ReturnType>,
): Promise<ReturnType> => {
  return await lastValueFrom(from(source).pipe(sut));
};
