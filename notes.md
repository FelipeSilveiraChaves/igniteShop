- [Next.js](#nextjs)
- [Rotas no Next](#rotas-no-next)
  - [params](#params)
  - [Navigation](#navigation)
- [arquivos iniciais](#arquivos-iniciais)
- [Images no Next.js](#images-no-nextjs)
- [**getServerSideProps**](#getserversideprops)
- [**getStaticProps**](#getstaticprops)
  - [Ah mas quando que a pagina vai ser atualizada denovo? Ela é?](#ah-mas-quando-que-a-pagina-vai-ser-atualizada-denovo-ela-é)
  - [Então só posso criar paginas sem conteúdo Dinâmico?](#então-só-posso-criar-paginas-sem-conteúdo-dinâmico)
  - [*getStaticPaths*](#getstaticpaths)
    - [fallback](#fallback)
- [quando usar um ou outro?](#quando-usar-um-ou-outro)
- [link prefetch](#link-prefetch)
- [API routes](#api-routes)



# Next.js

*O que é o Next.js?*

Next.js é um framework do react, que facilita a criação dos site, e principalmente ajuda no problema dos SEO's com os sites react e na performace, além de muitas outras coisas.


*Como o Next.js resolve esses problemas?*

Em vez de ser feito em SPA que nem no react puro, ele é feito SSR (Server Side Rendering), ou seja, o Next.js é basicamente um servidor Node.js em que ele renderiza e interpreta o código do react, e manda para o navegador do client o código mastigado já, assim não tendo que esperar as requisições de uma possivel API, pois o Next.js ja faz a requisição antes de chegar no client.

*Mas por que isso ajuda com os problemas de SEO?*

Isso ajuda com os problemas de SEO pelo fato que os bots de SEO, normalmente para conseguirem performar mais rapido, ele não leem o javascript da pagina, assim ignorando possivelmente a request feita para uma API. Pelo fato do servidor do Next.js mandar já pronto o html, faz com que os SEO's sempre estejam com as paginas prontas.


# Rotas no Next

As rotas do React são feitas pela pasta `pages`, cada arquivo é considerado uma rota do app, de acordo com seu nome.
```js
├── /pages
│   ├── /products  // pasta products
│   │   └─────────── [id].tsx
│   └── profile.tsx 

```
Aqui está um exemplo de estrutura de paginas.

onde existe uma pagina profile e outra [pagina] de products que cada pagina deve receber um parametro *(atentar que é dentro de outra pasta)*

## params

Dentro da pasta ``pages`` padrao do Next, tem uma outra pasta com um arquivo *[id].tsx*, isso é a forma de sinalizar para next que aquela rota possui parametros.

Para resgatar o parametro usa tal sintaxe, onde query é o valor do id

## Navigation 

Para nevagar entre rotas é muito importante usar o <Link></Link> pois faz com que o Next saiba o que deve ser renderizado e o que não deve ser renderizado

```tsx
import { useRouter } from 'next/router'

export default function Product() {
  const { query } = useRouter()
}
```

# arquivos iniciais

_app.tsx, é tipo o app.tsx do react mesmo é onde vão as coisas que serão aplicadas a todas as paginas, idependente de qual seja.
_index.tsx, é tipo o index.html do react mesmo. mas com a estrutura de componente


# Images no Next.js

No next tem um Componente que se chama "Image", e ele faz optimização automatica para suas imagens, que é fenomenal, transforma imagens em webp, muda o tamanho delas, dependendo do tamanho.

```jsx
<Image src={camiseta1} width={520} height={480} alt="Camiseta1"/>

```
**!** importante passar altura e largura para que quando o next for redimensionar ele saiba qual o tamanho ideal/maximo


# **getServerSideProps**

Isso é um função usada para executar codigos no lado do server com Next.js.
Usado muito para data Fetching, mas só para dados cruciais

```tsx
export const getServerSideProps = () => {
  // codigo delay 2s

  return {
    props: {
      list: [1, 2, 3]
    }
  }
}
```

com um codigo que faça o js parar por 2s, o site só vai aparecer em tela após TUDO que esta presente no getServerSideProps estiver pronto, logo após isso ele abre o site, porém SÓ após tudo estiver pronto.


# **getStaticProps**

staticProps funciona com paginas estáticas. 

Quando a primeira pessoa entra na pagina, o Next gera um arquivo html estatico para a página, e o guarda em cache no seu servidor Node presente no next.js.

Assim, quando mais pessoas entrarem na pagina elas receberão o arquivo guardado em cache.


## Ah mas quando que a pagina vai ser atualizada denovo? Ela é?

Sim, quando tu passa o metodo getStaticProps, na parte do retorno além das props. Tu passa para ele um revalidate, que contém um tempo para a pagina ser renderizada denovo. Assim que esse tempo chegar a próxima pessoa que entra no site vai renderizar para um novo cache a nova pagina que vai ficar sendo entregue para os futuros visitantes.

## Então só posso criar paginas sem conteúdo Dinâmico?

Não! Podes fazer requisições padrão do react, usando o própio useEffect mesmo, mas junto as partes que possam ser estáticas continuam estáticas. 

**um bom exemplo é o do site de Notícias.**

No site de noticias, as noticias na maioria das vezes são estaticas e não são mudadam de maneira imediata. Mas as informações como por exemplo quantas horas fazem que foi feita a postagem/noticia são usando o propio useEffect.


## *getStaticPaths*

Uma função que ajuda o getStaticProps a entender quais paginas ele tem que criar o modelo estático.

```jsx
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

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {/* code... */}
```

Ele retorna uma propriedade em array de objetos chamado paths, que tem um objeto chamado params **(PARA CADA ID)**, que contém o id dos params da pagina que serão carregados de forma estática

### fallback

fallback é o que o next vai fazer com as outras páginas que não estão na lista de parametros esperados.

[fallback]: false 
Vai retornar error 404 para todas as paginas nao listadas.

[fallback]: true
O true, vai basicamente por baixo dos panos fazer com que a pagina volte a ser um SSR, e tenta criar a pagina.

Tem uma propriedade do useRoute do nextJS, que é isFallback que é true o momento em que tu ta carregando a pagina do fallback

é usado para editar sites para ficarem com a aparencia de carregando.

```jsx
 const { isFallback } = useRouter()

  if (isFallback) {
    return <p>...Loading</p>
  }
  
```

[fallback]: 'blocking' 
O blocking ele é a mesma coisa do true, só o isFallback do true não existe, ele fica parado esperando completar.

# quando usar um ou outro?

quando uma pagina é personalizada, ou adaptada para cada usuário é bem melhor usar *getServerSideProps*.

e quando puder pré-renderizar paginas é bom usar o *getStaticProps* (dados pré-determinados e não dependem de informações específicas de cada solicitação)

# link prefetch

link prefetch é um mecanismo do Next, que toda vez que aparece um link em tela ele faz um pré-carregamento. Para adiantar o carregamento.
Porém isso em por exemplo um e-commerce é muita coisa pois vai fazer 400 requisições direto.
Para lidar com isso se usa o preFetch em false. Aí ele só faz o preFetch no momento do **hover**

```jsx
    <Link href={`/product/${product.id}`} key={product.id} prefetch={false}>
```


# API routes

  São rotas server-side

API Routes no Next.js são endpoints de API criados no diretório pages/api, permitindo construir APIs diretamente no projeto Next.js. Cada arquivo dentro de pages/api é um endpoint. Métodos HTTP como GET e POST podem ser tratados no mesmo arquivo. Compartilha código com as páginas, usa variáveis de ambiente e permite tratamento de erros. Facilita a integração entre o lado do cliente (React) e do servidor. Ideal para construir APIs que fornecem dados para suas páginas ou interagem com bancos de dados.