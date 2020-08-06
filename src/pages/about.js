import React from "react";
import { graphql } from "gatsby"

import SEO from "../components/seo"
import Layout from "../components/layout"

const About = ({data, location}) => {    
    

    return (
        <Layout location={location} title={"Don Walizer Jr"}>
            <SEO title="About Me" />
            <div>About me</div>
        </Layout>
    )
}

export default About;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`