// src/components/multi-select.tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckIcon,
  XCircle,
  ChevronDown,
  XIcon,
  WandSparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void;

  /** The default selected values when the component mounts. */
  defaultValue: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;
}

// Add this new component above the MultiSelect component
const SortableBadge = ({ value, option, toggleOption }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: value });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
    opacity: isDragging ? 0.5 : 1,
  };

  const IconComponent = option?.icon;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="m-1 flex cursor-move items-center rounded border px-3 py-1"
    >
      {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
      {option?.label}
      <XCircle
        className="ml-2 h-4 w-4 cursor-pointer"
        onClick={(event) => {
          event.stopPropagation();
          toggleOption(value);
        }}
      />
    </div>
  );
};

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      modalPopover = false,
      asChild = false,
      className,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    React.useEffect(() => {
      setSelectedValues(defaultValue);
    }, [defaultValue]);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (value: string) => {
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    const sensors = useSensors(
      useSensor(MouseSensor, {
        activationConstraint: {
          distance: 5,
        },
      }),
      useSensor(TouchSensor, {
        activationConstraint: {
          delay: 250,
          tolerance: 5,
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const handleDragStart = (event: DragStartEvent) => {};

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = selectedValues.indexOf(active.id as string);
        const newIndex = selectedValues.indexOf(over.id as string);

        const newSelectedValues = arrayMove(selectedValues, oldIndex, newIndex);
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "flex h-auto min-h-10 w-full items-center justify-between rounded-md border bg-inherit p-1 hover:bg-inherit",
          className
        )}
      >
        <div className="flex w-full items-center justify-between">
          {selectedValues.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="flex flex-wrap items-center">
                <SortableContext
                  items={selectedValues}
                  strategy={rectSortingStrategy}
                >
                  {selectedValues.map((value) => {
                    const option = options.find((o) => o.value === value);
                    return (
                      <SortableBadge
                        key={value}
                        value={value}
                        option={option}
                        toggleOption={toggleOption}
                      />
                    );
                  })}
                </SortableContext>
              </div>
            </DndContext>
          ) : (
            <span className="mx-3 text-sm text-muted-foreground">
              {placeholder}
            </span>
          )}
          <div className="flex items-center justify-between">
            <XIcon
              className="mx-2 h-4 cursor-pointer text-muted-foreground"
              onClick={(event) => {
                event.stopPropagation();
                handleClear();
              }}
            />
            <Separator orientation="vertical" className="flex h-full min-h-6" />
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <ChevronDown
                  onClick={handleTogglePopover}
                  className="mx-2 h-4 cursor-pointer text-muted-foreground"
                />
              </PopoverTrigger>

              <PopoverContent
                className="w-auto p-0"
                align="end"
                onEscapeKeyDown={() => setIsPopoverOpen(false)}
              >
                <Command>
                  <CommandInput
                    placeholder="Search..."
                    onKeyDown={handleInputKeyDown}
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        key="all"
                        onSelect={toggleAll}
                        className="cursor-pointer"
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            selectedValues.length === options.length
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <CheckIcon className="h-4 w-4" />
                        </div>
                        <span>(Select All)</span>
                      </CommandItem>
                      {options.map((option) => {
                        const isSelected = selectedValues.includes(
                          option.value
                        );
                        return (
                          <CommandItem
                            key={option.value}
                            onSelect={() => toggleOption(option.value)}
                            className="cursor-pointer"
                          >
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible"
                              )}
                            >
                              <CheckIcon className="h-4 w-4" />
                            </div>
                            {option.icon && (
                              <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                            )}
                            <span>{option.label}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup>
                      <div className="flex items-center justify-between">
                        {selectedValues.length > 0 && (
                          <>
                            <CommandItem
                              onSelect={handleClear}
                              className="flex-1 cursor-pointer justify-center"
                            >
                              Clear
                            </CommandItem>
                            <Separator
                              orientation="vertical"
                              className="flex h-full min-h-6"
                            />
                          </>
                        )}
                        <CommandItem
                          onSelect={() => setIsPopoverOpen(false)}
                          className="max-w-full flex-1 cursor-pointer justify-center"
                        >
                          Close
                        </CommandItem>
                      </div>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
