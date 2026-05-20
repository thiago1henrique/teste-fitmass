import { z } from 'zod'

function isValidCPF(cpf: string): boolean {
  const d = cpf.replace(/\D/g, '')
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false
  let s = 0
  for (let i = 0; i < 9; i++) s += +d[i] * (10 - i)
  let r = (s * 10) % 11
  if (r >= 10) r = 0
  if (r !== +d[9]) return false
  s = 0
  for (let i = 0; i < 10; i++) s += +d[i] * (11 - i)
  r = (s * 10) % 11
  if (r >= 10) r = 0
  return r === +d[10]
}

export const checkoutSchema = z
  .object({
    // Informações pessoais
    name: z
      .string()
      .min(3, 'Nome deve ter pelo menos 3 caracteres')
      .max(64, 'Nome muito longo')
      .regex(/\S+\s+\S+/, 'Digite seu nome completo'),
    email: z.string().email('E-mail inválido'),
    cpf: z.string().refine(isValidCPF, 'CPF inválido'),
    phone: z.string().min(14, 'Telefone inválido'),

    // Endereço de cobrança
    zipCode: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
    street: z.string().min(1, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, 'Bairro é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().length(2, 'Selecione o estado'),

    // Pagamento
    paymentMethod: z.enum(['credit_card', 'pix', 'boleto']),

    // Cartão de crédito (condicional)
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
    installments: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod !== 'credit_card') return

    const rawCard = (data.cardNumber ?? '').replace(/\D/g, '')
    if (rawCard.length < 16) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Número do cartão inválido',
        path: ['cardNumber'],
      })
    }
    if (!data.cardName || data.cardName.trim().split(/\s+/).length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Digite o nome completo conforme no cartão',
        path: ['cardName'],
      })
    }
    if (!data.cardExpiry || !/^\d{2}\/\d{2}$/.test(data.cardExpiry)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Validade inválida — use MM/AA',
        path: ['cardExpiry'],
      })
    }
    if (!data.cardCvv || data.cardCvv.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CVV inválido',
        path: ['cardCvv'],
      })
    }
  })

export type CheckoutFormData = z.infer<typeof checkoutSchema>
export type PaymentMethod = CheckoutFormData['paymentMethod']
