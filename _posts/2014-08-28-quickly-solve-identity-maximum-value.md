---
layout: post
title:  "A quick solution to hitting the int maximum value in an identity column"
date:   2014-08-28 05:58:00
categories: sqlserver
---

SQL Server has a nasty surprise in store for the unwary. One day you wake up to
find that inserts into a table are failing with an error like this:

{% highlight text %}
Server: Msg 8115, Level 16, State 1, Line 1 Arithmetic overflow error converting
IDENTITY to data type int. Arithmetic overflow occurred.
{% endhighlight %}

What has happened here? The table was designed with the primary key pattern that
we see in examples all over the web:

{% highlight sql %}
create table [Test]
(
  [TestID] int not null identity(1,1)
)
{% endhighlight %}

So `TestID` was declared as an `int`, SQL Server's 32-bit integer type, which
can represent numbers up to 2,147,483,647. Once the identity value has passed
this limit, inserts will fail with the error above until you do something about
it.

The obvious and cleanest solution is increase the size of the identity column,
maybe going from int -> bigint, which is 64-bit.

{% highlight sql %}
alter table [Test] alter column [TestID] bigint
{% endhighlight %}

This will require exclusive access to the table and if you've really got
2 billion rows in there, then it will take a significant amount of time and
disc space to complete.

However there is another way... 'int' is a signed value and the initial declaration
of the identity used the classic `(1,1)`, meaning start at 1 and increment. But
what about the negative values? If your application code can handle it, then
you can instantly start using the "other" 2 billion identity values that range
from -2,147,483,648 up to -1:

{% highlight sql %}
dbcc checkident ('Test', reseed, -2147483648)
{% endhighlight %}

This command completes quickly, even on a table with a billion rows, and lets
you get the database up and running again quickly so you can plan for a more
controlled migration to a larger identity column.
