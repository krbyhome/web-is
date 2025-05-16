import { applyDecorators, Header, SetMetadata } from '@nestjs/common';

export function CacheControl(maxAge: number) {
  return applyDecorators(
    SetMetadata('cache-control', maxAge),
    Header('Cache-Control', `public, max-age=${maxAge}`),
  );
}
