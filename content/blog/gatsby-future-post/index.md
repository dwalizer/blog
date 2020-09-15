---
title: Hiding future posts in Gatsby
date: "2020-09-14T18:45:03.284Z"
description: "What to do when you want to plan ahead"
tags: ["react", "gatsby", "programming"]
---

I've been a bit busier recently, and so it's been more beneficial for me to plan ahead for the
next several days / tasks, and to use my free time to knock several things out at once.  But I
don't necessarily want to just dump all that work into the world at once.  So, I wanted to make
it so that I could have blog posts with future dates, that Gatsby would effectively ignore until
time caught up with those dates.  There's probably an official way to do this somewhere, but I
thought it would be a fun little exercise to just noodle around with it myself.

First, we'll want to install moment, as that makes working with dates in JavaScript a lot easier.
From our project folder:

```
npm install moment
```

Once that's done, I first looked at **index.js**.

```javascript
import moment from "moment";
```

Now, the logic is pretty simple.  It'll look something like this.

```javascript
moment(article.date).diff(moment()) < 0
```

Of course, article.date isn't the actual name of our values.  In index.js, we actually need to
be looking at **node.frontmatter.date**.  So, once we enter the map statement where we iterate
over all the posts, right after the return, we add the logic.

```javascript
{posts.map(({ node }) => {
    const title = node.frontmatter.title || node.fields.slug
    return (
        moment(node.frontmatter.date).diff(moment()) < 0 ?
            <article key={node.fields.slug}>
                <header>
                  <h3
                    style={{
                      marginBottom: rhythm(1 / 4),
                    }}
                  >
                    <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                      {title}
                    </Link>
                  </h3>
                  <small>{node.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: node.frontmatter.description || node.excerpt,
                    }}
                  />
                </section>
            </article>
        : null
    )
})}
```

Save the file and reload the page, and you should see that any blogs with a date past the current date
and time will no longer display.  Great!  So, we're done, right?  Well, not quite.  If you click on the
most recent blog entry and scroll to the bottom, you'll notice that you can still click to your future
entry from here.  We don't want that, of course!  So, we have to account for that as well.

Now, in my case, I first tried to reuse the logic, basically the same as it was above, but using the **next**
variable.

```javascript
{next && moment(next.frontmatter.date).diff(moment()) <= 0 ?
    <Link to={next.fields.slug} rel="next">
        {next.frontmatter.title} →
    </Link>
: null}
```

But this wasn't working correctly.  It turned out, the query wasn't actually getting a date for these
articles, so it really had no clue if this was in the future or not.  So, in gatsby-node.js, I made a
slight modification.

```javascript
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                date
                tags
              }
            }
          }
        }
        tagsGroup: allMarkdownRemark(limit: 2000) {
          group(field: frontmatter___tags) {
            fieldValue
          }
        }
      }
    `
  )
```

Note the frontmatter section - I had to add the date property here to actually get the date.
Now, with that value in place, save and restart Gatsby, and you should no longer be able to
navigate to the next post.

But.  If you clicked one of the tags, the post **still** shows up in the list of tags.  So,
let's add something similar there, in our tags.js file.

```javascript
moment(date).diff(moment()) < 0 ?
    <li key={slug}>
        <Link to={slug}>{title}</Link>
    </li>
: null
```

Be sure to import moment in this component if you haven't already.  Save it and give the
environment a refresh, and now you should see the appropriate posts filtered out.

Now, to be completely honest with you, this is not a very elegant solution, but it was
fun to poke around at Gatsby and a bit of GraphQL to see what I could do with it.
Realistically, a better solution is likely to modify the GraphQL queries so that the
posts themselves are filtered out, so that's probably what I'll try out next, at least to
become better familiar with GraphQL.