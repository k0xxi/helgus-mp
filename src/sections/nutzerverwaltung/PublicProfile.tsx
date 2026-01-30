import data from '@/../product/sections/nutzerverwaltung/data.json'
import { PublicProfile } from './components/PublicProfile'

export default function PublicProfilePreview() {
  // Use the first public profile with its listings
  const profile = data.publicProfiles[0]

  return (
    <PublicProfile
      profile={profile}
      listings={data.userListings}
      onSendMessage={(userId) => console.log('Send message to:', userId)}
      onViewListing={(listingId) => console.log('View listing:', listingId)}
      onViewAllListings={(userId) => console.log('View all listings for:', userId)}
    />
  )
}
