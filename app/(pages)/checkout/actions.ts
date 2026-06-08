'use server'

import { baseCheckoutSchema, type BaseCheckoutFormData } from './schema'

export type CheckoutResult =
  | { success: true; paymentMethod: 'credit_card'; message: string }
  | { success: true; paymentMethod: 'pix'; qrCode: string; qrCodeUrl: string }
  | { success: true; paymentMethod: 'boleto'; boletoUrl: string; line: string }
  | { success: false; error: string }

function isoDateFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export async function processCheckout(
  raw: BaseCheckoutFormData,
  planId: string,
  planPrice: number,
  planName: string,
  cardToken?: string,
): Promise<CheckoutResult> {
  const secretKey = process.env.PAGARME_SECRET_KEY?.trim()
  if (!secretKey) {
    console.error('[processCheckout] PAGARME_SECRET_KEY não configurada em .env.local')
    return { success: false, error: 'Configuração de pagamento ausente. Contate o suporte.' }
  }

  const keyPreview = `${secretKey.slice(0, 10)}...`
  const keyIsSecret = secretKey.startsWith('sk_')
  console.log(`[processCheckout] chave carregada: ${keyPreview} | é sk_: ${keyIsSecret}`)

  if (!keyIsSecret) {
    console.error('[processCheckout] Chave inválida — deve começar com sk_ (secreta), não pk_ (pública)')
    return { success: false, error: 'Chave de API inválida. Use a chave secreta (sk_...) do painel Pagar.me.' }
  }

  const parsed = baseCheckoutSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: 'Dados inválidos. Verifique o formulário e tente novamente.' }
  }

  const d = parsed.data
  const rawPhone = d.phone.replace(/\D/g, '')

  if (d.paymentMethod === 'credit_card' && !cardToken) {
    return { success: false, error: 'Token do cartão ausente. Recarregue a página e tente novamente.' }
  }

  const pagarmePayload = {
    items: [
      {
        amount: planPrice * 100,
        description: `Assinatura Fitmass — Plano ${planName}`,
        quantity: 1,
        code: planId.toUpperCase(),
      },
    ],
    customer: {
      name: d.name,
      email: d.email,
      type: 'individual',
      document: d.cpf.replace(/\D/g, ''),
      document_type: 'CPF',
      phones: {
        mobile_phone: {
          country_code: '55',
          area_code: rawPhone.slice(0, 2),
          number: rawPhone.slice(2),
        },
      },
    },
    billing_address: {
      line_1: [d.number, d.street, d.neighborhood].filter(Boolean).join(', '),
      line_2: d.complement ?? '',
      zip_code: d.zipCode.replace('-', ''),
      city: d.city,
      state: d.state,
      country: 'BR',
    },
    payments:
      d.paymentMethod === 'credit_card'
        ? [
            {
              payment_method: 'credit_card',
              credit_card: {
                installments: parseInt(d.installments ?? '1', 10),
                card_token: cardToken,
                card: {
                  billing_address: {
                    line_1: [d.number, d.street, d.neighborhood].filter(Boolean).join(', '),
                    line_2: d.complement ?? '',
                    zip_code: d.zipCode.replace('-', ''),
                    city: d.city,
                    state: d.state,
                    country: 'BR',
                  },
                },
              },
            },
          ]
        : d.paymentMethod === 'pix'
          ? [{ payment_method: 'pix', pix: { expires_in: 86400 } }]
          : [
              {
                payment_method: 'boleto',
                boleto: {
                  instructions: 'Não receber após vencimento.',
                  due_at: isoDateFromNow(3),
                },
              },
            ],
  }

  console.log('[processCheckout] payload:', JSON.stringify(pagarmePayload, null, 2))

  let response: Response
  try {
    response = await fetch('https://api.pagar.me/core/v5/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pagarmePayload),
    })
  } catch (err) {
    console.error('[processCheckout] falha de rede:', err)
    return { success: false, error: 'Não foi possível conectar ao servidor de pagamento. Verifique sua conexão.' }
  }

  if (!response.ok) {
    const body = await response.text()
    console.error(`[processCheckout] HTTP ${response.status} — body:`, body)
    let msg = 'Erro ao processar pagamento.'
    try {
      const err = JSON.parse(body)
      msg = err?.message ?? err?.errors?.[0]?.message ?? msg
    } catch { /* body não é JSON */ }
    return { success: false, error: `${msg} (HTTP ${response.status})` }
  }

  const responseBody = await response.json()
  console.log('[processCheckout] resposta Pagar.me:', JSON.stringify(responseBody, null, 2))

  const charge = responseBody.charges?.[0]
  const tx = charge?.last_transaction

  if (charge?.status === 'failed' || tx?.status === 'failed') {
    const gatewayMsg = tx?.gateway_response?.errors?.[0]?.message ?? ''
    const isPibNotConfigured = gatewayMsg.includes('action_forbidden') || gatewayMsg.includes('Sem ambiente')
    const userMsg = isPibNotConfigured
      ? 'Pagamento via PIX não está disponível no momento. Escolha outro método de pagamento.'
      : `Pagamento recusado pelo gateway. Tente novamente ou use outro método.`
    console.error('[processCheckout] charge failed:', gatewayMsg)
    return { success: false, error: userMsg }
  }

  if (d.paymentMethod === 'pix') {
    return {
      success: true,
      paymentMethod: 'pix',
      qrCode: tx?.qr_code ?? '',
      qrCodeUrl: tx?.qr_code_url ?? '',
    }
  }

  if (d.paymentMethod === 'boleto') {
    return {
      success: true,
      paymentMethod: 'boleto',
      boletoUrl: tx?.pdf ?? tx?.boleto_url ?? '',
      line: tx?.line ?? tx?.boleto_barcode ?? '',
    }
  }

  return {
    success: true,
    paymentMethod: 'credit_card',
    message: 'Pedido recebido com sucesso! Em breve você receberá as instruções no e-mail cadastrado.',
  }
}
