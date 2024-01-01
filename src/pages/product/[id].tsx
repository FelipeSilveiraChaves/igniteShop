import { stripe } from '@/lib/stripe'
import { ImageContainer, ProductContainer, ProductDetails } from '@/styles/pages/product'
import axios from 'axios'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Stripe from 'stripe'

interface ProductProps {
  product: {
    id: string,
    name: string,
    imageUrl: string,
    price: string,
    description: string,
    defaultPriceId: string,
  }
}


export default  function Product({ product }: ProductProps) {
  const [isCreatingCheckoutSessions, setIsCreatingCheckoutSessions] = useState(false)
  
  async function handleBuyClcick(){
    try {
      setIsCreatingCheckoutSessions(true)

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId
      })
  
      const { checkoutUrl } = response.data;
  
      window.location.href = checkoutUrl
  
    }
    catch(err){
      // conectar com uma ferramenta de observabilidade (Datalog/Sentry)
      setIsCreatingCheckoutSessions(false)

      alert('Falha ao redirecionar ao checkout!')

    }
  }
  

  const { isFallback } = useRouter()

  if (isFallback) {
    return (
      <p>loading...</p>
    )
  }
  return (
    <>
      <Head>
          <title>{product.name} | Ignite Shop</title>
      </Head>
        <ProductContainer>
          <ImageContainer>
            <Image src={product.imageUrl} width={520} height={480} alt=''/>
          </ImageContainer>

          <ProductDetails>
            <h1>{product.name}</h1>
            <span>{product.price}</span>
            

            <p>{product.description}</p>

            <button disabled={isCreatingCheckoutSessions} onClick={handleBuyClcick}>
              Comprar agora
            </button>
          </ProductDetails>
        </ProductContainer>
    </>
    )
}


export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: { id: 'prod_PDAemvf4bA6i8i'}
      }
    ],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params!.id

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  })

  const price = product.default_price as Stripe.Price

    if(!price.unit_amount) {
      throw new Error('No price specified')
    }

  
  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat("pt-br", {
          style: 'currency',
          currency: 'BRL',
        }).format(price.unit_amount  / 100),
        description: product.description,
        defaultPriceId: price.id,

      }
    },

    revalidate: 60 * 60 * 1 // 1 hour
  }

}