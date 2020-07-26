import Head from "next/head";

import Link from "next/link";

import Layout from "../../components/Layout";

import { singleCategory } from "../../actions/category";

import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";

import renderHTML from "react-render-html";

import moment from "moment";

import Card from "../../components/blog/Card";

const Category = ({category, blogs}) => {
  return (
    <React.Fragment>
      <Layout>
        <main>
          <div className="container-fluid text-center">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold">
                  {/* NOTE: category && can be hidden any bug */}
                  { category && category.name }
                </h1>
                {blogs.map((blog, index) => {
                  return (
                    <div>
                      <Card key={index} blog={blog}/>
                      <hr/>
                    </div>
                  )
                })}
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </React.Fragment>
  );
};

Category.getInitialProps = ({ query }) => {
  return singleCategory(query.slug).then(data => {
    /** NOTE: data && can be hidden any bug */
    if(data && data.error) {
      console.log(data.error);
    } else {
      return { category: data && data.category, blogs: data && data.blogs };
    };
  });
};

export default Category;