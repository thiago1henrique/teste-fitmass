import { type NextRequest } from 'next/server'
import { baseCheckoutSchema } from '@/app/(pages)/checkout/schema'

function isoDateFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.PAGARME_SECRET_KEY?.trim()
  if (!secretKey) {
    return Response.json({ success: false, error: `[API] PAGARME_SECRET_KEY ausente. nodeEnv=${process.env.NODE_ENV}` }, { status: 500 })
  }
  if (!secretKey.startsWith('sk_')) {
    return Response.json({ success: false, error: 'Chave de API inválida. Use a chave secreta (sk_...) do painel Pagar.me.' }, { status: 500 })
  }

  const body = await req.json()
  const { raw, planId, planPrice, planName, cardToken } = body

  const parsed = baseCheckoutSchema.safeParse(raw)
  if (!parsed.success) {
    return Response.json({ success: false, error: 'Dados inválidos. Verifique o formulário e tente novamente.' }, { status: 400 })
  }

  const d = parsed.data
  const rawPhoneDigits = d.phone.replace(/\D/g, '')
  const rawPhone = rawPhoneDigits.length > 11 && rawPhoneDigits.startsWith('55')
    ? rawPhoneDigits.slice(2)
    : rawPhoneDigits

  if (d.paymentMethod === 'credit_card' && !cardToken) {
    return Response.json({ success: false, error: 'Token do cartão ausente. Recarregue a página e tente novamente.' }, { status: 400 })
  }

  const pagarmePayload = {
    items: [{ amount: planPrice * 100, description: `Assinatura Fitmass — Plano ${planName}`, quantity: 1, code: planId.toUpperCase() }],
    customer: {
      name: d.name, email: d.email, type: 'individual',
      document: d.cpf.replace(/\D/g, ''), document_type: 'CPF',
      phones: { mobile_phone: { country_code: '55', area_code: rawPhone.slice(0, 2), number: rawPhone.slice(2) } },
    },
    billing_address: {
      line_1: [d.number, d.street, d.neighborhood].filter(Boolean).join(', '),
      line_2: d.complement ?? '',
      zip_code: d.zipCode.replace('-', ''),
      city: d.city, state: d.state, country: 'BR',
    },
    payments: d.paymentMethod === 'credit_card'
      ? [{ payment_method: 'credit_card', credit_card: { installments: parseInt(d.installments ?? '1', 10), card_token: cardToken, card: { billing_address: { line_1: [d.number, d.street, d.neighborhood].filter(Boolean).join(', '), line_2: d.complement ?? '', zip_code: d.zipCode.replace('-', ''), city: d.city, state: d.state, country: 'BR' } } } }]
      : d.paymentMethod === 'pix'
        ? [{ payment_method: 'pix', pix: { expires_in: 86400 } }]
        : [{ payment_method: 'boleto', boleto: { instructions: 'Não receber após vencimento.', due_at: isoDateFromNow(3) } }],
  }

  let response: Response
  try {
    response = await fetch('https://api.pagar.me/core/v5/orders', {
      method: 'POST',
      headers: { Authorization: `Basic ${Buffer.from(secretKey + ':').toString('base64')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(pagarmePayload),
    })
  } catch {
    return Response.json({ success: false, error: 'Não foi possível conectar ao servidor de pagamento. Verifique sua conexão.' }, { status: 502 })
  }

  if (!response.ok) {
    const bodyText = await response.text()
    let msg = 'Erro ao processar pagamento.'
    try { const err = JSON.parse(bodyText); msg = err?.message ?? err?.errors?.[0]?.message ?? msg } catch { /* ignore */ }
    return Response.json({ success: false, error: `${msg} (HTTP ${response.status})` }, { status: response.status })
  }

  const responseBody = await response.json()
  const charge = responseBody.charges?.[0]
  const tx = charge?.last_transaction

  if (charge?.status === 'failed' || tx?.status === 'failed') {
    const gatewayMsg = tx?.gateway_response?.errors?.[0]?.message ?? ''
    const isPixNotConfigured = gatewayMsg.includes('action_forbidden') || gatewayMsg.includes('Sem ambiente')
    return Response.json({ success: false, error: isPixNotConfigured ? 'Pagamento via PIX não está disponível no momento.' : 'Pagamento recusado pelo gateway. Tente novamente ou use outro método.' })
  }

  if (d.paymentMethod === 'pix') return Response.json({ success: true, paymentMethod: 'pix', qrCode: tx?.qr_code ?? '', qrCodeUrl: tx?.qr_code_url ?? '' })
  if (d.paymentMethod === 'boleto') return Response.json({ success: true, paymentMethod: 'boleto', boletoUrl: tx?.pdf ?? tx?.boleto_url ?? '', line: tx?.line ?? tx?.boleto_barcode ?? '' })
  return Response.json({ success: true, paymentMethod: 'credit_card', message: 'Pedido recebido com sucesso! Em breve você receberá as instruções no e-mail cadastrado.' })
}
