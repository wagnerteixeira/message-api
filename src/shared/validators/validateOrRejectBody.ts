import { validateOrReject } from 'class-validator';

export default async function<T>(body: T, Class: any): Promise<T> {
  const instance = new Class();
  for (const [key, value] of Object.entries(body)) {
    instance[key] = value;
  }
  await validateOrReject(instance);
  return body;
}
