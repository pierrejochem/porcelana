import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from "react";
import { DropdownMenu as MenuPrimitive } from "radix-ui";
import { CheckIcon } from "@porcelana/icons";
import { cn } from "../lib/cn";
import { useIsMobile } from "../lib/useMediaQuery";

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;
export const DropdownMenuSub = MenuPrimitive.Sub;

export interface DropdownMenuContentProps extends ComponentPropsWithoutRef<typeof MenuPrimitive.Content> {
  /** Render as a bottom action sheet under 640px. Defaults to true. */
  sheetOnMobile?: boolean;
}

export const DropdownMenuContent = forwardRef<ElementRef<typeof MenuPrimitive.Content>, DropdownMenuContentProps>(
  function DropdownMenuContent({ className, sideOffset = 8, collisionPadding = 8, sheetOnMobile = true, ...props }, ref) {
    const mobile = useIsMobile();
    const sheet = sheetOnMobile && mobile;
    return (
      <MenuPrimitive.Portal>
        <MenuPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          data-sheet={sheet ? "" : undefined}
          className={cn("pl-menu", "pl-root", sheet && "pl-menu--sheet", className)}
          {...props}
        />
      </MenuPrimitive.Portal>
    );
  }
);

export interface DropdownMenuItemProps extends ComponentPropsWithoutRef<typeof MenuPrimitive.Item> {
  danger?: boolean;
  icon?: ReactNode;
  shortcut?: string;
}

export const DropdownMenuItem = forwardRef<ElementRef<typeof MenuPrimitive.Item>, DropdownMenuItemProps>(function DropdownMenuItem(
  { className, danger, icon, shortcut, children, ...props },
  ref
) {
  return (
    <MenuPrimitive.Item ref={ref} className={cn("pl-menu-item", danger && "pl-menu-item--danger", className)} {...props}>
      {icon}
      {children}
      {shortcut ? (
        <span className="pl-menu-shortcut" aria-hidden="true">
          {shortcut}
        </span>
      ) : null}
    </MenuPrimitive.Item>
  );
});

export const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof MenuPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(function DropdownMenuCheckboxItem({ className, children, ...props }, ref) {
  return (
    <MenuPrimitive.CheckboxItem ref={ref} className={cn("pl-menu-item", "pl-menu-item--inset", className)} {...props}>
      <span className="pl-menu-indicator">
        <MenuPrimitive.ItemIndicator>
          <CheckIcon size={16} strokeWidth={3} />
        </MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
});

export const DropdownMenuRadioItem = forwardRef<
  ElementRef<typeof MenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(function DropdownMenuRadioItem({ className, children, ...props }, ref) {
  return (
    <MenuPrimitive.RadioItem ref={ref} className={cn("pl-menu-item", "pl-menu-item--inset", className)} {...props}>
      <span className="pl-menu-indicator">
        <MenuPrimitive.ItemIndicator>
          <span className="pl-radio-dot" style={{ width: 8, height: 8, background: "currentColor" }} />
        </MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
});

export const DropdownMenuLabel = forwardRef<ElementRef<typeof MenuPrimitive.Label>, ComponentPropsWithoutRef<typeof MenuPrimitive.Label>>(
  function DropdownMenuLabel({ className, ...props }, ref) {
    return <MenuPrimitive.Label ref={ref} className={cn("pl-menu-label", className)} {...props} />;
  }
);

export const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof MenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return <MenuPrimitive.Separator ref={ref} className={cn("pl-menu-separator", className)} {...props} />;
});
