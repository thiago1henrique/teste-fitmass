import HeroMyDayBase from './HeroMyDayBase'

const WHATSAPP_MYDAY =
  'https://api.whatsapp.com/send/?phone=5541984810567&text=Ol%C3%A1%2C+vim+do+site+e+gostaria+de+saber+mais+sobre+o+Fitmass+MyDay&type=phone_number&app_absent=0'

export default function HeroMyDay() {
  return (
    <HeroMyDayBase
      ariaLabel="Fitmass MyDay — IA no WhatsApp"
      badge={{ label: 'Fitmass MyDay' }}
      heading={
        <>
          <strong className="text-[#FF6A00] not-italic">Monetize</strong> o acompanhamento dos seus alunos.{' '}
          <strong className="text-[#FF6A00] not-italic">IA no WhatsApp</strong> já inclusa no seu plano.
        </>
      }
      description="O Fitmass MyDay é uma IA de acompanhamento que funciona no WhatsApp dos seus alunos, e a sua academia recebe uma parte de cada mensalidade paga."
      complement="Quanto mais alunos usam, mais a academia fatura. E o melhor: eles ficam mais motivados, treinam mais e cancelam menos."
      ctas={[
        { label: 'Quero saber como funciona', href: WHATSAPP_MYDAY, variant: 'primary' },
        { label: 'Ver planos', href: '#planos', variant: 'secondary' },
      ]}
      mockupView="aluno"
    />
  )
}
