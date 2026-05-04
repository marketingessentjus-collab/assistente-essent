/*
 * Essent — Shared UI Components
 * Swiss International Style: Navy + Blue + Blinker
 */
import React from 'react';
import { cn } from '@/lib/utils';

// ─── Badge ───────────────────────────────────────────────────────────────────
interface BadgeProps {
  variant?: 'blue' | 'navy' | 'green' | 'amber';
  children: React.ReactNode;
  className?: string;
}
export function Badge({ variant = 'blue', children, className }: BadgeProps) {
  const styles = {
    blue: 'bg-blue-50 text-blue-500 border border-blue-200',
    navy: 'bg-blue-950/10 text-[#002060] border border-blue-200/50',
    green: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    amber: 'bg-amber-50 text-amber-600 border border-amber-200',
  };
  return (
    <span className={cn(
      'inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
      styles[variant],
      className
    )}>
      {children}
    </span>
  );
}

// ─── Toggle Button ────────────────────────────────────────────────────────────
interface ToggleProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}
export function Toggle({ active, onClick, children, className }: ToggleProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-md border text-xs font-semibold transition-all duration-150',
        active
          ? 'border-[#0099ff] bg-[#0099ff] text-white'
          : 'border-[#dce4f5] bg-[#f2f2f2] text-[#002060] hover:border-[#0099ff] hover:text-[#0099ff]',
        className
      )}
    >
      {children}
    </button>
  );
}

// ─── Toggle Group ─────────────────────────────────────────────────────────────
interface ToggleGroupProps {
  options: { value: string; label: string }[];
  value: string | string[];
  onChange: (val: string) => void;
  multi?: boolean;
  className?: string;
}
export function ToggleGroup({ options, value, onChange, multi = false, className }: ToggleGroupProps) {
  const isActive = (v: string) => Array.isArray(value) ? value.includes(v) : value === v;
  return (
    <div className={cn('flex flex-wrap gap-1.5 mb-3', className)}>
      {options.map(opt => (
        <Toggle
          key={opt.value}
          active={isActive(opt.value)}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Toggle>
      ))}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}
export function Card({ children, className, title, subtitle }: CardProps) {
  return (
    <div className={cn(
      'bg-white rounded-xl p-6 shadow-sm border border-[#e8edf5]',
      className
    )}>
      {title && (
        <div className="text-sm font-bold text-[#002060] mb-1 flex items-center gap-2">
          {title}
        </div>
      )}
      {subtitle && (
        <p className="text-xs text-[#6b7a99] mb-4 font-normal">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

// ─── Info Box ─────────────────────────────────────────────────────────────────
interface InfoBoxProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'result';
}
export function InfoBox({ children, className, variant = 'default' }: InfoBoxProps) {
  return (
    <div className={cn(
      'rounded-lg p-3.5 text-sm leading-relaxed',
      variant === 'default'
        ? 'bg-[#f0f6ff] border border-[#cce3ff] text-[#002060]'
        : 'bg-[#f8faff] border border-[#dce4f5] text-[#002060] whitespace-pre-wrap min-h-[80px]',
      className
    )}>
      {children}
    </div>
  );
}

// ─── Form Label ───────────────────────────────────────────────────────────────
export function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-bold text-[#002060] mb-1.5 uppercase tracking-wider">
      {children}
    </label>
  );
}

// ─── Form Field ───────────────────────────────────────────────────────────────
interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}
export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <FormLabel>{label}</FormLabel>
      {children}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export const inputClass = [
  'w-full px-3 py-2.5 bg-[#f8faff] border border-[#dce4f5] rounded-lg',
  'text-[#002060] font-[Blinker,sans-serif] text-sm',
  'transition-all duration-200',
  'focus:outline-none focus:border-[#0099ff] focus:ring-2 focus:ring-[#0099ff]/10',
  'placeholder:text-[#6b7a99]/60',
].join(' ');

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectFieldProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
}
export function SelectField({ value, onChange, options, className }: SelectFieldProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={cn(inputClass, 'cursor-pointer', className)}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ─── Primary Button ───────────────────────────────────────────────────────────
interface BtnProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'secondary' | 'danger';
  full?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}
export function Btn({ onClick, children, variant = 'primary', full, disabled, className, type = 'button' }: BtnProps) {
  const styles = {
    primary: 'bg-[#002060] text-white hover:bg-[#0033a0]',
    accent: 'bg-[#0099ff] text-white hover:bg-[#007acc]',
    secondary: 'bg-[#f2f2f2] text-[#002060] border border-[#dce4f5] hover:border-[#0099ff] hover:text-[#0099ff]',
    danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg',
        'text-xs font-bold uppercase tracking-wider transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        styles[variant],
        full && 'w-full',
        className
      )} style={{fontWeight: '600'}}
    >
      {children}
    </button>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}
export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-black text-[#002060] mb-1">{title}</h1>
      {subtitle && <p className="text-sm text-[#6b7a99]">{subtitle}</p>}
    </div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────
export function LoadingSpinner({ text = 'Gerando...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-[#0099ff] text-sm font-semibold p-3">
      <span className="spin-anim">⟳</span>
      {text}
    </div>
  );
}

// ─── Copy Button ──────────────────────────────────────────────────────────────
interface CopyBtnProps {
  text: string;
  className?: string;
}
export function CopyBtn({ text, className }: CopyBtnProps) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <Btn variant="secondary" onClick={handleCopy} className={className}>
      {copied ? '✅ Copiado!' : '📋 Copiar'}
    </Btn>
  );
}

// ─── Result Box ───────────────────────────────────────────────────────────────
interface ResultBoxProps {
  content: string | null;
  loading?: boolean;
  placeholder?: string;
  minHeight?: string;
  onCopy?: boolean;
}
export function ResultBox({ content, loading, placeholder, minHeight = '280px', onCopy = true }: ResultBoxProps) {
  return (
    <div>
      <div
        className="bg-[#f8faff] border border-[#dce4f5] rounded-lg p-4 text-sm text-[#002060] leading-relaxed whitespace-pre-wrap fade-in"
        style={{ minHeight }}
      >
        {loading ? (
          <LoadingSpinner />
        ) : content ? (
          content
        ) : (
          <span className="text-[#6b7a99]/60 text-xs">{placeholder || 'O resultado aparecerá aqui...'}</span>
        )}
      </div>
      {content && onCopy && (
        <div className="flex justify-end mt-2">
          <CopyBtn text={content} />
        </div>
      )}
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-[#f2f2f2] my-5', className)} />;
}

// ─── Two Column Grid ─────────────────────────────────────────────────────────
export function Grid2({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
      {children}
    </div>
  );
}

// ─── Three Column Grid ────────────────────────────────────────────────────────
export function Grid3({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-3 gap-4', className)}>
      {children}
    </div>
  );
}
