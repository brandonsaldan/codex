import '@/styles/tailwind.css'
import 'focus-visible'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return <>
  <Head>
  <title>GeneCodex</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charSet="utf-8" />
    <meta name="keywords" content="genecodex, snpedia" />
    <meta name="author" content="Brandon Saldan" />
    <meta name="robots" content="index, follow" />
    <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
    <meta httpEquiv="content-language" content="en" />
    <meta
      name="description"
      content="GeneCodex is a free, open-source tool that analyzes your DNA data and provides you with a report of your genetic variants."
    />
    <link rel="icon" href="/images/logo.png" />
    {/* Open Graph / Facebook */}
    <meta property="og:image" content="https://raw.githubusercontent.com/brandonsaldan/codex/main/public/images/og-image.png" />
    <meta property="og:image:width" content="1760"/>
    <meta property="og:image:height" content="880"/>
    <meta property="og:title" content="GeneCodex" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://codex-brandonsaldan.vercel.app/" />
    <meta property="og:description" content="GeneCodex is a free, open-source tool that analyzes your DNA data and provides you with a report of your genetic variants." />
    {/* Open Graph / Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:domain" content="https://codex-brandonsaldan.vercel.app/" />
    <meta name="twitter:title" content="GeneCodex" />
    <meta name="twitter:description" content="GeneCodex is a free, open-source tool that analyzes your DNA data and provides you with a report of your genetic variants." />
    <meta name="twitter:image" content="https://raw.githubusercontent.com/brandonsaldan/codex/main/public/images/og-image.png" />
  </Head>
  <Component {...pageProps} />
  </>
}
