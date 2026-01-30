import data from '@/../product/sections/nutzerverwaltung/data.json'
import { SellerVerificationForm } from './components/SellerVerificationForm'

export default function SellerVerificationPreview() {
  return (
    <SellerVerificationForm
      countries={data.countries}
      onComplete={(verificationData) => console.log('Verification complete:', verificationData)}
      onCancel={() => console.log('Verification cancelled')}
      onNextStep={(step, partialData) => console.log('Next step:', step, partialData)}
      onPrevStep={(step) => console.log('Previous step:', step)}
    />
  )
}
