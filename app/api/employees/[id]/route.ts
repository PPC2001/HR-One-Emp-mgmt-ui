// app/api/employees/[id]/route.ts
import { getAccessToken } from '@auth0/nextjs-auth0';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

// ✅ PUT: update employee
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const session = await getAccessToken();
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json();

  const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    return new Response(text, { status: response.status });
  }

  const data = await response.json();
  return Response.json(data);
}

// ✅ DELETE: delete employee
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const session = await getAccessToken();
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-API-Key': API_KEY,
    },
  });

  return new Response(null, { status: response.ok ? 204 : response.status });
}
