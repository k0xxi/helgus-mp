import data from '@/../product/sections/nutzerverwaltung/data.json'
import { ProfileSettings } from './components/ProfileSettings'

export default function ProfileSettingsPreview() {
  return (
    <ProfileSettings
      user={data.currentUser}
      connectedAccounts={data.connectedAccounts}
      countries={data.countries}
      onSaveProfile={(updates) => console.log('Save profile:', updates)}
      onChangePassword={() => console.log('Change password')}
      onStartVerification={() => console.log('Start verification')}
      onConnectAccount={(provider) => console.log('Connect account:', provider)}
      onDisconnectAccount={(id) => console.log('Disconnect account:', id)}
      onDeleteAccount={() => console.log('Delete account')}
    />
  )
}
