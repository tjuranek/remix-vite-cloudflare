import invariant from "tiny-invariant";

export function getQueryParam(request: Request, key: string) {
  const { searchParams } = new URL(request.url);

  const value = searchParams.get(key);
  invariant(value, `Param not found. Expected value for ${key}.`);

  return value;
}
