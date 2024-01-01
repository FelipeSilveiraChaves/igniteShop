import { stripe } from "@/lib/stripe";
import Head from 'next/head'
import { ImageContaier, SuccessContaier } from "@/styles/pages/success";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import Stripe from "stripe";


interface SuccessProps {
  customerName: string;
  product: {
    name: string;
    imageUrl: string;
  }
}


export default function Success({ customerName, product }: SuccessProps ){
  return (
    <>
      <Head>
          <title>Compra efetuada | Ignite Shop</title>

          <meta name="robots" content="noindex"/>
      </Head>
      <SuccessContaier>
        
        <h1>Compra Efetuada!</h1>

        <ImageContaier>
          <Image src={product.imageUrl} width={120} height={110} alt=""/>
        </ImageContaier>

        <p>Uhul <strong>{customerName}</strong>, sua <strong>{product.name}</strong> já está a caminho da sua casa.</p>


        <Link href='/'>
          Voltar ao catálogo.
        </Link>
        
      </SuccessContaier>
    </>
  )
}

// Client-side ou Server-side-rendering ou StaticProps.

// Static nao faz sentido pois não vai ser todas iguais.

// Client-side (useEffect) o Stripe não permite fazer requisições assim pois deixaria exposto a chave secreta no client.

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if(!query.session_id){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }


  const sessionId = String(query.session_id);

  console.log(sessionId);


  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  })

  const customerName = session.customer_details!.name;
  const product = session.line_items!.data[0].price!.product as Stripe.Product;

  return {
    props: {
      customerName,
      product: {
        name: product.name,
        imageUrl: product.images[0],
      }
    }
  }
}