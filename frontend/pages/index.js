import Head from "next/head";
import Layout from "../components/Layout";
import { withRouter } from "next/router";
import Link from "next/link";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../config";

const Index = ({ router }) => {
  const head = () => {
    return (
      <Head>
        <title>Just Developer | {APP_NAME}</title>
        <meta
          name="description"
          content="A blog about the journey to become a good developer with tutorials, tips and tricks, core skills, knowledge, experience on programming techniques and languages."
        />
        <link ref="canonical" href={`${DOMAIN}${router.pathname}`} />
        <meta
          property="og:title"
          content={`Journey to become a good developer | ${APP_NAME}`}
        />
        <meta
          property="og:description"
          content="A blog about the journey to become a good developer with tutorials, tips and tricks, core skills, knowledge, experience on programming techniques and languages."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
        <meta property="og:site_name" content={`${APP_NAME}`} />

        <meta
          property="og:image"
          content={`${DOMAIN}/static/images/vnpace.jpg`}
        />
        <meta
          property="og:image:secure_url"
          content={`${DOMAIN}/static/images/vnpace.jpg`}
        />
        <meta property="og:image:type" content="image/jpg" />
        <meta property="fb:app_id" content={`${FB_APP_ID}`} />
      </Head>
    );
  };

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <article className="overflow-hidden">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-4 font-weight-bold">Just Developer</h1>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center pt-4 pb-5">
                <h3 className="lead">
                  Logs in the journey to become a good Developer.
                </h3>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-4">
                <div className="flip flip-horizontal">
                  <div
                    className="front"
                    style={{
                      backgroundImage:
                        "url(" +
                        "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" +
                        ")",
                    }}
                  >
                    <h2 className="text-shadow text-center h1">Developer</h2>
                  </div>
                  <div className="back text-center">
                    <Link href="/categories/developer">
                      <a>
                        <h3 className="h1">Developer Logs</h3>
                      </a>
                    </Link>
                    <div className="lead">
                      <p>How to become a good developer with solid technology?</p>
                      <p>As a good developer, you need write code with best practices which easy to maintain, continuously improves skills...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="flip flip-horizontal">
                  <div
                    className="front"
                    style={{
                      backgroundImage:
                        "url(" +
                        "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" +
                        ")",
                    }}
                  >
                    <h2 className="text-shadow text-center h1">Communicator</h2>
                  </div>
                  <div className="back text-center">
                    <Link href="/categories/communicator">
                      <a>
                        <h3 className="h1">Communicator Logs</h3>
                      </a>
                    </Link>
                    <div className="lead">
                      <p>How to work well with customers in languages as Japanese?</p>
                      <p>As a good communicator, you need to learn how to use the right words in the right context for the smooth communication...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="flip flip-horizontal">
                  <div
                    className="front"
                    style={{
                      backgroundImage:
                        "url(" +
                        "https://images.unsplash.com/3/doctype-hi-res.jpg?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1046&q=80" +
                        ")",
                    }}
                  >
                    <h2 className="text-shadow text-center h1">Creator</h2>
                  </div>
                  <div className="back text-center">
                    <Link href="/categories/hoi-uc-cua-gio">
                      <a>
                        <h3 className="h1">Creator Logs</h3>
                      </a>
                    </Link>
                    <div className="lead">
                      <p>How to be proactive and creative in any situation?</p>
                      <p>As a good creator, you need to be able to quickly acquire a large amount of knowledge, and re-create it into your own experience...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="flip flip-horizontal">
                  <div
                    className="front"
                    style={{
                      backgroundImage:
                        "url(" +
                        "https://images.unsplash.com/photo-1522881193457-37ae97c905bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" +
                        ")",
                    }}
                  >
                    <h2 className="text-shadow text-center h1">Mentor</h2>
                  </div>
                  <div className="back text-center">
                    <Link href="/categories/mentor">
                      <a>
                        <h3 className="h1">Mentor Logs</h3>
                      </a>
                    </Link>
                    <div className="lead">
                      <p>How to lead and motivate others to develop together?</p>
                      <p>As a good mentor, you need enjoy the role that point others in the right direction and help them achieve their goals through times...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="flip flip-horizontal">
                  <div
                    className="front"
                    style={{
                      backgroundImage:
                        "url(" +
                        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" +
                        ")",
                    }}
                  >
                    <h2 className="text-shadow text-center h1">Partner</h2>
                  </div>
                  <div className="back text-center">
                    <Link href="/categories/partner">
                      <a>
                        <h3 className="h1">Partner Logs</h3>
                      </a>
                    </Link>
                    <div className="lead">
                      <p>How to develop skills and knowledge together through real projects?</p>
                      <p>As a good partner, you need willing to share and support others to come up with appropriate solutions to solve practical problems...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="flip flip-horizontal">
                  <div
                    className="front"
                    style={{
                      backgroundImage:
                        "url(" +
                        "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" +
                        ")",
                    }}
                  >
                    <h2 className="text-shadow text-center h1">Writer</h2>
                  </div>
                  <div className="back text-center">
                    <Link href="/categories/writer">
                      <a>
                        <h3 className="h1">Writer Logs</h3>
                      </a>
                    </Link>
                    <div className="lead">
                      <p>How to express ideas and present your thoughts effectively?</p>
                      <p>As a good writer, you need to learn how to describe things clearly so that people can easily understand...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </Layout>
    </React.Fragment>
  );
};

export default withRouter(Index);
