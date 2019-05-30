---
layout: post
title:  "Hyperlinks in Excel not working"
date:   2019-03-01 09:33:00
categories: excel
---

Excel handles hyperlinks in an unexpected manner which can often lead to confusion and frustration when trying to access content that requires authentication.

## The problem

Depending on how your web application behaves when processing requests, when a user clicks on a link in Excel, you might get an error similar to this:

`Unable to open <url>. Cannot download the information requested.`

or

`Unable to open <url>. The internet site reports that the item you requested could not be found. (HTTP 1.0/404)`

This is because rather than Excel just passing the URL over the user's default browser to open, it is instead attempting to verify that the URL exists first, which it does by sending a HEAD request followed by a GET request. If the HEAD returns an error other than a 405 (Not Supported) or if the GET request fails, then Excel will display an error to the user. However, if they succeed then Excel will finally allow the default browser to open the URL and all is well.

The chances of these requests legitimately succeeding by themselves are slim, because Excel is making these requests with its own HTTP client which won't have any authentication cookies stored in it, so unless these links will work anonymously, they will fail.

Excel doesn't seem to do any verification of the contents of the requests it makes, you can return totally empty response bodies or anything else at all. This is why if your web application simply returns the login page for such requests, then rather than getting an error message, everything might work as expected.

## Solutions

There are several ways of solving this problem.

## 1. Stop Excel from behaving this way

Your users can set a [registry key](https://support.microsoft.com/en-gb/help/218153/error-message-when-clicking-hyperlink-in-office-cannot-locate-the-inte) to prevent Excel from behaving this way.

Obviously this is not a very customer-friendly thing to do!

## 2. Identify these requests coming from Excel and respond appropriately
Either your web server or your web application can be configured to identity requests coming from Excel and to return a success response rather than trying to process them normally.

The HEAD request uses a UserAgent string that looks similar to this:

`Microsoft Office Excel 2014 (16.0.11231) Windows NT 10.0`

and the GET request UserAgent looks like this:

`Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; ms-office`

By identifying requests with similar UserAgents to these, a 200 result can be returned.

With IIS for example, you can use the following web.config setting:

```xml
<rule name="WordBypass" enabled="true" stopProcessing="true">
    <match url=".*" />
    <conditions>
        <add input="{HTTP_USER_AGENT}" pattern="Word|Excel|PowerPoint|ms-office" />
    </conditions>
    <action type="CustomResponse" statusCode="200" statusReason="Refresh" statusDescription="Refresh" />
</rule>
```
(Source: [StackOverflow](https://stackoverflow.com/questions/2653626/why-are-cookies-unrecognized-when-a-link-is-clicked-from-an-external-source-i-e))

Or you could add code directly into your Web API actions:

```c#
[Route("blah/blah")]
public IHttpActionResult Get()
{
  if (Request.Headers.UserAgent.ToString().Contains("ms-office")) return Ok();

  ...
}
```

Or you could write an ActionFilter:

```c#
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

public class MicrosoftOfficeFilter : ActionFilterAttribute
{
  public override void OnActionExecuting(HttpActionContext actionContext)
  {
    if (actionContext.Request.Headers.UserAgent.ToString().Contains("ms-office"))
    {
      actionContext.Response = new HttpResponseMessage(HttpStatusCode.OK);
    }
    base.OnActionExecuting(actionContext);
  }
}
```