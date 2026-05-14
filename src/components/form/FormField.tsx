"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormInput({
  label,
  error,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label className="subtitle-2 text-text-strong">{label}</Label>

      <Input
        className={cn(
          "h-12 rounded-2xl border-border bg-white px-4 text-sm text-text-strong shadow-none transition placeholder:text-text-muted",
          "focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/15",
          error &&
            "border-error focus-visible:border-error focus-visible:ring-error/10",
          className,
        )}
        {...props}
      />

      {error && <p className="caption text-error">{error}</p>}
    </div>
  );
}

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function FormTextarea({
  label,
  error,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <Label className="subtitle-2 text-text-strong">{label}</Label>

      <Textarea
        className={cn(
          "min-h-[132px] resize-none rounded-md border-border bg-white px-4 py-3 text-sm text-text-strong shadow-none transition placeholder:text-text-muted",
          "focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/15",
          error &&
            "border-error focus-visible:border-error focus-visible:ring-error/10",
          className,
        )}
        {...props}
      />

      {error && <p className="caption text-error">{error}</p>}
    </div>
  );
}

interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface FormSelectProps {
  label: string;
  value?: string;
  placeholder?: string;
  options: readonly SelectOption[];
  error?: string;
  onChange: (value: string) => void;
}

export function FormSelect({
  label,
  value,
  placeholder = "Select option",
  options,
  error,
  onChange,
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="subtitle-2 text-text-strong">{label}</Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            "h-12 rounded-2xl border-border bg-white px-4 text-sm text-text-strong shadow-none transition",
            "focus:border-brand focus:ring-2 focus:ring-brand/15",
            "data-[placeholder]:text-text-muted",
            error && "border-error focus:border-error focus:ring-error/10",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="overflow-hidden rounded-[20px] border border-border bg-white p-1 shadow-xl">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer rounded-xl px-3 py-2.5 text-sm text-text-strong focus:bg-background-soft focus:text-brand"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="caption text-error">{error}</p>}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="rounded-card border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="heading-3 text-text-strong">{title}</h2>
        <p className="body-2 mt-2 text-text-muted">{description}</p>
      </div>

      {children}
    </section>
  );
}
