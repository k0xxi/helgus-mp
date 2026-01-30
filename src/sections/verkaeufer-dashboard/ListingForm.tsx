import data from '@/../product/sections/verkaeufer-dashboard/data.json'
import { ListingForm } from './components/ListingForm'

export default function ListingFormPreview() {
  return (
    <ListingForm
      categories={data.categories}
      onSubmit={(formData) => console.log('Submit listing:', formData)}
      onCancel={() => console.log('Cancel form')}
      onNextStep={(step, partialData) => console.log('Next step:', step, partialData)}
      onPrevStep={(step) => console.log('Previous step:', step)}
    />
  )
}
