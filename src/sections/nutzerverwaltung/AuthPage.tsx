import { AuthPage } from './components/AuthPage'

export default function AuthPagePreview() {
  return (
    <AuthPage
      initialMode="login"
      onLogin={(email, password, rememberMe) =>
        console.log('Login:', { email, password, rememberMe })
      }
      onRegister={(data) =>
        console.log('Register:', data)
      }
      onSocialLogin={(provider) =>
        console.log('Social login:', provider)
      }
      onForgotPassword={() =>
        console.log('Forgot password')
      }
    />
  )
}
