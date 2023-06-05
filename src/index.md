---
layout: layout.njk
---

# {{pkg.name}}

{{pkg.description}}

Write the docs here.

Bookmarklet link: <a href="javascript:{{code.latest}}">{{pkg.name}}</a>

---

Everything from here down is only relevant if the [release workflow](https://github.com/psalaets/eleventy-bookmarklet#option-2-releases).

## Releases

Use the `releases` collection to create a changelog:

{% for release in collections.releases | reverse %}
  ### v{{release.data.version}} {{"(current)" if loop.first else ""}}

  Date: {{release.date | yyyymmdd}}

  Bookmarklet Link: <a href="javascript:{{release.data.code}}">{{release.data.version}}</a>

  Release Notes: {{release.content | safe}}
{% else %}
  No releases yet.
{% endfor %}
