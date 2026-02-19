"use client";

/**
 * Lightweight Select implementation using native <select>.
 * Matches the shadcn/ui Select API so existing imports work unchanged.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectItem {
  value: string;
  label: string;
}

interface SelectCtx {
  value: string;
  onValueChange: (value: string) => void;
  items: SelectItem[];
  setItems: React.Dispatch<React.SetStateAction<SelectItem[]>>;
}

const SelectContext = React.createContext<SelectCtx | null>(null);

function useCtx() {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("Select sub-components must be inside <Select>");
  return ctx;
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

function Select({ value, onValueChange, children, disabled }: SelectProps) {
  const [items, setItems] = React.useState<SelectItem[]>([]);

  // Pre-collect SelectItem values/labels from children tree
  React.useEffect(() => {
    const collected: SelectItem[] = [];
    function walk(node: React.ReactNode) {
      React.Children.forEach(node, (child) => {
        if (!React.isValidElement(child)) return;
        if ((child.type as any).displayName === "SelectItem") {
          collected.push({
            value: child.props.value as string,
            label: String(child.props.children ?? child.props.value),
          });
        }
        if (child.props?.children) walk(child.props.children);
      });
    }
    walk(children);
    setItems(collected);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SelectContext.Provider value={{ value, onValueChange, items, setItems }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

// ─── SelectTrigger ────────────────────────────────────────────────────────────

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white",
        className
      )}
      {...props}
    >
      <span className="flex-1 truncate">{children}</span>
      <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400 ml-2" />
    </div>
  )
);
SelectTrigger.displayName = "SelectTrigger";

// ─── SelectValue ──────────────────────────────────────────────────────────────

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value, items } = useCtx();
  const label = items.find((i) => i.value === value)?.label;
  return <span>{label ?? placeholder ?? value}</span>;
}

// ─── SelectContent ────────────────────────────────────────────────────────────

function SelectContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { value, onValueChange, items } = useCtx();

  return (
    <>
      {/* Invisible children — purely so SelectItem.displayName can be detected */}
      <div style={{ display: "none" }}>{children}</div>
      {/* Native select overlays the trigger */}
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn("absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10", className)}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </>
  );
}

// ─── SelectItem ───────────────────────────────────────────────────────────────

function SelectItem({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  // Rendered inside hidden div in SelectContent; real options built from items state
  return null;
}
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
