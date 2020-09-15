/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import Image from "gatsby-image"
import _ from "lodash";

import { rhythm } from "../utils/typography"

import "../styles/miniBio.css";

const MiniBio = (props) => {
  const data = useStaticQuery(graphql`
    query MiniBioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            nickname
          }
        }
      }
    }
  `)

  const { author } = data.site.siteMetadata
  return (
    <div className="mini-bio"> 
      <Link to="/about/">
        <Image fixed={data.avatar.childImageSharp.fixed} alt={author.name} imgStyle={{ borderRadius: `50%` }}
            style={{ marginRight: rhythm(1 / 2), marginBottom: 0, minWidth: 50, borderRadius: `100%` }} />
      </Link>
      <div>
        by <strong>{author.nickname}</strong> on {props.date} under
        {_.map(props.tags, tag =>
              <span style={{paddingRight: "4px", paddingLeft: "4px"}} key={tag}>
                <Link to={"/tags/" + tag}>{tag}</Link>
              </span>
        )}
      </div>
    </div>
  )
}

export default MiniBio
