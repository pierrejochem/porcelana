# @porcelana/icons

51 round-cap stroke icons on a 24px grid, shipped as tree-shakable, accessible React components. Part of the [Porcelana](https://github.com/pierrejochem/porcelana) design system ([live gallery](https://pierrejochem.github.io/porcelana/)).

```bash
pnpm add @porcelana/icons
```

```tsx
import { AlarmIcon, Icon } from "@porcelana/icons";

<AlarmIcon />                              // decorative: aria-hidden
<AlarmIcon title="Alarm set" size={20} />  // announced as an image
<Icon name="chevron-down" strokeWidth={1.5} />
```

| Prop          | Default          | Notes                                              |
| ------------- | ---------------- | -------------------------------------------------- |
| `size`        | `24`             | width and height                                   |
| `strokeWidth` | `2`              | 1.5 / 2 / 2.5 match the design set                 |
| `color`       | `currentColor`   | inherits text color                                |
| `title`       | –                | sets `role="img"` + `aria-label`; omit for decor   |

Named components tree-shake; `<Icon name>` bundles every path.
