import React from "react";
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import SEO from "../components/seo"
import Layout from "../components/layout"

const About = ({location}) => {    
  const data = useStaticQuery(graphql`
    query AboutQuery {
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
            <SEO title="About Me" />
            <div style={{width: "100%", textAlign: "center"}}>
              <Image fixed={data.profile.childImageSharp.fixed} imgStyle={{borderRadius: "100%"}} />
            </div>
            <div style={{paddingTop: "50px", paddingBottom: "50px"}}>
              <p>
                Hey, I'm Don, a software developer from Baltimore.  I've been programming 
                and tinkering with computers since I was a kid.
              </p>
              <p>
                In the past, I've worked with everything from C++ and Perl to Groovy and Python.
                I've been creating user interfaces for most of my professional career, first using jQuery and jQueryUI,
                later Angular, and for the last few years, React.
              </p>
              <p>
                I decided to start this blog to document my exploration of various subjects of interest to me,
                including mobile app development, UI development, game development, languages and more.
              </p>
            </div>
            
            <hr style={{marginBottom: "1.75rem;"}} />
        </Layout>
    )
}

export default About;