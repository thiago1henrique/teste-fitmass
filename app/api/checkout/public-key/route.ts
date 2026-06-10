export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY

  if (!publicKey) {
    return Response.json(
      { error: 'Payment configuration missing' },
      { status: 500 }
    )
  }

  return Response.json({ publicKey })
}
