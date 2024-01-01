import { styled } from "@/styles"
import { HomeContainer, Product } from "@/styles/pages/home"
import { useKeenSlider } from 'keen-slider/react'
import { stripe } from "@/lib/stripe"
import { GetStaticProps } from "next"

import 'keen-slider/keen-slider.min.css'

import Image from "next/image"
import Stripe from "stripe"
import Link from 'next/link'
import Head from "next/head"


export const Button = styled('button', {
  backgroundColor: '$green500',
  borderRadius: 8,
  border: 0,
  padding: '4px 8px',


  span: {
    fontWeight: 'bold',
  },

  '&:hover': {
    filter: 'brightness(0.8)'

  }
})

interface HomeProps {
  products: {
    id: string,
    name: string,
    imageUrl: string,
    price: string,
  }[]
}

export default function Home({products}: HomeProps) {
  const [ sliderRef ] = useKeenSlider({
    slides: {
      perView: 2.5,
      spacing: 48,
    }
  })  
  return (
     <>
      <Head>
            <title>Home | Ignite Shop</title>
      </Head>
      <HomeContainer ref={sliderRef} className="keen-slider">
        {
          products.map(product => {
            return (
              <Link href={`/product/${product.id}`} key={product.id} prefetch={false}>
                <Product  className="keen-slider__slide" >
                <Image src={product.imageUrl} width={520} height={480} alt="Camiseta1"/>
                <footer>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </footer>
              </Product>
              </Link>
            )
          })
        }
      </HomeContainer>
      </>
    )
}



export const getStaticProps: GetStaticProps = async ({}) => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price

    if(!price.unit_amount) {
      throw new Error('No price specified')
    }

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat("pt-br", {
        style: 'currency',
        currency: 'BRL',
      }).format(price.unit_amount  / 100),
    }
  })

  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 2, // 2 hours
  }
}