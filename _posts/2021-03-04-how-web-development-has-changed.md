---
title: Looking back at the big changes in web development over the past 25 years
description: I recently rewrote my blog using Next.js. Using one of the most modern frameworks, coupled with the retrospective nature of polishing my bio has crystallised just how far web development has come since I first typed in a URL back in the early 90s.
image: blog-images/looking-back.jpg
date: 2021-03-04 05:00:00
hidden: false
---
I recently rewrote my blog using Next.js. Using one of the most modern frameworks coupled with the retrospective nature of polishing my bio has crystallised just how far web development has come since I first typed in a URL back in the early 90s.

So I took some time out to look back at where we've come from...

## CGI and Perl
In the early 90s the first browsers appeared in the forms of Netscape and Internet Explorer. Both leapfrogged over each other in their support of the quickly-evolving HTML specification. Compatibility was patchy, especially for newer and more complicated capabilities. Web servers tended to run on "real" Unix (Linux only just beginning to gain momentum) or early versions of IIS.

Web pages were static and there was no interactivity, just hyperlinks to other pages. Web servers were limited and typically would return a pure HTML file perhaps invoke an executable to generate an entire page of content. On Unix, these programs were often Perl scripts invoked through a technology known as the Common Gateway Interface (CGI).

## Server-side frameworks
The mid-90s saw the first server-side frameworks appear in the form of Active Server Pages from Microsoft and PHP by Ramus Lerdorf.

These CGI-enabled frameworks allowed developers to embed programming constructs into an HTML page, enabling the server-side rendering of content that could be adjusted according to user input that was encoded into query strings (the bits of information you see after the "?" in a URL).

Through the rest of the 90s and even today, server-side frameworks continue to rise and fall, although the speed of innovation has decreased in recent years as the technology is now mature.

## Client-side scripting
In the mid to late 90s, Brendan Eich developed what was to become known as JavaScript and it was made available as part of Netscape platform. Quickly copied by Microsoft and released as JScript in Internet Explorer 3. Developers now had the tools to allow client-side interactivity. Initially such interactivity was limited to simple tasks such as the restyling of elements or changing their inner content.

Producing a complex web page page that worked on both Netscape and Internet Explorer was very challenging due to their varying implementations of both the HTML specification and their differing JavaScript engines.

At the end of the 90s and into the early years of the new millennium, Internet Explorer and achieved 95% dominance and innovation slowed. This was an era of websites displaying buttons at the bottom of their websites saying "Best viewed in Internet Explorer". In hindsight, these badges were a tacit admission that the site was not concerned with cross-browser compatibility, which was hard to achieve for projects of any complexity.

## Ajax and jQuery
In the early 2000s, two transformative technologies arrived.

Firstly Ajax, a technique where JavaScript code makes requests to the server in the background. Pioneered by Microsoft in their Outlook Web Access product and later used by Google in Gmail and Google Maps, it allowed new information to be fetched from the server without having to fetch (and thus redraw) the entire page.

The second technology was jQuery, written by John Resig. jQuery provided tools to query and manipulate the browser's Document Object Model (DOM) via JavaScript. Crucially it did so while hiding all the implementation quirks exhibited by the various browsers available at the time.

In a world used to interactive web pages, it is hard to describe the impact these two technologies had on web development. Prior to Ajax, every significant user interaction involved the whole page being refreshed. Every button press, every click on a link required a trip to the server. On a fast corporate Intranet this might not be a big deal, but on slow public Internet connections it was often a significant delay and well above the [Doherty Threshold](https://lawsofux.com/doherty-threshold).

Ajax and jQuery changed all that. When the user clicked on a link, JavaScript could make a request asynchronously and then insert the newly fetched data into the existing web page, providing a far richer user experience.

It was these two techniques gave us the foundation of all modern web frameworks.

## Client-side frameworks
With jQuery showing that it was possible to produce a standardised, cross-browser development experience and with browser manufacturers showing an increased willingness to adopt HTML and JavaScript standards, a new class of web framework was born: the client-side framework. This space saw (and continues to see) the same rapid churn that we had with server-side frameworks in the preceding era.

One very happy side-effect of the new growth in web applications was the pressure it put on Microsoft to ensure that Internet Explorer was capable of rendering them. Internet Explorer had lagged behind Chrome, Firefox and Safari and Microsoft's browser was rapidly losing market share. Its years of entrenchment into corporate Intranets meant that it took the world years to finally rid itself of Internet Explorer and it is only in the last couple of years where frameworks have been able to rid themselves of having to provide Internet Explorer compatibility.

Client-side frameworks have enabled SPAs (single page applications) and PWAs (progressive web applications) to flourish. In these technologies, JavaScript code running on the user's web browser constructs and reconstructs a single web page, mutating it on the fly in response to user input and AJAX responses. Typically the browser will only ever request a single web page from the server (hence the term single page application).

## Where next?
It has been fascinating to see that recent developments in Next.js and React are bringing their client-side technologies back around to include server-side rendering as well. Their different approaches are motivated by desire to deliver faster first-time-to-render performance in order to achieve higher SEO rankings and to reduce client download size respectively. Another one to watch is Microsoft's approach with Blazor. Running C# code in the browser will be of tremendous interest to the corporate world in the coming years.

## Conclusion
The web framework space has been characterised by the rapid churn of new technologies, often with alarmingly short lifespans.

Progress has been faster when browser manufacturers work together to create and implement standards and stifled during periods where they pursue competing standards and we can only hope that the big three players continue to collaborate for many years to come.

Meanwhile, web technologies continue to edge ever closer to the decades old nirvana of "write once, run anywhere", but like the hare never quite catching the tortoise there is still a little way to go yet...
