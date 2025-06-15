export async function GET() {
  const countries = [
    { id: 1, name: "País A" },
    { id: 2, name: "País B" },
  ];

  return Response.json(countries);
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({
    mensagem: "País adicionado aos favoritos",
    data: body,
  });
}
