import '../styles/globals.css'
import { ApolloProvider } from '@apollo/client/react'
import client from '../lib/apolloClient'
import { Header } from '../components'

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Header />
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp
