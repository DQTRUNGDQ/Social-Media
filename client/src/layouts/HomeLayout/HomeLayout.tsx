import Sidebar from 'src/components/Sidebar'
import '../../styles/home.css'

interface Props {
  children?: React.ReactNode
}

export default function HomeLayout({ children }: Props) {
  return (
    <div>
      <Sidebar />
      {children}
    </div>
  )
}
