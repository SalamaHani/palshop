// "use client";

// import * as React from "react";
// import { cn } from "@/lib/utils";
// import { Input } from "@/components/ui/input";

// type OTPInputProps = {
//   value: string;
//   onChange: (v: string) => void;
//   length?: number;
//   autoFocus?: boolean;
//   disabled?: boolean;
//   className?: string;
//   inputClassName?: string;
// };

// export function OTPInput({
//   value,
//   onChange,
//   length = 6,
//   autoFocus = true,
//   disabled = false,
//   className,
//   inputClassName,
// }: OTPInputProps) {
//   const chars = Array.from({ length }, (_, i) => value[i] ?? "");
//   const refs = React.useRef<Array<HTMLInputElement | null>>([]);

//   React.useEffect(() => {
//     if (!autoFocus) return;
//     const first = refs.current[0];
//     if (first) first.focus();
//   }, [autoFocus]);

//   function setCharAt(index: number, char: string) {
//     const arr = value.split("");
//     arr[index] = char;
//     const next = arr.join("").slice(0, length);
//     onChange(next);
//   }

//   function focusIndex(i: number) {
//     const el = refs.current[i];
//     if (el) el.focus();
//   }

//   function handleChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
//     const raw = e.target.value;
//     const onlyNum = raw.replace(/\D/g, "");
//     if (!onlyNum) {
//       // If nothing valid, clear
//       setCharAt(i, "");
//       return;
//     }

//     // If user pasted multiple digits into a single box
//     if (onlyNum.length > 1) {
//       const merged = (
//         value.slice(0, i) +
//         onlyNum +
//         value.slice(i + onlyNum.length)
//       ).slice(0, length);
//       onChange(merged);
//       const nextIndex = Math.min(i + onlyNum.length, length - 1);
//       focusIndex(nextIndex);
//       return;
//     }

//     setCharAt(i, onlyNum[0]);
//     if (i < length - 1) focusIndex(i + 1);
//   }

//   function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
//     const key = e.key;
//     if (key === "Backspace") {
//       e.preventDefault();
//       if (value[i]) {
//         setCharAt(i, "");
//         return;
//       }
//       if (i > 0) {
//         focusIndex(i - 1);
//         setTimeout(() => setCharAt(i - 1, ""), 0);
//       }
//     } else if (key === "ArrowLeft") {
//       e.preventDefault();
//       if (i > 0) focusIndex(i - 1);
//     } else if (key === "ArrowRight") {
//       e.preventDefault();
//       if (i < length - 1) focusIndex(i + 1);
//     }
//   }

//   function handlePaste(i: number, e: React.ClipboardEvent<HTMLInputElement>) {
//     e.preventDefault();
//     const text = e.clipboardData.getData("text").replace(/\D/g, "");
//     if (!text) return;
//     const merged = (
//       value.slice(0, i) +
//       text +
//       value.slice(i + text.length)
//     ).slice(0, length);
//     onChange(merged);
//     const nextIndex = Math.min(i + text.length, length - 1);
//     focusIndex(nextIndex);
//   }

//   return (
//     <div
//       className={cn("flex items-center gap-3", className)}
//       role="group"
//       aria-label="One-time passcode"
//     >
//       {chars.map((ch, i) => (
//         <Input
//           key={i}
//           ref={(el) => (refs.current[i] = el)}
//           inputMode="numeric"
//           pattern="[0-9]*"
//           maxLength={1}
//           value={ch}
//           onChange={(e) => handleChange(i, e)}
//           onKeyDown={(e) => handleKeyDown(i, e)}
//           onPaste={(e) => handlePaste(i, e)}
//           disabled={disabled}
//           className={cn(
//             "h-14 w-12 text-center text-2xl font-bold rounded-xl",
//             "focus-visible:ring-2 focus-visible:ring-offset-emerald-950",
//             "placeholder:opacity-50",
//             inputClassName
//           )}
//           aria-label={`Digit ${i + 1}`}
//         />
//       ))}
//     </div>
//   );
// }
