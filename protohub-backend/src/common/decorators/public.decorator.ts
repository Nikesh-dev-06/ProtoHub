import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Usage: @Public() on login/register/refresh routes. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
