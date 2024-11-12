export async function GET() {
  const res = await fetch("", {
    headers: {
      "Content-type": "Application/JSON",
    },
  });
  const data = await res.json();

  return Response.json({ data });
}
