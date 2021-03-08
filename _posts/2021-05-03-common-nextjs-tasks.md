---
title: How to highlight links to the active route in Next.js
description: The <Link> component in Next.js doesn't include the ability to highlight links that point to the currently active route. Thankfully it is easy to create a component that does.
date: 2021-03-08 09:00:00
image: blog-images/nextjs.png
---

Next.js' `<Link>` component doesn't include the ability to highlight links that point to the currently active route. Thankfully it is easy to create a component that does:

```javascript
import Link from "next/link";
import { useRouter } from "next/router";
import { Children, cloneElement } from "react";

export default function LinkActive({ children, ...props }) {
  const router = useRouter();

  const { href, activeClassName } = props;

  // Wrap string-only child in an anchor tag
  const child = typeof children === "string" ? <a>{children}</a> : Children.only(children);

  // Determine if the route or a child route is active
  const isRouteActive = router.asPath === href || router.asPath.startsWith(href + "/");

  // Add the activeClassName when the route is active
  let className = child.props.className || "";
  if (isRouteActive && className && activeClassName) className += " " + activeClassName;
  else if (isRouteActive && activeClassName) className = activeClassName;

  // Clone the child so we can add className to the props
  const clone = cloneElement(child, { className });

  return (
    <Link {...props}>{clone}</Link>
  );
}
```

### How it works
`useRouter().asPath` is used to get hold of the currently active path, which contains the URL without the protocol or host. Eg: something like `/blog/my-blog-post-title`.

If the path exactly matches the `href` parameter, or if the path begins with the `href`, then the link is considered active and the `activatedClassName` property is appended to the
`className` of the child component.

The final result is wrapped in Next's own `<Link>` component to provide all the additional functionality.

[Example on GitHub](https://github.com/richardthombs/nextjs-active-route)
