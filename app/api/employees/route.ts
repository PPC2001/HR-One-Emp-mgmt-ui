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
