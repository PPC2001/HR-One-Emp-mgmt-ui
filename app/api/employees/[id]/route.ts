import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

// ✅ PUT: Update employee
export const PUT = withApiAuthRequired(async (req, context) => {
  const id = context?.params?.id as string; // ✅ safe cast
  if (!id) {
    return new Response('Missing employee ID', { status: 400 });
  }

  const { accessToken } = await getAccessToken();
  const body = await req.json();

  const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    return new Response(text, { status: response.status });
  }

  const data = await response.json();
  return Response.json(data);
});

// ✅ DELETE: Delete employee
export const DELETE = withApiAuthRequired(async (_req, context) => {
  const id = context?.params?.id as string; // ✅ safe cast
  if (!id) {
    return new Response('Missing employee ID', { status: 400 });
  }

  const { accessToken } = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-API-Key': API_KEY,
    },
  });

  return new Response(null, { status: response.ok ? 204 : response.status });
});
