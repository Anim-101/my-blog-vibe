---
title: "Designing Accessible User Interfaces"
date: "May 10, 2024"
readTime: "6 min read"
excerpt: "Why digital accessibility isn't just about compliance—it's about empathy and crafting better user experiences for everyone."
---

# Designing Accessible User Interfaces

Web accessibility is a critical metric for production software. When we ignore accessibility, we effectively lock out millions of users with varying forms of impairments.

## Semantic HTML over `div`s

The foundation of accessibility starts with HTML semantics. A screen reader relies fundamentally on proper tags to understand the layout and hierarchy.

Never use a clickable `div` when you really mean `button`. The actual `button` tag brings free, native keyboard navigation via the "Tab" and "Enter" keys, whereas a stylized `div` does not unless manually polyfilled with massive JavaScript handlers.

```html
<!-- BAD: Cannot naturally focus via keyboard -->
<div class="submit-btn" onclick="submit()">Submit</div>

<!-- GOOD -->
<button onClick="submit()" aria-label="Submit Form">Submit</button>
```

## The Value of Contrast

Contrast ratios between text and background should always maintain WCAG AAA compliance. Tools like Lighthouse make measuring your contrast a straightforward CI/CD checkpoint!
