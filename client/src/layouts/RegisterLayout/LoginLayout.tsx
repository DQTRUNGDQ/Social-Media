import Footer from 'src/components/Footer'
import '../../styles/authentication.css'

interface Props {
  children?: React.ReactNode
}

export default function LoginLayout({ children }: Props) {
  return (
    <div>
      {children}
      <Footer />
    </div>
  )
}
