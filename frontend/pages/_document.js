////////////////////////////////////////////////////////////////////////////////
// !------------------------CUSTOMIZE DOCUMENT----------------------------------
// ? Create the file ./pages/_document.js to override the default Document. 
// ? <Html>, <Head />, <Main /> and <NextScript /> are required
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD NEXT DOCUMENT--------------------------------
////////////////////////////////////////////////////////////////////////////////
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css"/>
        <link rel="stylesheet" href="../static/css/styles.css?version=1.5.6"/>
        <link rel="stylesheet" href="../static/css/customize.css?version=1.4.6"/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  };
};

////////////////////////////////////////////////////////////////////////////////
// !--------------------------PUBLIC MODULE---------------------------------
////////////////////////////////////////////////////////////////////////////////

export default MyDocument;