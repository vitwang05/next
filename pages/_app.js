import "../styles/globals.css"
import { ApolloProvider } from '@apollo/client/react'
import client from '../lib/apolloClient'
import { Header, Footer, BackToTop } from '../components'
import { useEffect } from 'react'

function Effects() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const revealEls = new Set()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target
        if (entry.isIntersecting) {
          el.classList.add('show')
        } else {
          el.classList.remove('show')
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' })

    const queryAndObserve = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        if (!revealEls.has(el)) {
          revealEls.add(el)
          observer.observe(el)
        }
      })
      // mark known scroll roots (shop list container) if present
      document.querySelectorAll('[data-scroll-root]')
    }

    queryAndObserve()
    const mo = new MutationObserver(queryAndObserve)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mo.disconnect()
    }
  }, [])
  return null
}

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Effects />
      <Header />
      <Component {...pageProps} />
      <Footer />
      <BackToTop />
    </ApolloProvider>
  )
}

export default MyApp
