export async function GET() {
  const secret = process.env.PAGARME_SECRET_KEY
  return Response.json({
    hasSecret: !!secret,
    secretLen: secret?.length ?? 0,
    secretPrefix: secret ? secret.slice(0, 3) : null,
    hasAccountId: !!process.env.PAGAR_ME_ACCOUNT_ID,
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
