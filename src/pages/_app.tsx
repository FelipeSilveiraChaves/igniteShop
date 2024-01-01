import { globalStyles } from '@/styles/global'
import type { AppProps } from 'next/app'
import logoimg from '../assets/logo.svg'
import Image from 'next/image'
import { Container, Header } from '@/styles/pages/app'

globalStyles() // fica fora do App pois se ficar dentro todos os componentes/paginas vao executar uma função que nao precisa


export default function App({ Component, pageProps }: AppProps) {

  return (
    <Container>
      <Header>
        <Image src={logoimg} alt="Logo ignite" />
      </Header>

      <Component {...pageProps} />
    </Container>
    
  )
}
