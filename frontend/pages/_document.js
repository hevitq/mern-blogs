////////////////////////////////////////////////////////////////////////////////
// !------------------------CUSTOMIZE DOCUMENT----------------------------------
// ? Create the file ./pages/_document.js to override the default Document.
// ? <Html>, <Head />, <Main /> and <NextScript /> are required
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD NEXT DOCUMENT--------------------------------
////////////////////////////////////////////////////////////////////////////////
import Document, { Html, Head, Main, NextScript } from "next/document";

/**
 * Bring getConfig method from next
 * to get environment variables from next.config.js
 */
import getConfig from "next/config";

/** Method to access the configuration variables */
const { publicRuntimeConfig } = getConfig();

class MyDocument extends Document {
  setGoogleTags() {
    if (publicRuntimeConfig.PRODUCTION) {
      return {
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', 'UA-174140071-1');
        `,
      };
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css"
          />
          <link
            rel="stylesheet"
            href="../static/css/styles.css?version=1.5.6"
          />
          <link
            rel="stylesheet"
            href="../static/css/customize.css?version=1.4.6"
          />
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-174140071-1"></script>
          <script dangerouslySetInnerHTML={this.setGoogleTags()}></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

////////////////////////////////////////////////////////////////////////////////
// !--------------------------PUBLIC MODULE---------------------------------
////////////////////////////////////////////////////////////////////////////////

export default MyDocument;
