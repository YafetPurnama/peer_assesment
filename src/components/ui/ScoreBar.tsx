import React from "react";

interface ScoreBarProps {
  /** skor ter-pilih (1-10) */
    value: number;
    onChange: (val: number) => void;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ value, onChange }) => {
const handleClick = (idx: number) => onChange(idx);

    const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const posX = e.clientX - rect.left;
    const percent = posX / rect.width;
    const idx = Math.min(10, Math.max(1, Math.round(percent * 10)));
    onChange(idx);
    };

    return (
        <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onMouseDown={handleDrag}
            onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
        >
            {Array.from({ length: 10 }, (_, i) => (
                <div
                    key={i}
                    onClick={() => handleClick(i + 1)}
                    className={`h-3 flex-1 rounded-full transition-colors
                        ${i < value
                            ? "bg-blue-600 dark:bg-blue-400"
                            : "bg-gray-300 dark:bg-gray-600"}`}
                />
            ))}
            <span className="ml-2 w-6 text-sm font-semibold text-gray-800 dark:text-gray-100">
                {value}
            </span>
        </div>
    );
};

export default ScoreBar;