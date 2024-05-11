---
layout: layout.njk
---

# {{pkg.name}}

{{pkg.description}}

## Installation

Drag this link to your browser's bookmarks bar: <a href="javascript:void {{code}}">{{pkg.name}}</a>

## Usage

1. Open a (finished) game on [OGS](https://online-go.com/).
2. Click the bookmark you made during the Installation step.
3. A bar chart will appear in the right sidebar.
    - It displays the time spent on each move and highlights the move currently shown on the board.
    - Hovering over the chart also does something.
4. There is a "Hide" button above the chart. Click that when done.

## Changelog

Notable changes will be listed here.

### May 10, 2024

- Added basic time-per-move stats.
- Y axis ticks are based on byoyomi period time if time system is byo-yomi. Otherwise ticks default to every 30 seconds.

### April 15, 2024

- Small fix to handle new OGS game url pattern.

### March 25, 2024

- Timing chart now appears in sidebar by default, with "Expand" button to pop it out under the goban.

## Source code

[https://github.com/psalaets/ogs-move-timing](https://github.com/psalaets/ogs-move-timing)

<div style="margin-bottom: 30dvh"></div>
