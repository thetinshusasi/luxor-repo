"use client";

import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
    label: string;
    children: ReactNode;
    htmlFor?: string;
    required?: boolean;
}

export function FormField({ label, children, htmlFor, required = false }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={htmlFor} className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
                {label}
            </Label>
            {children}
        </div>
    );
} 