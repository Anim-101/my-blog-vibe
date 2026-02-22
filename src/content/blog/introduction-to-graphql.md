---
title: "An Introduction to GraphQL vs REST"
date: "June 25, 2024"
readTime: "11 min read"
excerpt: "Analyzing the trade-offs of switching an established API from a traditional RESTful architecture to a structured GraphQL layer."
---

# Introduction to GraphQL vs REST

For a long time, Representational State Transfer (REST) has been the reigning paradigm for designing networked APIs. GraphQL arrived recently as a strong challenger, offering significant solutions to classic REST problems like over-fetching.

## The Over-fetching Dilemma

When fetching the profile of User "1", a classic REST API endpoint (`/users/1`) might return their name, email, address, order history, and preferences.

If your frontend component only needs the user's `name` to display in an Avatar component, all of that extra JSON data transferred over the network is essentially wasted payload size.

## Enter GraphQL Queries

GraphQL allows clients to perfectly define the shape of the data they want.

```graphql
query GetUserAvatar {
  user(id: "1") {
    name
  }
}
```

The client gets exactly what it needs, and nothing more. This flips the control from the server dictating the payload size, entirely over to the client application consuming it.
