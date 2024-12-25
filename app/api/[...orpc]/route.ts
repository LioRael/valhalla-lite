import { handleFetchRequest, createORPCHandler } from '@orpc/server/fetch';
import { createOpenAPIServerlessHandler } from '@orpc/openapi/fetch';
import { cookies } from 'next/headers';
import { router } from '@/orpc/orpc';

const handler = async (request: Request) => {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token || token !== process.env.TOKEN) {
    return new Response('Unauthorized', { status: 401 });
  }

  return handleFetchRequest({
    router,
    request,
    prefix: '/api',
    handlers: [createORPCHandler(), createOpenAPIServerlessHandler()],
  });
};

export { handler as GET, handler as POST };
