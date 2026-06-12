export async function GET() {
  return Response.json({
    hasSecret: !!process.env.PAGARME_SECRET_KEY,
    hasPublicKey: !!process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY,
    nodeEnv: process.env.NODE_ENV,
  })
}

export async function POST() {
  return Response.json({
    method: 'POST',
    hasSecret: !!process.env.PAGARME_SECRET_KEY,
    hasPublicKey: !!process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY,
    nodeEnv: process.env.NODE_ENV,
  })
}
