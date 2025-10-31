import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

export const GET = withApiAuthRequired(async () => {
  const { accessToken } = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/employees`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-API-Key': API_KEY,
      'Accept': 'application/json'
    }
  });

  const data = await response.json();
  return Response.json(data);
});


export const POST = withApiAuthRequired(async (req: Request) => {
  const { accessToken } = await getAccessToken();
  const body = await req.json();

  const response = await fetch(`${API_BASE_URL}/employees`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
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

