// import NoSSR from 'react-no-ssr';

import { isAuth } from "../actions/auth";

// const JustOnServer = () => `SSR Dashboard`;

// const NoSSRApp = () => {
//     return (
//         <div>
//             <NoSSR onSSR={<JustOnServer/>}>
//               {`${isAuth().name}'s Dashboard`}
//             </NoSSR>
//         </div>
//     )
// }

// export default NoSSRApp;

const SSRCheck = () => {
  /** If in client component */
  if (process.browser) {
    return `${isAuth().name}'s Dashboard`;
  }
  return `SSR Dashboard`;
};

export default SSRCheck;