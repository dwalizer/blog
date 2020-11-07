import React from "react";
import { useStaticQuery, graphql } from "gatsby"

import SEO from "../components/seo"
import Layout from "../components/layout"
import VirtualKeyboard from "../components/virtualKeyboard"

const Synthesizer = ({location}) => {

  const data = useStaticQuery(graphql`
    query SynthesizerPageQuery {
      profile: file(absolutePath: { regex: "/me.jpg/" }) {
        childImageSharp {
          fixed(width: 271, height: 271) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          title
        }
      }
    }
  `)    

    return (
        <Layout location={location} title={data.site.siteMetadata.title}>
            <SEO title="JavaScript Synthesizer" />
            <VirtualKeyboard />
            <hr style={{marginBottom: "1.75rem;"}} />
        </Layout>
    )
}

export default Synthesizer;