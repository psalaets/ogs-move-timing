---
layout: layout.njk
---

# {{pkg.name}}

Write the docs here.

Bookmarklet link: <a href="javascript:{{code.latest}}">{{pkg.name}}</a>

## Releases

{% for release in collections.releases | reverse %}
  ### v{{release.data.version}} {{"(current)" if loop.first else ""}}

  Date: {{release.date | yyyymmdd}}

  Bookmarklet Link: <a href="javascript:{{release.data.code}}">{{release.data.version}}</a>

  Release Notes: {{release.content | safe}}
{% else %}
  No releases yet.
{% endfor %}
