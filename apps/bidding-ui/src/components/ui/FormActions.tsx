"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
    children: ReactNode;
    className?: string;
}

export function FormActions({ children, className = "flex justify-end space-x-4" }: FormActionsProps) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}

interface FormActionButtonProps {
    children: ReactNode;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
}

export function FormActionButton({
    children,
    variant = "default",
    type = "button",
    disabled = false,
    onClick,
    className
}: FormActionButtonProps) {
    return (
        <Button
            type={type}
            variant={variant}
            disabled={disabled}
            onClick={onClick}
            className={className}
        >
            {children}
        </Button>
    );
} 