import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* ───── Badge ───── */
export const badgeVariants = cva("pl-badge", {
  variants: {
    tone: {
      neutral: "pl-badge--neutral",
      primary: "pl-badge--primary",
      success: "pl-badge--success",
      warning: "pl-badge--warning",
      danger: "pl-badge--danger"
    }
  },
  defaultVariants: { tone: "neutral" }
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Adds a status dot. Color is never the only signal: keep the text. */
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ className, tone, dot, children, ...props }, ref) {
  return (
    <span ref={ref} className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot ? <span className="pl-badge-dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
});

/* ───── Card ───── */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Recessed instead of raised. */
  inset?: boolean;
}
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ className, inset, ...props }, ref) {
  return <div ref={ref} className={cn("pl-card", inset && "pl-card--inset", className)} {...props} />;
});
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardHeader({ className, ...props }, ref) {
  return <div ref={ref} className={cn("pl-card-header", className)} {...props} />;
});
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading level, so cards fit the page outline. Defaults to 3. */
  level?: 2 | 3 | 4 | 5 | 6;
}
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle({ className, level = 3, ...props }, ref) {
  const Tag = `h${level}` as const;
  return <Tag ref={ref} className={cn("pl-card-title", className)} {...props} />;
});
export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function CardDescription(
  { className, ...props },
  ref
) {
  return <p ref={ref} className={cn("pl-card-description", className)} {...props} />;
});
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardContent({ className, ...props }, ref) {
  return <div ref={ref} className={cn("pl-card-content", className)} {...props} />;
});
export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardFooter({ className, ...props }, ref) {
  return <div ref={ref} className={cn("pl-card-footer", className)} {...props} />;
});

/* ───── Skeleton ───── */
export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  circle?: boolean;
}
/** Loading placeholder. Hidden from assistive tech; announce loading state on the container (aria-busy). */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { className, width = "100%", height = 12, circle, style, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn("pl-skeleton", className)}
      style={{ width: circle ? height : width, height, borderRadius: circle ? "50%" : undefined, ...style }}
      {...props}
    />
  );
});

/* ───── Avatar ───── */
export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  /** Person's name: used for alt text and to derive initials. */
  name: string;
  size?: number;
  /** Background color of the initials fallback. */
  color?: string;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, size = 44, color, className, style, ...props },
  ref
) {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn("pl-avatar", className)}
      style={{ ["--pl-avatar-size" as string]: `${size}px`, background: color, ...style }}
      {...props}
    >
      {src ? <AvatarPrimitive.Image className="pl-avatar-image" src={src} alt={name} /> : null}
      <AvatarPrimitive.Fallback role="img" aria-label={name} delayMs={src ? 400 : undefined}>
        <span aria-hidden="true">{initials(name)}</span>
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
});

export const AvatarGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AvatarGroup({ className, ...props }, ref) {
  return <div ref={ref} role="group" className={cn("pl-avatar-group", className)} {...props} />;
});
